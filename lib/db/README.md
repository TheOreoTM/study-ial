# Database Setup and Usage

This directory contains all the database-related code for StudyIAL, built with Drizzle ORM and PostgreSQL.

## Structure

- **schema.ts** - All table definitions and type exports
- **client.ts** - Database connection and client initialization
- **questions.ts** - Question management functions
- **studyPlans.ts** - Study plan and study item functions
- **progress.ts** - User progress tracking functions
- **ingestion.ts** - Bulk import and PDF extraction processing
- **seed.ts** - Initial database seed script

## Setup

### 1. Install Dependencies

```bash
pnpm add drizzle-orm postgres drizzle-kit zod dotenv
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/study_ial
```

### 3. Database Migrations

Set up your Drizzle config in `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Generate and run migrations:

```bash
pnpm dlx drizzle-kit generate
pnpm dlx drizzle-kit migrate
```

### 4. Seed the Database

Run the seed script to populate subjects, units, and topics:

```bash
pnpm tsx lib/db/seed.ts
```

## Database Schema Overview

### Core Tables

#### Subjects
- **subjects** - The 4 main IAL subjects (Chemistry, Biology, Physics, Mathematics)

#### Units and Topics
- **units** - Subdivisions within subjects (6 units per subject for most)
- **topics** - Specific topics within units (hierarchical structure supported)

### Questions

#### Main Question Tables
- **questions** - Core question data with metadata
- **questionParts** - Multi-part questions (a, b, i, ii, etc.)
- **answerOptions** - Multiple choice options
- **questionAssets** - Diagrams, graphs, tables, and other media

#### Supporting Tables
- **sourcePapers** - Past papers metadata
- **ingestionJobs** - Tracks bulk import progress from Gemini

### User Data

#### Progress Tracking
- **userQuestionProgress** - Tracks user attempts, correctness, and difficulty estimates

#### Study Plans
- **studyPlans** - User-created study schedules
- **studyPlanItems** - Individual tasks within study plans

## API Reference

### Questions

```typescript
import {
  createQuestion,
  getQuestionWithDetails,
  searchQuestions,
  getQuestionsByTopic,
  updateQuestion,
  bulkUpdateQuestions,
  deleteQuestion,
  addQuestionAsset,
  getQuestionsBySourcePaper,
  getQuestionStatistics,
  getComplexQuestions,
  createQuestionPart,
  exportQuestionsData,
} from "@/lib/db/questions";

// Create a question with parts and assets
const result = await createQuestion({
  subjectId: "subject-uuid",
  primaryTopicId: "topic-uuid",
  difficulty: "medium",
  questionType: "structured",
  hasMath: true,
  parts: [
    {
      label: "a",
      promptPlain: "Calculate...",
      promptRich: { /* rich format */ },
      marks: 5,
      options: [/* MCQ options */],
    },
  ],
  assets: [
    {
      type: "diagram",
      storageUrl: "https://...",
      altText: "Diagram description",
    },
  ],
});

// Search questions
const results = await searchQuestions({
  subjectId: "subject-uuid",
  difficulty: "hard",
  hasMath: true,
  searchText: "integral",
  limit: 20,
});

// Get question with all details
const full = await getQuestionWithDetails("question-uuid");
```

### Study Plans

```typescript
import {
  createStudyPlan,
  createStudyPlanWithItems,
  getStudyPlanWithItems,
  getUserStudyPlans,
  getActiveStudyPlans,
  updateStudyPlan,
  deleteStudyPlan,
  getStudyPlanItemsByDateRange,
  getPendingStudyPlanItems,
  getOverdueStudyPlanItems,
  updateStudyPlanItemStatus,
  getTodaysStudyTasks,
  getStudyPlanStatistics,
  rescheduleStudyPlanItems,
} from "@/lib/db/studyPlans";

// Create a study plan with items
const { plan, items } = await createStudyPlanWithItems(
  {
    userId: "clerk-user-id",
    name: "May 2025 Exam Prep",
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    totalTargetHours: 120,
    settings: {
      examDate: "2025-05-15",
      preferredStudyDays: ["Monday", "Tuesday", "Wednesday"],
      dailyMaxHours: 4,
    },
  },
  [
    {
      subjectId: "chem-id",
      topicIds: ["topic-1", "topic-2"],
      taskType: "practice_questions",
      dueDate: new Date(),
      targetQuestionsCount: 10,
    },
  ]
);

// Get today's study tasks
const todaysTasks = await getTodaysStudyTasks("user-id");

// Mark item as completed
await updateStudyPlanItemStatus("item-id", "done");
```

### User Progress

```typescript
import {
  getUserQuestionProgress,
  recordQuestionAttempt,
  getUserProgressForQuestions,
  markQuestionAttempted,
  getUserRecentProgress,
  getUserProgressStatistics,
  getUserStrugglingQuestions,
  getUserMasteredQuestions,
  updateDifficultyEstimate,
  resetQuestionProgress,
  getQuestionsForReview,
  getUserStreak,
} from "@/lib/db/progress";

// Record a question attempt
const progress = await recordQuestionAttempt(
  "user-id",
  "question-id",
  true // is correct
);

// Get user statistics
const stats = await getUserProgressStatistics("user-id");
// Returns: {
//   totalQuestionsAttempted,
//   totalQuestionsCorrect,
//   totalQuestionsFailed,
//   totalAttemptsCount,
//   averageAttemptsPerQuestion,
//   successRate,
//   questionsNotAttempted,
// }

// Get questions to review
const review = await getQuestionsForReview("user-id", 20);
```

### Ingestion (Bulk Import)

```typescript
import {
  createSourcePaper,
  createIngestionJob,
  ingestionQuestions,
  getIngestionStatistics,
  validateExtractedQuestions,
} from "@/lib/db/ingestion";

// Create source paper
const paper = await createSourcePaper({
  subjectId: "chem-id",
  year: 2023,
  session: "may",
  variant: 1,
  paper: 1,
  storageUrl: "https://s3.../papers/2023-may-p1.pdf",
});

// Create ingestion job
const job = await createIngestionJob({
  sourcePaperId: paper.id,
  status: "pending",
});

// After Gemini extracts questions, validate and ingest
const extracted = [
  {
    questionNumber: "1",
    prompt: { text: "Question text", latex: [] },
    parts: [
      {
        label: "a",
        prompt: { text: "Part a text" },
        marks: 5,
      },
    ],
    assets: [],
  },
];

const validation = validateExtractedQuestions(extracted);
if (validation.validQuestions.length > 0) {
  const result = await ingestionQuestions(job.id, validation.validQuestions, {
    sourcePaperId: paper.id,
    subjectId: "chem-id",
    primaryTopicId: "topic-id",
  });
}

// Get ingestion statistics
const stats = await getIngestionStatistics();
```

## Rich Content Format

Questions support a rich content format for storing complex content with LaTeX, images, and structured data.

### Prompt Rich Format

```typescript
{
  blocks: [
    { type: "text", content: "Calculate the integral of " },
    { type: "math", latex: "\\int_0^1 x^2 dx" },
    { type: "image_ref", asset_id: "asset-uuid" },
    {
      type: "table",
      headers: ["Column 1", "Column 2"],
      rows: [["A", "B"], ["C", "D"]]
    }
  ]
}
```

## Transactions and Error Handling

For bulk operations, consider using transactions:

```typescript
import { dbClient } from "./client";

await dbClient.transaction(async (tx) => {
  // All operations here are atomic
  const result = await createQuestion({...});
  // If any operation fails, all are rolled back
});
```

## Performance Tips

1. **Use indexes** - The schema includes strategic indexes on common query fields
2. **Batch operations** - For bulk imports, use transactions
3. **Pagination** - Always use limit/offset for large result sets
4. **Full-text search** - Consider using PostgreSQL's built-in full-text search for question content
5. **Vector embeddings** - For "similar questions" feature, use pgvector

## Example: Complete Ingestion Workflow

```typescript
async function processAndIngestPaper(pdfUrl: string, subjectId: string) {
  // 1. Create source paper
  const paper = await createSourcePaper({
    subjectId,
    year: 2024,
    session: "may",
    variant: 1,
    storageUrl: pdfUrl,
  });

  // 2. Create ingestion job
  const job = await createIngestionJob({
    sourcePaperId: paper.id,
    status: "processing",
  });

  try {
    // 3. Send PDF to Gemini 2.5 Pro for extraction
    // (This would be in a separate service/API route)
    const extractedQuestions = await callGeminiExtraction(pdfUrl);

    // 4. Validate extracted data
    const { validQuestions, invalidQuestions } =
      validateExtractedQuestions(extractedQuestions);

    if (invalidQuestions.length > 0) {
      console.warn(
        `${invalidQuestions.length} questions failed validation`
      );
    }

    // 5. Get primary topic (or map based on paper type)
    const topics = await dbClient
      .select()
      .from(topics)
      .where(/* filter by subject */);
    const primaryTopic = topics[0];

    // 6. Ingest valid questions
    const result = await ingestionQuestions(
      job.id,
      validQuestions,
      {
        sourcePaperId: paper.id,
        subjectId,
        primaryTopicId: primaryTopic.id,
        difficulty: "medium",
      }
    );

    console.log(`✅ Processed ${result.processed} questions`);
    if (result.errors.length > 0) {
      console.warn(`⚠️ ${result.errors.length} errors during ingestion`);
    }
  } catch (error) {
    await updateIngestionJobProgress(job.id, {
      status: "failed",
      errorLog: [error.message],
    });
    throw error;
  }
}
```

## Useful Queries

```typescript
// Get all questions for a specific topic with pagination
async function getTopicQuestions(topicId: string, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const { questions, total } = await searchQuestions({
    topicId,
    limit: pageSize,
    offset,
  });
  return { questions, total, pages: Math.ceil(total / pageSize) };
}

// Get user's weakest areas
async function getUserWeakAreas(userId: string) {
  const progress = await getUserProgressStatistics(userId);
  const struggled = await getUserStrugglingQuestions(userId);
  return { stats: progress, struggledQuestions: struggled };
}

// Get daily study recommendations
async function getDailyRecommendations(userId: string) {
  const todaysTasks = await getTodaysStudyTasks(userId);
  const struggled = await getQuestionsForReview(userId, 5);
  return {
    scheduledTasks: todaysTasks,
    recommendedReview: struggled,
  };
}
```

## Troubleshooting

**Error: "DATABASE_URL is not set"**
- Ensure `.env.local` exists with `DATABASE_URL` set
- Make sure you're running in a Node.js environment

**Error: "Cannot find module 'postgres'"**
- Run `pnpm install` to install dependencies

**Slow queries**
- Check that indexes are created: `pnpm dlx drizzle-kit introspect`
- Use `EXPLAIN` to analyze query plans
- Consider adding more indexes for frequently filtered fields

**Connection pool exhausted**
- Limit concurrent connections
- Use transactions for bulk operations
- Close database connections properly
