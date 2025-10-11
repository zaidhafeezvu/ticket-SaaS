import { auth } from "./auth";
import { headers } from "next/headers";
import { cache } from "react";
import { prisma } from "./prisma";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return session;
});

export const requireAuth = async () => {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  return session;
};

export const requireVerifiedEmail = async () => {
  const session = await requireAuth();
  
  // Fetch user to check email verification status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true },
  });
  
  if (!user?.emailVerified) {
    throw new Error("Email verification required");
  }
  
  return session;
};
