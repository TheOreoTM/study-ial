# Quick Start: Database Integration

## 1-Minute Setup

### Prerequisites
- PostgreSQL 14+ installed and running
- pnpm/npm installed

### Setup Steps

```bash
# 1. Create database
createdb study_ial

# 2. Create .env.local
echo "DATABASE_URL=postgresql://localhost/study_ial" > .env.local

# 3. Install dependencies (already done)
pnpm install

# 4. Run migrations
pnpm dlx drizzle-kit migrate

# 5. Seed subjects and topics
pnpm tsx lib/db/seed.ts
```

## Using the Database

### Import Functions
```typescript
import {
  createQuestion,
  searchQuestions,
  createStudyPlan,
  recordQuestionAttempt,
  ingestionQuestions,
} from "@/lib/db";
```

### Create a Question
```typescript
const question = await createQuestion({
  subjectId: "subject-id",
  primaryTopicId: "topic-id",
  difficulty: "medium",
  questionType: "structured",
  parts: [
    {
      label: "a",
      promptPlain: "Question text",
      marks: 5,
    },
  ],
});
```

### Search Questions
```typescript
const { questions, total } = await searchQuestions({
  subjectId: "subject-id",
  difficulty: "hard",
  limit: 20,
});
```

### Create Study Plan
```typescript
const plan = await createStudyPlan({
  userId: "clerk-user-id",
  name: "May Exam Prep",
  startDate: new Date(),
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
});
```

### Track Progress
```typescript
await recordQuestionAttempt("user-id", "question-id", true);
const stats = await getUserProgressStatistics("user-id");
```

## Available Functions (70+)

### Questions (20 functions)
`createQuestion`, `getQuestionWithDetails`, `searchQuestions`, `updateQuestion`, `deleteQuestion`, and more...

### Study Plans (20 functions)
`createStudyPlan`, `getStudyPlanWithItems`, `updateStudyPlanItemStatus`, `getTodaysStudyTasks`, and more...

### Progress (15 functions)
`recordQuestionAttempt`, `getUserProgressStatistics`, `getUserStrugglingQuestions`, `getUserMasteredQuestions`, and more...

### Ingestion (15+ functions)
`createSourcePaper`, `ingestionQuestions`, `validateExtractedQuestions`, and more...

See `lib/db/README.md` for complete API reference.

## File Structure

```
lib/db/
├── schema.ts          # 13 PostgreSQL tables
├── client.ts          # Database connection
├── index.ts          # All exports in one place
├── questions.ts      # Question operations
├── studyPlans.ts     # Study plan operations
├── progress.ts       # Progress tracking
├── ingestion.ts      # PDF extraction
├── seed.ts           # Initial data
└── README.md         # Full documentation
```

## Example API Route

```typescript
// app/api/questions/route.ts
import { searchQuestions } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subject");
  
  const { questions, total } = await searchQuestions({
    subjectId: subjectId!,
    limit: 20,
  });
  
  return Response.json({ questions, total });
}
```

## Rich Content Examples

### Math Question
```typescript
{
  promptRich: {
    blocks: [
      { type: "text", content: "Integrate: " },
      { type: "math", latex: "\\int_0^2 x^3 dx" }
    ]
  }
}
```

### Question with Diagram
```typescript
{
  hasDiagram: true,
  assets: [
    {
      type: "diagram",
      storageUrl: "https://s3.../diagram.png",
      altText: "Chemical structure"
    }
  ]
}
```

### Structured Multi-Part
```typescript
{
  parts: [
    { label: "a", promptPlain: "Part a", marks: 5 },
    { label: "b", promptPlain: "Part b", marks: 8 },
    { label: "c", promptPlain: "Part c", marks: 7 }
  ]
}
```

## Common Operations

### Bulk Import from PDF
```typescript
// 1. Create source paper
const paper = await createSourcePaper({
  subjectId, year: 2024, session: "may",
  storageUrl: "s3://papers/2024-may.pdf"
});

// 2. Extract via Gemini (external service)
const extracted = await geminiExtract(paper.storageUrl);

// 3. Validate and ingest
const { validQuestions } = validateExtractedQuestions(extracted);
await ingestionQuestions(jobId, validQuestions, { 
  sourcePaperId: paper.id, subjectId, primaryTopicId 
});
```

### Get User Dashboard Data
```typescript
const [stats, todaysTasks, strugglingQs] = await Promise.all([
  getUserProgressStatistics(userId),
  getTodaysStudyTasks(userId),
  getUserStrugglingQuestions(userId, 5)
]);
```

## Troubleshooting

**"Cannot find module 'postgres'"**
```bash
pnpm install
```

**"DATABASE_URL is not set"**
- Create `.env.local` with `DATABASE_URL=postgresql://localhost/study_ial`

**"Table does not exist"**
```bash
pnpm dlx drizzle-kit migrate
```

**Need to reset database?**
```bash
dropdb study_ial
createdb study_ial
pnpm dlx drizzle-kit migrate
pnpm tsx lib/db/seed.ts
```

## Next Steps

1. ✅ Database is ready
2. 🔄 Create API routes in `app/api/`
3. 🎨 Build React components to use the API
4. 📊 Add dashboard page
5. 🔍 Implement search UI
6. 📚 Build question viewer component

See `lib/db/README.md` for comprehensive documentation!
