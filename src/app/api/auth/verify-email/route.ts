import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find verification token in database
    const verification = await prisma.verification.findFirst({
      where: {
        value: token,
        expiresAt: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user's email verified status
    await prisma.user.update({
      where: { email: verification.identifier },
      data: { emailVerified: true },
    });

    // Delete the used verification token
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Email verified successfully" 
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
