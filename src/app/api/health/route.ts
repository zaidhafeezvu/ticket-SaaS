import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Health Check API Endpoint
 * GET /api/health
 * 
 * Checks the health of the application and database connection.
 * Returns 200 if healthy, 503 if unhealthy.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Get database connection info (without sensitive data)
    const databaseUrl = process.env.DATABASE_URL || "";
    const dbProvider = databaseUrl.startsWith("postgresql")
      ? "PostgreSQL"
      : databaseUrl.startsWith("mysql")
      ? "MySQL"
      : databaseUrl.startsWith("sqlite")
      ? "SQLite"
      : "Unknown";

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: "connected",
          provider: dbProvider,
          responseTime: `${responseTime}ms`,
        },
        application: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || "development",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 503 }
    );
  }
}
