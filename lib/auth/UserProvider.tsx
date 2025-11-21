"use client";

import { ReactNode } from "react";

/**
 * Optional provider component for accessing user data throughout the app
 * 
 * Usage:
 * 1. Wrap your app with <UserProvider>
 * 2. Use the useUser hook in any child component
 * 
 * This is optional - you can use useUser directly without this provider
 */
export function UserProvider({ children }: { children: ReactNode }) {
  // The provider mainly validates that Clerk is available
  // The actual useUser hook can be used anywhere in the app
  return <>{children}</>;
}

/**
 * Re-export the hook for convenience
 */
export { useUser } from "./useUser";
