import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient(
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    ? { baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL }
    : {}
);

export const { useSession, signIn, signUp, signOut } = authClient;
