import { NextRequest, NextResponse } from "next/server";

// Store to track request counts
// Key: IP address, Value: { count, resetTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum number of requests allowed in the window
}

/**
 * Rate limiting middleware for API routes
 * Uses a sliding window approach to limit requests per IP address
 * 
 * @param config - Configuration object with windowMs and maxRequests
 * @returns Middleware function that can be used in API routes
 */
export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get client IP address
    const ip = 
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const record = rateLimitStore.get(ip);

    // Clean up old entries periodically (optimized cleanup)
    // Only scan for cleanup every 100 requests to reduce overhead
    if (rateLimitStore.size > 1000 && Math.random() < 0.01) {
      // Use iterator to delete while iterating for better performance
      for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < now) {
          rateLimitStore.delete(key);
        }
      }
    }

    if (!record || record.resetTime < now) {
      // Create new record or reset expired one
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null; // Allow request
    }

    // Increment request count
    record.count++;

    if (record.count > maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(record.resetTime).toISOString(),
          },
        }
      );
    }

    // Update the record
    rateLimitStore.set(ip, record);
    return null; // Allow request
  };
}

/**
 * Clears the rate limit store (useful for testing)
 */
export function clearRateLimitStore() {
  rateLimitStore.clear();
}
