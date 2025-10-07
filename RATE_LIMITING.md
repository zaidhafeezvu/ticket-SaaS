# Rate Limiting Implementation

This document describes the rate limiting implementation for the Ticket SaaS API routes.

## Overview

Rate limiting has been implemented on all API routes to prevent abuse, brute force attacks, and ensure fair usage. The implementation uses an in-memory sliding window approach that tracks requests per IP address.

## Implementation Details

### Core Module

**File:** `src/lib/rate-limit.ts`

The rate limiting middleware provides:
- **Sliding window algorithm** for accurate rate limiting
- **IP-based tracking** using `x-forwarded-for` or `x-real-ip` headers
- **Automatic cleanup** of expired rate limit records
- **Configurable limits** per endpoint
- **Proper HTTP headers** in rate limit responses

### API Route Protection

All API routes have been protected with appropriate rate limits:

#### Authentication Routes (`/api/auth/*`)
- **File:** `src/app/api/auth/[...all]/route.ts`
- **Limit:** 20 requests per 15 minutes
- **Purpose:** Prevents brute force attacks and credential stuffing

#### Tickets Routes
**File:** `src/app/api/tickets/route.ts`
- `GET /api/tickets`: 30 requests per minute
- `POST /api/tickets`: 10 requests per minute (create ticket)

**File:** `src/app/api/tickets/[id]/route.ts`
- `GET /api/tickets/[id]`: 60 requests per minute

#### Purchases Routes
**File:** `src/app/api/purchases/route.ts`
- `POST /api/purchases`: 5 requests per minute (strict limit to prevent abuse)
- `GET /api/purchases`: 30 requests per minute

## Rate Limit Response Format

When a rate limit is exceeded, the API returns:

**Status Code:** `429 Too Many Requests`

**Response Body:**
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

**Response Headers:**
```
Retry-After: 45
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-10-07T17:20:39.181Z
```

## Testing

Rate limiting has been tested and verified to work correctly:

### Test Results

**Auth Endpoint Test:**
- Endpoint: `GET /api/auth/session`
- Limit: 20 requests per 15 minutes
- Result: ✅ First 20 requests succeeded (status 404)
- Result: ✅ Request 21 was rate limited (status 429)
- Headers correctly returned with limit information

**Tickets Endpoint Test:**
- Endpoint: `GET /api/tickets`
- Limit: 30 requests per minute
- Result: ✅ Request 31 was rate limited (status 429)

## Configuration

### Current Limits

| Endpoint | Method | Limit | Window |
|----------|--------|-------|--------|
| `/api/auth/*` | GET/POST | 20 | 15 minutes |
| `/api/tickets` | GET | 30 | 1 minute |
| `/api/tickets` | POST | 10 | 1 minute |
| `/api/tickets/[id]` | GET | 60 | 1 minute |
| `/api/purchases` | GET | 30 | 1 minute |
| `/api/purchases` | POST | 5 | 1 minute |

### Adjusting Limits

To adjust rate limits, modify the configuration in the respective route file:

```typescript
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute in milliseconds
  maxRequests: 30, // Maximum number of requests
});
```

## Production Considerations

### Current Implementation
- ✅ In-memory storage using Map
- ✅ Per-IP tracking
- ✅ Automatic cleanup of expired entries
- ✅ Proper HTTP headers
- ✅ Sliding window algorithm

### Scaling for Production

For production deployments at scale, consider:

1. **Distributed Rate Limiting:**
   - Use Redis or another distributed cache
   - Share rate limit state across multiple servers
   - Example: Use `ioredis` or `upstash-redis`

2. **Proxy Configuration:**
   - Ensure proper `X-Forwarded-For` headers are set
   - Configure proxy to pass real client IP
   - Consider using `X-Real-IP` header

3. **Rate Limit Strategy:**
   - Consider user-based limits (in addition to IP-based)
   - Implement different tiers (free vs. paid users)
   - Add burst allowance for occasional spikes

4. **Monitoring:**
   - Log rate limit violations
   - Track rate limit usage patterns
   - Set up alerts for suspicious activity

### Redis Example (Future Enhancement)

```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest) => {
    const ip = getClientIp(request);
    const key = `ratelimit:${ip}`;
    
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, Math.ceil(config.windowMs / 1000));
    }
    
    if (count > config.maxRequests) {
      // Return 429 response
    }
    
    return null; // Allow request
  };
}
```

## Documentation Updates

The following documentation has been updated to reflect rate limiting implementation:

1. **README.md**
   - Security considerations section updated
   - Rate limiting marked as implemented (✅)
   - Detailed rate limits for each endpoint

2. **AUTHENTICATION.md**
   - API Security section updated
   - New Rate Limiting section added with full details
   - Production considerations updated

## Benefits

1. **Security:**
   - Prevents brute force attacks on authentication
   - Mitigates DoS/DDoS attacks
   - Protects against credential stuffing

2. **Fair Usage:**
   - Ensures equal access for all users
   - Prevents single user from monopolizing resources
   - Protects database from overload

3. **Cost Control:**
   - Reduces unnecessary API calls
   - Prevents abuse of free tier
   - Controls database query volume

## Limitations

1. **In-Memory Storage:**
   - Rate limits reset on server restart
   - Not shared across multiple server instances
   - Memory usage grows with unique IPs

2. **IP-Based Tracking:**
   - Multiple users behind same NAT may share limits
   - VPN users can circumvent by changing IPs
   - May need user-based limiting for authenticated routes

## Future Enhancements

- [ ] Redis integration for distributed rate limiting
- [ ] User-based rate limiting for authenticated requests
- [ ] Rate limit configuration via environment variables
- [ ] Rate limit analytics and monitoring
- [ ] Burst allowance for legitimate traffic spikes
- [ ] Whitelist/blacklist IP functionality
- [ ] Different rate limits for different user tiers
