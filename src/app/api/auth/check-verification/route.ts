import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ verified: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { emailVerified: true },
    });

    return NextResponse.json({ verified: user?.emailVerified || false });
  } catch (error) {
    console.error("Check verification error:", error);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
