# Tech Stack Recommendation for Study-IAL Rewrite

Based on your current codebase, `FEATURE_IDEAS.md`, and the goal of a "from scratch" rewrite, here is the recommended stack to build a scalable, high-performance, and feature-rich study platform.

## 1. Core Framework & Language

-   **Framework:** **Next.js 15 (App Router)**
    -   _Why:_ You are already using Next.js. The App Router is now mature and offers the best performance (Server Components) and developer experience.
-   **Language:** **TypeScript**
    -   _Why:_ Non-negotiable for type safety and maintainability in a complex app.

## 2. Database & ORM

-   **Database:** **PostgreSQL (via Neon)**
    -   _Why:_ Neon offers serverless Postgres with branching (great for dev/preview environments) and autoscaling. It separates compute from storage, making it very cost-effective.
-   **ORM:** **Prisma**
    -   _Why:_ You mentioned switching to it. It has the best developer experience (DX), excellent type safety, and great tooling (Studio, Migrate).
    -   _Alternative:_ **Drizzle ORM** is lighter and faster (SQL-like), but Prisma's DX is often preferred for rapid feature development.

## 3. Authentication

-   **Choice:** **Stack Auth** (`@stackframe/stack`)
    -   _Why:_ **You should use this.** It is the modern, open-source successor to things like NextAuth.
    -   _Key Benefits:_
        -   **Zero Vendor Lock-in:** It's open source. You own your data.
        -   **Avatars:** It automatically syncs the user's Google profile picture (so you don't need to host these).
        -   **DX:** It is built specifically for the Next.js App Router.
        -   **Cost:** Generous free tier and cheaper scaling than Clerk.

## 4. File Storage

-   **User Content:** **UploadThing**
    -   _Usage:_ Essay screenshots, flashcard images.
    -   _Note:_ Since Stack Auth handles avatars, you save even more storage here. The 2GB free tier will last you a very long time.
-   **Past Papers:** **Cloudflare R2**
    -   _Usage:_ Storing the massive library of PDF past papers.
    -   _Benefit:_ Zero egress fees means you don't pay when users download papers.

## 5. AI & RAG (Retrieval-Augmented Generation)

To build the "AI Tutor" and "Smart Rescheduling":

-   **SDK:** **Vercel AI SDK** (`ai` package)
    -   _Why:_ The standard for building AI apps in Next.js. It unifies the API for OpenAI, Google, Anthropic, etc., making it easy to switch models.
-   **LLM Models:**
    -   **Google Gemini 1.5 Flash:** For high-volume, low-latency tasks (e.g., quick explanations, grading). It has a massive context window (1M tokens) which is great for analyzing entire past papers.
    -   **GPT-4o / Claude 3.5 Sonnet:** For complex reasoning (e.g., "AI Tutor" deep dives).
-   **Vector Database (for RAG):** **Pinecone**
    -   _Why:_ Fully managed, serverless, and has a generous free tier. It integrates extremely well with Vercel AI SDK.
    -   _Alternative:_ **Neon with `pgvector`**. Since you are using Postgres, you can store vectors directly in your DB. This keeps data in one place but can be harder to scale/tune than a dedicated vector DB like Pinecone. **Recommendation: Pinecone** for ease of use.
-   **Embedding Model:** **OpenAI `text-embedding-3-small`** or **Gecko (Google)**. fast and cheap.

## 6. Styling & UI

-   **Styling:** **Tailwind CSS v4**
    -   _Why:_ You are already using v4. It's the future of CSS.
-   **Component Library:** **Shadcn UI**
    -   _Why:_ Not a component library, but a collection of re-usable components that you copy-paste into your apps. It gives you full control over the code and looks beautiful out of the box.
-   **Animation:** **Framer Motion**
    -   _Why:_ Essential for the "premium" feel (micro-interactions, page transitions).

## 7. Additional Services (From Feature Ideas)

-   **Cron Jobs (Smart Rescheduling):** **Vercel Cron** or **Inngest**.
    -   _Why:_ Inngest is fantastic for durable workflows (e.g., "Wait 3 days then send email", or "Reschedule plan every Sunday"). It handles failures and retries much better than simple cron jobs.
-   **Analytics:** **PostHog**.
    -   _Why:_ Open-source, free tier, handles event tracking (for your "Analytics Dashboard") and feature flags.

## Summary of the "Golden Stack"

| Category        | Technology              |
| :-------------- | :---------------------- |
| **Framework**   | Next.js 15 (App Router) |
| **Language**    | TypeScript              |
| **Database**    | Postgres (Neon)         |
| **ORM**         | Prisma                  |
| **Auth**        | Stack Auth (or Clerk)   |
| **Images**      | UploadThing             |
| **Large Files** | Cloudflare R2           |
| **Vector DB**   | Pinecone                |
| **AI SDK**      | Vercel AI SDK           |
| **Styling**     | Tailwind v4 + Shadcn UI |
| **Workflows**   | Inngest                 |

This stack is optimized for **speed of development**, **scalability**, and **cost-efficiency**.
