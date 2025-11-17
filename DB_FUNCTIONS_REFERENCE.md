# Database Functions Reference

Complete list of all 70+ functions organized by module.

## Questions Module (lib/db/questions.ts)

### Create & Insert
- `createQuestion()` - Create question with parts and assets
- `createQuestionPart()` - Add a part to existing question
- `addQuestionAsset()` - Add diagram/graph/table to question

### Read & Retrieve
- `getQuestionWithDetails()` - Get full question with parts, options, assets
- `getQuestionsByTopic()` - Get questions for a specific topic
- `getQuestionsBySourcePaper()` - Get all questions from a past paper
- `getComplexQuestions()` - Get multi-part questions

### Search & Filter
- `searchQuestions()` - Advanced search with filters
  - By subject, topic, difficulty
  - By content type (math, diagram, table)
  - Full-text search on content
  - Pagination support

### Update & Modify
- `updateQuestion()` - Update question properties
- `bulkUpdateQuestions()` - Update multiple questions at once

### Delete
- `deleteQuestion()` - Delete question and all related data

### Metadata & Statistics
- `getQuestionStatistics()` - Get counts by difficulty, type, content
- `exportQuestionsData()` - Export questions with all data

## Study Plans Module (lib/db/studyPlans.ts)

### Create & Insert
- `createStudyPlan()` - Create new study plan
- `createStudyPlanWithItems()` - Create plan with initial items
- `createStudyPlanItem()` - Add item to existing plan

### Read & Retrieve
- `getStudyPlanWithItems()` - Get plan with all associated items
- `getUserStudyPlans()` - Get all plans for a user
- `getActiveStudyPlans()` - Get current/active plans for user
- `getStudyPlanItemsByDateRange()` - Get items for a date range
- `getPendingStudyPlanItems()` - Get not-yet-started items
- `getOverdueStudyPlanItems()` - Get overdue items
- `getTodaysStudyTasks()` - Get tasks due today

### Update & Modify
- `updateStudyPlan()` - Update plan properties (name, dates, settings)
- `updateStudyPlanItem()` - Update item properties
- `updateStudyPlanItemStatus()` - Mark item as pending/in_progress/done/skipped
- `rescheduleStudyPlanItems()` - Shift all items by N days

### Delete
- `deleteStudyPlan()` - Delete plan and all items
- `deleteStudyPlanItem()` - Delete single item

### Statistics & Analysis
- `getStudyPlanStatistics()` - Get completion %, item counts by status

## Progress Tracking Module (lib/db/progress.ts)

### Create & Initialize
- `createUserQuestionProgress()` - Initialize progress record
- `getUserQuestionProgress()` - Get or create progress for question

### Record Attempts
- `recordQuestionAttempt()` - Record attempt (correct/incorrect)
- `markQuestionAttempted()` - Mark as first attempt
- `resetQuestionProgress()` - Reset all attempts for a question
- `resetAllUserProgress()` - Reset all user progress

### Retrieve Progress
- `getUserProgressForQuestions()` - Get progress for multiple questions
- `getUserProgressForSubject()` - Get all progress in a subject
- `getUserRecentProgress()` - Get recently attempted questions
- `getQuestionsForReview()` - Get struggled questions for review

### Statistics & Analysis
- `getUserProgressStatistics()` - Complete user stats
  - Total questions attempted
  - Success rate
  - Average attempts per question
  - Streak count
- `getUserStrugglingQuestions()` - Get incorrect attempts
- `getUserMasteredQuestions()` - Get questions with multiple correct attempts
- `getUserStreak()` - Get current consecutive correct streak

### Updates
- `updateDifficultyEstimate()` - Update personalized difficulty rating

## Ingestion Module (lib/db/ingestion.ts)

### Source Papers
- `createSourcePaper()` - Register a past paper
- `getSourcePapersBySubject()` - List papers for subject
- `getSourcePapersByYearSession()` - Find papers by year/session
- `deleteSourcePaper()` - Remove paper (cascades questions)

### Ingestion Jobs
- `createIngestionJob()` - Start tracking an import job
- `getIngestionJob()` - Get job details
- `updateIngestionJobProgress()` - Update job status/progress
- `getIngestionJobsForPaper()` - Get all jobs for a paper
- `getPendingIngestionJobs()` - Get jobs waiting to process
- `getRecentIngestionJobs()` - Get recent jobs

### Main Processing
- `ingestionQuestions()` - Process extracted questions from Gemini
  - Validates structure
  - Handles LaTeX and images
  - Tracks errors
  - Updates job progress
  - Supports partial failures

### Validation
- `validateExtractedQuestion()` - Validate single question
- `validateExtractedQuestions()` - Validate batch, returns valid/invalid

### Statistics
- `getIngestionStatistics()` - Get overall ingestion metrics
  - Total jobs, completed, failed
  - Total questions processed
  - Average per job

## Type Definitions (lib/db/schema.ts)

All tables have TypeScript types auto-generated:
- `Subject` / `SubjectInsert`
- `Unit` / `UnitInsert`
- `Topic` / `TopicInsert`
- `Question` / `QuestionInsert`
- `QuestionPart` / `QuestionPartInsert`
- `AnswerOption` / `AnswerOptionInsert`
- `QuestionAsset` / `QuestionAssetInsert`
- `StudyPlan` / `StudyPlanInsert`
- `StudyPlanItem` / `StudyPlanItemInsert`
- `UserQuestionProgress` / `UserQuestionProgressInsert`
- `SourcePaper` / `SourcePaperInsert`
- `IngestionJob` / `IngestionJobInsert`

## Import Examples

### Import Everything
```typescript
import * as db from "@/lib/db";
```

### Import Specific Functions
```typescript
import {
  createQuestion,
  searchQuestions,
  createStudyPlan,
  recordQuestionAttempt,
  getUserProgressStatistics,
  ingestionQuestions,
} from "@/lib/db";
```

### Import Types
```typescript
import {
  Question,
  QuestionInsert,
  StudyPlan,
  UserQuestionProgress,
} from "@/lib/db";
```

## Enums

Available enum values:

### Difficulty
- `"easy"` | `"medium"` | `"hard"` | `"very_hard"`

### Question Type
- `"mcq"` | `"structured"` | `"essay"` | `"graph"` | `"table"` | `"mixed"` | `"diagram"` | `"calculation"`

### Task Type
- `"read"` | `"revise"` | `"practice_questions"` | `"mock_paper"` | `"review"`

### Status
- `"pending"` | `"in_progress"` | `"done"` | `"skipped"`

### Progress Status
- `"not_attempted"` | `"attempted"` | `"correct"` | `"incorrect"`

### Asset Type
- `"diagram"` | `"graph"` | `"table_image"` | `"formula_image"` | `"photo"`

## Common Patterns

### Create and Retrieve
```typescript
const q = await createQuestion({...});
const full = await getQuestionWithDetails(q.id);
```

### Search and Iterate
```typescript
const { questions, total } = await searchQuestions({
  subjectId: "...",
  limit: 20
});

for (const q of questions) {
  // Process each question
}
```

### Bulk Operations
```typescript
const questions = await searchQuestions({...});
const ids = questions.map(q => q.id);

await bulkUpdateQuestions(ids, {
  difficulty: "hard"
});
```

### User Statistics
```typescript
const [stats, struggled, recent] = await Promise.all([
  getUserProgressStatistics(userId),
  getUserStrugglingQuestions(userId, 10),
  getUserRecentProgress(userId, 5)
]);
```

### Study Plan Workflow
```typescript
const plan = await createStudyPlanWithItems(
  { userId, name: "Exam Prep", ... },
  [
    { subjectId, taskType: "practice_questions", dueDate, ... },
    { subjectId, taskType: "mock_paper", dueDate, ... }
  ]
);

// Get today's tasks
const today = await getTodaysStudyTasks(userId);

// Mark complete
await updateStudyPlanItemStatus(itemId, "done");
```

### PDF Ingestion Workflow
```typescript
const paper = await createSourcePaper({...});
const job = await createIngestionJob({sourcePaperId});

const { validQuestions } = validateExtractedQuestions(extracted);
const result = await ingestionQuestions(job.id, validQuestions, {...});
```

---

**Total: 70+ functions across 5 modules**

See `lib/db/README.md` for detailed documentation and examples.
