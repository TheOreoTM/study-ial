# useUser Hook - Complete Setup Guide

## ✅ What Was Implemented

I've created a clean, type-safe integration between **Clerk authentication** and your **database operations**. No more manually passing `userId` around!

### Files Created

```
lib/auth/
├── useUser.ts         - Main hook with bound database operations
├── UserProvider.tsx   - Optional provider wrapper
└── README.md          - Complete documentation

components/examples/
├── UserProgressDashboard.tsx  - Example: Display stats
├── QuestionSearch.tsx          - Example: Search with filters  
└── QuestionAttempt.tsx         - Example: Record attempts
```

### Updated Files

```
app/layout.tsx - Added UserProvider wrapper (optional but recommended)
```

## 🚀 Quick Start

### 1. Use the Hook in Your Components

```typescript
"use client";

import { useUser } from "@/lib/auth/useUser";

export function MyComponent() {
  const { clerkUser, db, isAuthenticated, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Welcome {clerkUser?.firstName}!</div>;
}
```

### 2. Access Database Operations

```typescript
// Get user statistics
const stats = await db.progress.getStats();

// Search questions
const { questions } = await db.questions.search({
  subjectId: "...",
  difficulty: "hard",
});

// Record attempt
await db.progressAdmin.recordAttempt(questionId, true);

// Get today's study tasks
const tasks = await db.studyPlans.getTodaysTasks();
```

## 📦 Hook Return Value

```typescript
{
  // From Clerk
  clerkUser: User | null,           // Full Clerk user object
  isLoaded: boolean,                 // Is Clerk ready?
  isAuthenticated: boolean,          // Shortcut: !!clerkUser && isLoaded
  userId: string | undefined,        // User ID

  // Database operations (bound to userId)
  db: {
    questions: {...},        // Search, get, CRUD
    studyPlans: {...},       // Plans, tasks, daily work
    progress: {...},         // Stats, analysis, review list
    progressAdmin: {...},    // Record attempts, reset
    studyPlansAdmin: {...},  // Create, modify plans
    questionsAdmin: {...},   // Create, modify questions
  }
}
```

## 📚 Database Operations Structure

### Questions (Searching & Reading)
```typescript
db.questions.search({...})          // Advanced search with filters
db.questions.getById(id)            // Get full question with parts
db.questions.getByTopic(topicId)    // Get questions for topic
```

### Questions (Creating & Modifying - Admin)
```typescript
db.questionsAdmin.create({...})     // Create question
db.questionsAdmin.update(id, {...}) // Update properties
db.questionsAdmin.delete(id)        // Delete question
```

### Study Plans (Reading)
```typescript
db.studyPlans.getAll()              // Get all user plans
db.studyPlans.getActive()           // Get current plans
db.studyPlans.getById(id)           // Get plan with items
db.studyPlans.getTodaysTasks()      // Get today's tasks
db.studyPlans.getStats(id)          // Get completion %
```

### Study Plans (Creating & Modifying)
```typescript
db.studyPlansAdmin.create({...})    // Create plan
db.studyPlansAdmin.createWithItems({...}, [...])  // Create with tasks
db.studyPlansAdmin.markItemDone(id) // Mark task done
db.studyPlansAdmin.markItemSkipped(id)
```

### Progress (Statistics)
```typescript
db.progress.getStats()              // Full user statistics
db.progress.getStrugglingQuestions() // Questions to review
db.progress.getMasteredQuestions()   // Mastered questions
db.progress.getRecentAttempts()      // Recent attempts
db.progress.getStreak()              // Consecutive correct
db.progress.getForReview()           // Recommended review
```

### Progress (Recording)
```typescript
db.progressAdmin.recordAttempt(qId, isCorrect)  // Record attempt
db.progressAdmin.resetQuestion(qId)              // Clear history
```

## 💡 Common Patterns

### Get Dashboard Data
```typescript
const { db } = useUser();

const [stats, tasks, struggling] = await Promise.all([
  db.progress.getStats(),
  db.studyPlans.getTodaysTasks(),
  db.progress.getStrugglingQuestions(5),
]);
```

### Search and Display
```typescript
const { db } = useUser();

const { questions, total } = await db.questions.search({
  subjectId: "chem-id",
  difficulty: "hard",
  limit: 20,
});

console.log(`Found ${total} questions`);
```

### Record User Answer
```typescript
const { db, isAuthenticated } = useUser();

if (isAuthenticated) {
  // User answered correctly
  await db.progressAdmin.recordAttempt(questionId, true);
  
  // User answered incorrectly
  await db.progressAdmin.recordAttempt(questionId, false);
}
```

### Create Study Plan
```typescript
const { db } = useUser();

const { plan, items } = await db.studyPlansAdmin.createWithItems(
  {
    name: "Chemistry Crash Course",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  [
    {
      subjectId: "chem-id",
      topicIds: ["organic-id"],
      taskType: "practice_questions",
      dueDate: new Date(),
      targetQuestionsCount: 10,
    },
    {
      subjectId: "chem-id",
      topicIds: ["inorganic-id"],
      taskType: "mock_paper",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ]
);
```

## 🔒 Type Safety

All operations are **fully typed**:

```typescript
// TypeScript will catch errors
const { questions } = await db.questions.search({
  difficulty: "invalid", // ❌ Error: must be "easy" | "medium" | "hard" | "very_hard"
});

// Autocomplete works perfectly
db.progress.// ✓ Shows all available methods
```

## ⚠️ Important Notes

1. **Only use in client components** - Hook requires "use client" directive
2. **Always check authentication** - Before accessing db operations
3. **Handle loading states** - Check `isLoaded` before rendering
4. **Error handling** - Wrap database calls in try-catch

## 📝 Example Components

### Simple: Display Stats
```typescript
"use client";
import { useUser } from "@/lib/auth/useUser";

export function StatsCard() {
  const { db, isAuthenticated } = useUser();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    db.progress.getStats().then(setStats);
  }, [isAuthenticated, db]);

  return stats && <div>Success: {stats.successRate}%</div>;
}
```

### Medium: Search Interface
```typescript
"use client";
import { useUser } from "@/lib/auth/useUser";

export function SearchPage({ subjectId }) {
  const { db } = useUser();
  const [results, setResults] = useState([]);

  const handleSearch = async (filters) => {
    const { questions } = await db.questions.search({
      subjectId,
      ...filters,
    });
    setResults(questions);
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {results.map(q => <QuestionCard key={q.id} question={q} />)}
    </div>
  );
}
```

### Complex: Full Dashboard
```typescript
"use client";
import { useUser } from "@/lib/auth/useUser";

export function Dashboard() {
  const { clerkUser, db, isAuthenticated } = useUser();
  const [state, setState] = useState({ stats: null, tasks: null });

  useEffect(() => {
    if (!isAuthenticated) return;
    
    Promise.all([
      db.progress.getStats(),
      db.studyPlans.getTodaysTasks(),
    ]).then(([stats, tasks]) => {
      setState({ stats, tasks });
    });
  }, [isAuthenticated, db]);

  return (
    <div>
      <h1>Hi {clerkUser?.firstName}!</h1>
      {state.stats && <StatsWidget stats={state.stats} />}
      {state.tasks && <TaskList tasks={state.tasks} />}
    </div>
  );
}
```

## 🎯 Why This Approach?

✅ **No userId passing** - Automatically bound to authenticated user
✅ **Type-safe** - Full TypeScript support, no any types
✅ **Clean code** - One import, clear API
✅ **Separation of concerns** - Auth (Clerk) separate from data (DB)
✅ **Easy to test** - Can mock the hook in tests
✅ **Familiar pattern** - Like other React hooks

## 🔄 Comparison

### Before (Without Hook)
```typescript
import { useUser as useClerkUser } from "@clerk/nextjs";
import { getUserProgressStatistics } from "@/lib/db";

export function Component() {
  const { user } = useClerkUser();
  
  const handleClick = async () => {
    if (!user?.id) return;
    const stats = await getUserProgressStatistics(user.id);
    // ...
  };
}
```

### After (With useUser Hook)
```typescript
import { useUser } from "@/lib/auth/useUser";

export function Component() {
  const { db, isAuthenticated } = useUser();
  
  const handleClick = async () => {
    if (!isAuthenticated) return;
    const stats = await db.progress.getStats();
    // ...
  };
}
```

Much cleaner! ✨

## 📚 Full Documentation

See `lib/auth/README.md` for comprehensive documentation including:
- All available operations
- Error handling patterns
- Type definitions
- Server actions vs client components
- Best practices

## 🚀 Next Steps

1. **Try it in a component** - Use the hook in your next feature
2. **Check examples** - See `components/examples/` for patterns
3. **Read the docs** - `lib/auth/README.md` has everything
4. **Build with confidence** - Fully typed, no userId passing!

---

**You're ready to build features with clean, type-safe database access!** 🎉
