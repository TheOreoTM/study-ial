# Migration Plan: Refactoring Study-IAL

This document outlines the steps to refactor the existing codebase, switching the "Engine" (Auth & DB) while preserving the "Body" (UI & Logic).

## Phase 1: Authentication Migration (Clerk -> Stack Auth)

Since you are keeping the codebase, you will need to rip out Clerk and graft in Stack Auth.

### 1. Cleanup

-   [ ] Uninstall `@clerk/nextjs`.
-   [ ] Remove `middleware.ts` (Clerk specific logic).
-   [ ] Remove `<ClerkProvider>` from `app/layout.tsx`.
-   [ ] Delete any `app/sign-in` or `app/sign-up` pages if they were Clerk-hosted redirects.

### 2. Installation & Setup

-   [ ] Install `@stackframe/stack`.
-   [ ] Create `stack.ts` (Configuration file for Stack).
-   [ ] Add environment variables (`NEXT_PUBLIC_STACK_PROJECT_ID`, etc.).
-   [ ] Wrap root layout with `<StackProvider>` and `<StackTheme>`.

### 3. Component Replacement (The "Find & Replace" Job)

You will need to go through your components and swap these:

| Clerk Component/Hook | Stack Auth Equivalent         | Notes                                                                                |
| :------------------- | :---------------------------- | :----------------------------------------------------------------------------------- |
| `<SignIn />`         | `<SignIn />`                  | Drop-in replacement.                                                                 |
| `<UserButton />`     | `<UserButton />`              | Drop-in replacement.                                                                 |
| `useUser()`          | `useUser()`                   | Stack's `useUser` returns `null` if not logged in (Clerk's `isLoaded` is different). |
| `auth()` (Server)    | `stackServerApp.getUser()`    | Stack returns the full user object on the server, not just ID.                       |
| `currentUser()`      | `stackServerApp.getUser()`    | Same as above.                                                                       |
| `redirectToSignIn()` | `useUser({ or: 'redirect' })` | Stack handles redirects via the hook options or middleware.                          |

### 4. Middleware

-   [ ] Create a new `middleware.ts` that uses `stackServerApp` to protect routes.

## Phase 2: Database Migration (Drizzle -> Prisma)

You have already started this by creating `prisma/schema.prisma`.

### 1. Schema Parity

-   [ ] Ensure `prisma/schema.prisma` matches your Drizzle schema in `lib/db/schema.ts`.
-   [ ] Run `npx prisma generate` to create the client.

### 2. Database Connection

-   [ ] Create `lib/prisma.ts` to export the global Prisma client instance (replacing `lib/db/index.ts`).

### 3. Query Refactoring

This is the biggest task. You need to update every Server Action (`lib/actions/*`).

-   **Selects:**
    -   _Old:_ `db.select().from(users).where(eq(users.id, id))`
    -   _New:_ `prisma.user.findUnique({ where: { id } })`
-   **Inserts:**
    -   _Old:_ `db.insert(users).values({...})`
    -   _New:_ `prisma.user.create({ data: { ... } })`
-   **Relations:**
    -   Prisma handles relations (joins) differently (using `include`). You will need to refactor any complex joins.

## Phase 3: The "Glue" (User Sync)

-   **Challenge:** Your database has existing users with Clerk IDs. Stack Auth will generate _new_ User IDs.
-   **Solution:**
    1.  **Wipe & Reset (Recommended for Dev):** Since you are rewriting, it's easiest to drop the database and start fresh.
    2.  **Migration (Hard):** You would need to export users from Clerk and import them into Stack, mapping the IDs. **I strongly recommend option 1.**

## Execution Order

1.  **Switch DB first:** Get the app running on Prisma with the _existing_ Clerk auth (just to isolate variables).
2.  **Switch Auth second:** Once the DB is stable, swap Clerk for Stack.
    -   _Why?_ Changing both at once makes debugging impossible.
