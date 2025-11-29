# Study-IAL Project Overview

## 1. Executive Summary

**Study-IAL** is an intelligent, AI-powered study planning and management platform designed to help students (specifically International A-Level students) organize their preparation, practice effectively, and track their progress.

Unlike simple to-do lists, Study-IAL understands the academic curriculum (Subjects, Units, Topics) and uses Generative AI to create personalized, adaptive study schedules. It features a rich question bank derived from past papers, a focus timer, and RAG (Retrieval-Augmented Generation) capabilities for interacting with study materials.

## 2. Technical Architecture

The project is built as a modern, full-stack web application using the **Next.js** ecosystem.

### Core Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **UI Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/) for animations.
-   **Database**: PostgreSQL (hosted on [Neon](https://neon.tech/)).
-   **ORM**:
    -   _Legacy/Current_: [Drizzle ORM](https://orm.drizzle.team/)
    -   _Target_: [Prisma](https://www.prisma.io/) (Migration in progress)
-   **Authentication**:
    -   _Legacy/Current_: [Clerk](https://clerk.com/)
    -   _Target_: [Stack Auth](https://stack-auth.com/) (Migration in progress)

### AI & Data Pipeline

-   **Generative AI**: Google Gemini (`@google/generative-ai`) for study plan generation and content ingestion.
-   **Embeddings**: OpenAI (`text-embedding-3-small`) for vector search.
-   **Vector Search**: `pgvector` (via Drizzle/Prisma) for RAG and question similarity.
-   **PDF Processing**: `pdf-parse` for ingesting study notes and past papers.

## 3. Core Features

### 📚 Intelligent Study Plans

-   **AI Generation**: Users input their subjects, exam dates, and preferences. The AI generates a structured schedule broken down by topics and tasks.
-   **Task Types**: Supports various activities like "Read", "Revise", "Practice Questions", and "Mock Paper".
-   **Tracking**: Detailed status tracking (Pending, In Progress, Done) with analytics on completion rates.

### 🧠 Question Bank & Practice

-   **Structured Content**: Questions are ingested from source papers and structured into metadata (Subject, Unit, Topic, Difficulty).
-   **Rich Media**: Support for questions with diagrams, graphs, and mathematical formulas.
-   **Adaptive Practice**: The system tracks user performance (`UserQuestionProgress`) to estimate difficulty and suggest appropriate questions.

### 🍅 Productivity Tools

-   **Pomodoro Timer**: Integrated "Zen Mode" for focused study sessions.
-   **Study Hub (RAG)**: Users can upload PDF resources. The system chunks and embeds these to allow AI-powered Q&A against their specific notes.

### 🌍 Community & Marketplace

-   **Public Plans**: Users can share their study plans with the community.
-   **Cloning**: Students can clone and adapt community plans for their own schedule.

## 4. Data Model (Key Entities)

The database schema is designed to support a hierarchical academic structure and granular progress tracking.

-   **Academic Hierarchy**:
    -   `Subject` (e.g., Physics) -> `Unit` (e.g., Unit 1: Mechanics) -> `Topic` (e.g., Kinematics).
-   **Content**:
    -   `SourcePaper`: Metadata for past papers (Year, Session, Variant).
    -   `Question`: The core practice item, linked to a Topic and Source Paper. Includes `embedding` for similarity search.
    -   `QuestionPart` & `AnswerOption`: Supports complex, multi-part questions and MCQs.
    -   `QuestionAsset`: Images/Graphs associated with questions.
-   **User Data**:
    -   `StudyPlan`: The container for a user's schedule.
    -   `StudyPlanItem`: Individual tasks within a plan.
    -   `UserQuestionProgress`: Tracks attempts, correctness, and difficulty estimates for each user/question pair.

## 5. Current Development Status

The project is currently undergoing a significant **"Engine Swap"** refactor to improve developer experience and scalability.

### 🚧 Active Migrations

1.  **Database ORM**: Transitioning from **Drizzle** to **Prisma**.
    -   _Status_: Schema defined (`prisma/schema.prisma`), migration plan in place.
2.  **Authentication**: Transitioning from **Clerk** to **Stack Auth**.
    -   _Status_: Dependencies installed, `stack/` configuration present, component replacement in progress.

### 🎯 Immediate Goals

-   Complete the Auth and DB migration.
-   Stabilize the `StudyPlan` generation workflow with the new stack.
-   Enhance the RAG implementation for the Study Hub.

## 6. Project Structure

```
├── app/                 # Next.js App Router pages and API routes
│   ├── api/             # Backend API endpoints (Server Actions preferred)
│   ├── study-plans/     # Study plan management routes
│   ├── study-hub/       # RAG/Resource routes
│   └── pomodoro/        # Focus timer route
├── components/          # Reusable UI components (Shadcn + Custom)
├── lib/                 # Shared utilities
│   ├── actions/         # Server Actions (Business Logic)
│   ├── db/              # Database configuration (Drizzle/Prisma)
│   └── ai/              # AI logic (Gemini/OpenAI wrappers)
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
└── stack/               # Stack Auth configuration
```
