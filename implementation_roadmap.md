# Study-IAL Implementation Roadmap

This document outlines the step-by-step plan to build **Study-IAL** based on the provided executive summary and technical architecture.

## Phase 1: Foundation & "Engine Swap" (Immediate Priority)

**Goal:** Stabilize the core infrastructure by completing the migration to Prisma and Stack Auth.

### 1.1. Database Schema Completion (Prisma)

The current `schema.prisma` is missing core entities.

-   [ ] **Define User Model**: Create `User` model to map to Stack Auth (if needed for local profile data) or just use external ID.
-   [ ] **Define Academic Models**: Ensure `Subject`, `Unit`, `Topic` are fully defined.
-   [ ] **Define Content Models**:
    -   [ ] `SourcePaper` (Year, Session, Variant)
    -   [ ] `Question` (Content, Marks, Difficulty, link to Topic/Paper)
    -   [ ] `QuestionPart` & `AnswerOption` (for MCQs/Structured)
    -   [ ] `QuestionAsset` (Images/Graphs)
-   [ ] **Define Study Models**:
    -   [ ] `StudyPlan` (User link, Dates, Status)
    -   [ ] `StudyPlanItem` (Task link, Status, Due Date)
    -   [ ] `UserQuestionProgress` (User link, Question link, Status, Score)
-   [ ] **Run Migration**: `npx prisma migrate dev --name init_full_schema`

### 1.2. Authentication Migration (Stack Auth)

-   [ ] **Cleanup Clerk**: Remove `ClerkProvider`, `authMiddleware`, and all `@clerk/nextjs` imports.
-   [ ] **Setup Stack Auth**:
    -   [ ] Configure `StackTheme` and `StackProvider` in `app/layout.tsx`.
    -   [ ] Create `app/handler/[...stack]/page.tsx` for auth routes.
-   [ ] **Protect Routes**: Implement `middleware.ts` using Stack Auth to protect `/study-plans`, `/pomodoro`, etc.
-   [ ] **Update User Fetching**: Replace `auth()`/`currentUser()` with `stackServerApp.getUser()` in Server Actions and API routes.

### 1.3. Database Access Layer

-   [ ] **Prisma Client**: Ensure `lib/prisma.ts` is a singleton.
-   [ ] **Refactor Actions**: Rewrite existing Drizzle queries in `lib/actions/` to use Prisma.
    -   [ ] `getStudyPlans`, `createStudyPlan`
    -   [ ] `getTopics`, `getSubjects`

---

## Phase 2: Core Study Features

**Goal:** Enable students to generate plans and track progress.

### 2.1. Intelligent Study Plans (AI)

-   [ ] **Prompt Engineering**: Create a robust prompt for Gemini in `lib/ai/prompts.ts`.
    -   Input: Subjects, Exam Date, Weaknesses.
    -   Output: JSON array of tasks mapped to Topics.
-   [ ] **Generation Action**:
    -   [ ] Fetch available `Topics` from DB to validate AI output.
    -   [ ] Call Gemini API.
    -   [ ] Parse JSON and create `StudyPlan` + `StudyPlanItem` records in a transaction.
-   [ ] **UI Implementation**:
    -   [ ] Create "New Plan" Wizard (Step-by-step form).
    -   [ ] Display Plan as a Calendar or Kanban board (using `dnd-kit` or similar).

### 2.2. Question Bank Foundation

-   [ ] **Admin Upload Portal**: Page for admins to upload PDF Past Papers.
-   [ ] **PDF Parsing Pipeline**:
    -   [ ] Use `pdf-parse` to extract text.
    -   [ ] **Challenge**: Identifying individual questions. _Start simple: Manual review or structured text splitting._
-   [ ] **Question Viewer**: Component to display questions (support Markdown/LaTeX for math).

---

## Phase 3: AI & RAG (The "Brain")

**Goal:** Make the platform intelligent with Question Parsing and Study Hub.

### 3.1. AI Question Parsing System

-   [ ] **Ingestion Script**: Create a script/API to process uploaded PDFs.
    -   [ ] Send PDF text/images to Gemini Pro Vision (or similar multimodal model).
    -   [ ] Prompt: "Extract each question, identify type (MCQ/Structured), topic, and marks."
-   [ ] **Verification UI**: Admin interface to review and approve AI-parsed questions before saving to DB.

### 3.2. Study Hub (RAG)

-   [ ] **Vector Database Setup**: Enable `pgvector` extension on Neon.
-   [ ] **Embeddings**:
    -   [ ] Add `embedding` field (`Unsupported("vector(1536)")`) to `Question` and `Resource` models.
    -   [ ] Create utility to generate embeddings using OpenAI `text-embedding-3-small`.
-   [ ] **Resource Upload**:
    -   [ ] User uploads PDF notes.
    -   [ ] Chunk text -> Generate Embeddings -> Store in DB.
-   [ ] **Chat Interface**:
    -   [ ] Chat UI (User asks question).
    -   [ ] Backend: Vector similarity search -> Retrieve chunks -> Send to Gemini/GPT -> Stream response.

---

## Phase 4: Productivity & Advanced Features

**Goal:** Enhance engagement and retention.

### 4.1. Pomodoro Timer

-   [ ] **Timer Component**:
    -   [ ] Circular progress (SVG/Canvas).
    -   [ ] States: Work, Short Break, Long Break.
-   [ ] **Zen Mode**: Full-screen page (`/pomodoro`) with minimal distractions.
-   [ ] **Task Integration**: Select a `StudyPlanItem` to "Focus" on. Auto-update status to `IN_PROGRESS`.

### 4.2. Community Marketplace

-   [ ] **Public Flag**: Add `isPublic` boolean to `StudyPlan`.
-   [ ] **Marketplace Page**:
    -   [ ] Grid of public plans.
    -   [ ] Filter by Subject/Duration.
-   [ ] **Cloning Logic**: Action to copy a public plan (and its items) to the current user's account.

### 4.3. Analytics Dashboard

-   [ ] **Stats Calculation**:
    -   [ ] Completion Rate (Tasks Done / Total).
    -   [ ] Topic Strength (based on `UserQuestionProgress`).
-   [ ] **Visuals**: Use `recharts` or `tremor` to show progress over time.

---

## Phase 5: Polish & Launch

**Goal:** Production readiness.

-   [ ] **SEO**: Add `sitemap.ts`, `robots.txt`, and dynamic `generateMetadata` for public plans.
-   [ ] **Performance**:
    -   [ ] Implement `React.Suspense` for data fetching.
    -   [ ] Optimize images (Next.js Image).
-   [ ] **Testing**:
    -   [ ] Unit tests for AI parsing logic.
    -   [ ] E2E tests for the Study Plan generation flow.
