# useUser Hook - Complete Operations Index

This file lists every single operation available through the `useUser` hook.

## Import
```typescript
import { useUser } from "@/lib/auth/useUser";
```

## Questions Operations

### Read-Only Operations (db.questions)

| Operation | Parameters | Returns | Purpose |
|-----------|-----------|---------|---------|
| `search()` | filters object | `{ questions: Question[], total: number }` | Search questions with filters |
| `getById(id)` | `id: string` | `Question` (with parts & options) | Get full question details |
| `getByTopic(topicId, limit?)` | `topicId: string, limit?: number` | `Question[]` | Get questions for a topic |

**Example:**
```typescript
const { questions, total } = await db.questions.search({
  subjectId: "...",
  difficulty: "hard",
  hasMath: true,
  searchText: "equilibrium",
  limit: 20,
  offset: 0,
});

const q = await db.questions.getById(questionId);
const topicQs = await db.questions.getByTopic(topicId, 50);
```

### Admin Operations (db.questionsAdmin)

| Operation | Parameters | Returns | Purpose |
|-----------|-----------|---------|---------|
| `create(data)` | `QuestionInsert` | `{ question, parts }` | Create new question |
| `update(id, data)` | `id: string, partial: Question` | `Question` | Update question |
| `delete(id)` | `id: string` | `void` | Delete question |

**Example:**
```typescript
const result = await db.questionsAdmin.create({
  subjectId: "...",
  primaryTopicId: "...",
  difficulty: "medium",
  questionType: "structured",
  parts: [...],
});

await db.questionsAdmin.update(id, { difficulty: "hard" });
await db.questionsAdmin.delete(id);
```

---

## Study Plans Operations

### Read-Only Operations (db.studyPlans)

| Operation | Parameters | Returns | Purpose |
|-----------|-----------|---------|---------|
| `getAll()` | none | `StudyPlan[]` | Get all user's plans |
| `getActive()` | none | `StudyPlan[]` | Get current/active plans |
| `getById(id)` | `id: string` | `StudyPlan` (with items) | Get plan with items |
| `getTodaysTasks()` | none | `StudyPlanItem[]` | Get today's tasks |
| `getStats(id)` | `id: string` | `{total, completed, pending, ...}` | Get plan statistics |

**Example:**
```typescript
const allPlans = await db.studyPlans.getAll();
const activePlans = await db.studyPlans.getActive();
const fullPlan = await db.studyPlans.getById(planId);
const today = await db.studyPlans.getTodaysTasks();
const stats = await db.studyPlans.getStats(planId);
```

### Admin Operations (db.studyPlansAdmin)

| Operation | Parameters | Returns | Purpose |
|-----------|-----------|---------|---------|
| `create(data)` | `StudyPlanInsert` | `StudyPlan` | Create new plan |
| `createWithItems(planData, items)` | data + items array | `{ plan, items }` | Create plan with tasks |
| `markItemDone(id)` | `id: string` | `StudyPlanItem` | Mark task complete |
| `markItemSkipped(id)` | `id: string` | `StudyPlanItem` | Mark task skipped |

**Example:**
```typescript
const plan = await db.studyPlansAdmin.create({
  name: "Chemistry Prep",
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
});

const { plan, items } = await db.studyPlansAdmin.createWithItems(
  { name: "...", startDate: new Date(), endDate: new Date() },
  [
    { 
      subjectId: "...", 
      taskType: "practice_questions", 
      dueDate: new Date(),
      targetQuestionsCount: 10 
    },
  ]
);

await db.studyPlansAdmin.markItemDone(itemId);
await db.studyPlansAdmin.markItemSkipped(itemId);
```

---

## Progress Operations

### Statistics Operations (db.progress)

| Operation | Parameters | Returns | Purpose |
|-----------|-----------|---------|---------|
| `getStats()` | none | `{totalAttempted, totalCorrect, successRate, ...}` | Get all statistics |
| `getStrugglingQuestions(limit?)` | `limit?: number` | `UserQuestionProgress[]` | Get incorrect attempts |
| `getMasteredQuestions(min?)` | `min?: number` | `UserQuestionProgress[]` | Get mastered questions |
| `getRecentAttempts(limit?)` | `limit?: number` | `UserQuestionProgress[]` | Get recent attempts |
| `getStreak()` | none | `number` | Get consecutive correct |
| `getForReview(limit?)` | `limit?: number` | `UserQuestionProgress[]` | Get questions to review |

**Example:**
```typescript
const stats = await db.progress.getStats();
// Returns: {
//   totalQuestionsAttempted: 45,
//   totalQuestionsCorrect: 38,
//   totalQuestionsFailed: 7,
//   totalAttemptsCount: 52,
//   averageAttemptsPerQuestion: 1.16,
//   successRate: 84.44,
//   questionsNotAttempted: 155,
// }

const struggled = await db.progress.getStrugglingQuestions(5);
const mastered = await db.progress.getMasteredQuestions(2);
const recent = await db.progress.getRecentAttempts(10);
const streak = await db.progress.getStreak();
const review = await db.progress.getForReview(20);
```

### Admin Operations (db.progressAdmin)

| Operation | Parameters | Returns | Purpose |
|-----------|-----------|---------|---------|
| `recordAttempt(qId, isCorrect)` | `qId: string, isCorrect: boolean` | `UserQuestionProgress` | Record attempt |
| `resetQuestion(qId)` | `qId: string` | `void` | Clear question history |

**Example:**
```typescript
// Record correct answer
await db.progressAdmin.recordAttempt(questionId, true);

// Record incorrect answer
await db.progressAdmin.recordAttempt(questionId, false);

// Reset progress
await db.progressAdmin.resetQuestion(questionId);
```

---

## Type Definitions

### Enums
```typescript
// Difficulty levels
type Difficulty = "easy" | "medium" | "hard" | "very_hard"

// Question types
type QuestionType = "mcq" | "structured" | "essay" | "graph" | "table" | "mixed" | "diagram" | "calculation"

// Study task types
type TaskType = "read" | "revise" | "practice_questions" | "mock_paper" | "review"

// Status
type Status = "pending" | "in_progress" | "done" | "skipped"

// Progress status
type ProgressStatus = "not_attempted" | "attempted" | "correct" | "incorrect"
```

### Search Filters
```typescript
interface SearchFilters {
  subjectId?: string;
  topicId?: string;
  difficulty?: Difficulty;
  questionType?: QuestionType;
  hasDiagram?: boolean;
  hasMath?: boolean;
  hasTable?: boolean;
  searchText?: string;
  limit?: number;
  offset?: number;
}
```

---

## Common Patterns

### Get All User Data
```typescript
const [stats, plans, tasks, struggled] = await Promise.all([
  db.progress.getStats(),
  db.studyPlans.getAll(),
  db.studyPlans.getTodaysTasks(),
  db.progress.getStrugglingQuestions(5),
]);
```

### Search and Display
```typescript
const { questions, total } = await db.questions.search({
  subjectId: chemistryId,
  difficulty: "hard",
  limit: 20,
});

for (const q of questions) {
  console.log(`Q${q.sourceQuestionNumber}: ${q.difficulty}`);
}
```

### Record and Check Progress
```typescript
// User answered
const userAnsweredCorrectly = true;
await db.progressAdmin.recordAttempt(questionId, userAnsweredCorrectly);

// Check if mastered
const stats = await db.progress.getStats();
console.log(`Success rate: ${stats.successRate}%`);
```

### Create Full Study Plan
```typescript
const { plan, items } = await db.studyPlansAdmin.createWithItems(
  {
    name: "3-Month Exam Prep",
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    totalTargetHours: 120,
    settings: {
      examDate: "2025-05-15",
      preferredStudyDays: ["Mon", "Tue", "Wed", "Thu"],
      dailyMaxHours: 4,
    },
  },
  [
    {
      subjectId: chemId,
      topicIds: [organicId, inorganicId],
      taskType: "practice_questions",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      targetQuestionsCount: 20,
    },
    {
      subjectId: chemId,
      topicIds: [physicalChemId],
      taskType: "mock_paper",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ]
);
```

---

## Error Handling

All operations throw errors if user is not authenticated:

```typescript
const { db, isAuthenticated } = useUser();

if (!isAuthenticated) {
  throw new Error("User not authenticated");
}

try {
  const stats = await db.progress.getStats();
} catch (error) {
  console.error("Failed to load stats:", error);
}
```

---

## Total Operations

- **Questions**: 3 read + 3 admin = **6 operations**
- **Study Plans**: 5 read + 4 admin = **9 operations**
- **Progress**: 6 stats + 2 admin = **8 operations**

**Total: 23 main operations** (plus all underlying 70+ database functions)

All are type-safe and bound to the authenticated user!
