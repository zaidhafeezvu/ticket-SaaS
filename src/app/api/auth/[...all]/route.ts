import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 requests per 15 minutes
});

const handlers = toNextJsHandler(auth);

// Wrap handlers with rate limiting
export async function GET(request: NextRequest) {
  const rateLimitResponse = await authLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await authLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  return handlers.POST(request);
}

