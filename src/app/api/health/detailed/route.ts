import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Detailed Health Check API Endpoint
 * GET /api/health/detailed
 * 
 * Provides comprehensive health information including:
 * - Database connection and query performance
 * - Table counts for key models
 * - System information
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const checks: Record<string, unknown> = {};

  try {
    // 1. Basic database connection check
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStartTime;
    checks.databaseConnection = {
      status: "healthy",
      responseTime: `${dbResponseTime}ms`,
    };

    // 2. Count records in key tables
    try {
      const [userCount, ticketCount, purchaseCount, reviewCount] = await Promise.all([
        prisma.user.count(),
        prisma.ticket.count(),
        prisma.purchase.count(),
        prisma.review.count(),
      ]);

      checks.databaseTables = {
        status: "healthy",
        counts: {
          users: userCount,
          tickets: ticketCount,
          purchases: purchaseCount,
          reviews: reviewCount,
        },
      };
    } catch (error) {
      checks.databaseTables = {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // 3. Test write capability (optional, can be disabled in production)
    const testWrite = request.nextUrl.searchParams.get("testWrite") === "true";
    if (testWrite) {
      try {
        const testStartTime = Date.now();
        await prisma.$executeRaw`SELECT 1`;
        const testResponseTime = Date.now() - testStartTime;
        checks.databaseWrite = {
          status: "healthy",
          responseTime: `${testResponseTime}ms`,
        };
      } catch (error) {
        checks.databaseWrite = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    // Calculate total response time
    const totalResponseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        responseTime: `${totalResponseTime}ms`,
        uptime: process.uptime(),
        system: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || "development",
          platform: process.platform,
          memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          },
        },
        checks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Detailed health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        checks,
      },
      { status: 503 }
    );
  }
}
