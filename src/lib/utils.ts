import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random avatar URL based on user email
export function getAvatarUrl(email: string): string {
  // Use DiceBear API for random avatars based on email seed
  const seed = encodeURIComponent(email);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}
