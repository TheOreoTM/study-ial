# useUser Hook - Database Integration with Clerk

This hook provides seamless integration between Clerk authentication and your database operations, eliminating the need to manually pass `userId` around.

## Installation

The hook is already set up. Just import it in your components:

```typescript
import { useUser } from "@/lib/auth/useUser";
```

## Basic Usage

```typescript
"use client";

import { useUser } from "@/lib/auth/useUser";

export function MyComponent() {
  const { clerkUser, db, isAuthenticated, isLoaded } = useUser();

  // Check loading state
  if (!isLoaded) return <div>Loading...</div>;

  // Check authentication
  if (!isAuthenticated) return <div>Please sign in</div>;

  // Use the database operations
  const handleClick = async () => {
    const stats = await db.progress.getStats();
    console.log(stats);
  };

  return (
    <div>
      <h1>Welcome {clerkUser?.firstName}</h1>
      <button onClick={handleClick}>Load Stats</button>
    </div>
  );
}
```

## Return Value

```typescript
{
  // Clerk user object
  clerkUser: User | null;
  
  // Loading state
  isLoaded: boolean;
  
  // User ID (shortcut)
  userId: string | undefined;
  
  // Helper flag
  isAuthenticated: boolean;
  
  // All database operations bound to userId
  db: UserDatabaseOperations;
}
```

## Database Operations (db object)

### Questions

#### Reading & Searching
```typescript
// Search questions with filters
const { questions, total } = await db.questions.search({
  subjectId: "...",
  difficulty: "hard",
  hasMath: true,
  searchText: "integral",
  limit: 20,
});

// Get single question with all details
const question = await db.questions.getById(questionId);

// Get questions by topic
const topicQuestions = await db.questions.getByTopic(topicId, limit);
```

#### Creating & Modifying (admin operations)
```typescript
// Create a question
const result = await db.questionsAdmin.create({
  subjectId: "...",
  primaryTopicId: "...",
  difficulty: "medium",
  questionType: "structured",
  parts: [/* ... */],
});

// Update question
await db.questionsAdmin.update(questionId, {
  difficulty: "hard",
});

// Delete question
await db.questionsAdmin.delete(questionId);
```

### Study Plans

#### Reading
```typescript
// Get all plans for user
const plans = await db.studyPlans.getAll();

// Get only active plans (between start and end dates)
const activePlans = await db.studyPlans.getActive();

// Get specific plan with items
const plan = await db.studyPlans.getById(planId);

// Get today's tasks
const todaysTasks = await db.studyPlans.getTodaysTasks();

// Get plan statistics
const stats = await db.studyPlans.getStats(planId);
```

#### Creating & Modifying
```typescript
// Create a plan
const plan = await db.studyPlansAdmin.create({
  name: "May Exam Prep",
  startDate: new Date(),
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
});

// Create plan with initial items
const { plan, items } = await db.studyPlansAdmin.createWithItems(
  {
    name: "Chemistry Prep",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  [
    {
      subjectId: "chem-id",
      topicIds: ["organic-id", "inorganic-id"],
      taskType: "practice_questions",
      dueDate: new Date(),
      targetQuestionsCount: 10,
    },
  ]
);

// Mark item as done
await db.studyPlansAdmin.markItemDone(itemId);

// Mark item as skipped
await db.studyPlansAdmin.markItemSkipped(itemId);
```

### Progress Tracking

#### Statistics & Analysis
```typescript
// Get complete statistics
const stats = await db.progress.getStats();
// Returns: {
//   totalQuestionsAttempted,
//   totalQuestionsCorrect,
//   successRate,
//   averageAttemptsPerQuestion,
//   questionsNotAttempted,
// }

// Get questions user struggled with
const struggled = await db.progress.getStrugglingQuestions(limit);

// Get mastered questions
const mastered = await db.progress.getMasteredQuestions(minCorrectAttempts);

// Get recently attempted questions
const recent = await db.progress.getRecentAttempts(limit);

// Get current streak
const streak = await db.progress.getStreak();

// Get questions needing review
const review = await db.progress.getForReview(limit);
```

#### Recording Attempts
```typescript
// Record that user answered correctly
await db.progressAdmin.recordAttempt(questionId, true);

// Record that user answered incorrectly
await db.progressAdmin.recordAttempt(questionId, false);

// Reset progress for a question
await db.progressAdmin.resetQuestion(questionId);
```

## Complete Example

```typescript
"use client";

import { useUser } from "@/lib/auth/useUser";
import { useEffect, useState } from "react";

export function Dashboard() {
  const { clerkUser, db, isAuthenticated, isLoaded } = useUser();
  const [data, setData] = useState({
    stats: null,
    todaysTasks: null,
    struggled: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      try {
        const [stats, todaysTasks, struggled] = await Promise.all([
          db.progress.getStats(),
          db.studyPlans.getTodaysTasks(),
          db.progress.getStrugglingQuestions(5),
        ]);

        setData({ stats, todaysTasks, struggled });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, db]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1>Welcome, {clerkUser?.firstName}!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3>Questions Attempted</h3>
          <p className="text-2xl font-bold">
            {data.stats?.totalQuestionsAttempted}
          </p>
        </div>
        <div>
          <h3>Success Rate</h3>
          <p className="text-2xl font-bold">
            {data.stats?.successRate.toFixed(1)}%
          </p>
        </div>
        <div>
          <h3>Current Streak</h3>
          <p className="text-2xl font-bold">
            {/* Load streak separately */}
          </p>
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <h2>Today's Study Tasks</h2>
        {data.todaysTasks?.map((task) => (
          <div key={task.id} className="p-4 border rounded">
            <p>{task.taskType}</p>
            <p>{task.targetQuestionsCount} questions</p>
          </div>
        ))}
      </div>

      {/* Questions to Review */}
      <div>
        <h2>Review These Questions</h2>
        {data.struggled?.map((q) => (
          <div key={q.id} className="p-4 border rounded">
            <p>Question {q.id}</p>
            <p>Attempts: {q.timesAttempted}</p>
            <p>Correct: {q.timesCorrect}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Component Examples

See the `components/examples/` directory for more complete examples:

- **UserProgressDashboard.tsx** - Shows user stats
- **QuestionSearch.tsx** - Search questions with filters
- **QuestionAttempt.tsx** - Record question attempts

## Error Handling

The hook automatically checks for authentication before operations:

```typescript
const { db, isAuthenticated } = useUser();

try {
  if (!isAuthenticated) {
    throw new Error("User not authenticated");
  }
  const stats = await db.progress.getStats();
} catch (error) {
  console.error("Error loading stats:", error);
}
```

## Type Safety

All database operations are fully typed:

```typescript
// TypeScript knows the exact return types
const result = await db.questions.search({
  subjectId: "...",
  difficulty: "hard", // must be: easy | medium | hard | very_hard
  limit: 20,
});

// result has type { questions: Question[], total: number }
for (const q of result.questions) {
  console.log(q.id); // TypeScript knows this exists
}
```

## Server Actions vs Client Hook

This hook is for **client components** only (they have the "use client" directive).

For **server components** or **server actions**, use the database functions directly:

```typescript
// Server action
"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserProgressStatistics } from "@/lib/db";

export async function getStats() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  return getUserProgressStatistics(userId);
}
```

## Best Practices

1. **Always check authentication before using db operations**
   ```typescript
   if (!isAuthenticated) return <div>Please sign in</div>;
   ```

2. **Handle loading and error states**
   ```typescript
   if (!isLoaded) return <div>Loading...</div>;
   try {
     // database call
   } catch (error) {
     // handle error
   }
   ```

3. **Use in client components only**
   ```typescript
   "use client"; // Always at the top
   ```

4. **Batch related queries with Promise.all**
   ```typescript
   const [stats, tasks, review] = await Promise.all([
     db.progress.getStats(),
     db.studyPlans.getTodaysTasks(),
     db.progress.getForReview(),
   ]);
   ```

## Why This Approach?

- **No manual userId passing** - Automatically bound to authenticated user
- **Type-safe** - All operations are fully typed
- **Clean code** - Better than littering userId everywhere
- **Separation of concerns** - Auth (Clerk) separate from data (DB)
- **Easy to test** - Can mock the hook in tests
- **Familiar pattern** - Similar to how other React hooks work
