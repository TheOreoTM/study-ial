# StudyIAL - Complete Project Index

## Project Overview

StudyIAL is an AI-powered study platform for IAL A-Level students. The platform features PDF parsing, intelligent question extraction, and personalized study plans.

**Subjects Covered:**
- Chemistry (Units 1-6)
- Biology (Units 1-6)  
- Physics (Units 1-6)
- Mathematics (P1-P4, S1, M1)

---

## Database Layer (Complete ✅)

### Location: `lib/db/`

#### Core Files
| File | Lines | Purpose |
|------|-------|---------|
| `schema.ts` | ~370 | 13 PostgreSQL tables with types |
| `client.ts` | ~25 | Database connection singleton |
| `index.ts` | ~20 | Central export point |
| **Subtotal** | **~415** | **Schema & Connection** |

#### Functional Modules
| File | Functions | Purpose |
|------|-----------|---------|
| `questions.ts` | 20 | Question CRUD, search, statistics |
| `studyPlans.ts` | 20 | Study plan management |
| `progress.ts` | 15 | User progress tracking |
| `ingestion.ts` | 15 | PDF extraction pipeline |
| **Subtotal** | **70+** | **Business Logic** |

#### Utilities
| File | Purpose |
|------|---------|
| `seed.ts` | Initial database population |
| `README.md` | 300+ lines API documentation |

### Configuration Files
| File | Purpose |
|------|---------|
| `drizzle.config.ts` | Migration configuration |
| `.env.example` | Environment template |
| `DATABASE_SETUP_SUMMARY.md` | Setup guide |
| `QUICK_START_DB.md` | 1-minute setup |
| `DB_FUNCTIONS_REFERENCE.md` | Function index |

---

## Database Schema (13 Tables)

### Subject Organization
```
subjects
  ├── units
  └── topics
```

### Question Management
```
questions
  ├── questionParts
  │   ├── answerOptions (MCQ)
  │   └── questionAssets (per-part)
  ├── questionAssets
  ├── sourcePapers (past papers)
  └── ingestionJobs (PDF tracking)
```

### User Data
```
studyPlans
  └── studyPlanItems (daily tasks)

userQuestionProgress (attempt tracking)
```

---

## API Functions (70+)

### Questions (20 Functions)
**Create:**
- `createQuestion()` - With parts and assets
- `createQuestionPart()` - Add part to question
- `addQuestionAsset()` - Add diagram/graph

**Read:**
- `getQuestionWithDetails()` - Full question data
- `getQuestionsByTopic()` - Topic-filtered
- `getQuestionsBySourcePaper()` - Paper-filtered
- `getComplexQuestions()` - Multi-part only

**Search:**
- `searchQuestions()` - Advanced search with filters

**Update:**
- `updateQuestion()` - Single update
- `bulkUpdateQuestions()` - Batch update

**Delete:**
- `deleteQuestion()` - With cascade

**Statistics:**
- `getQuestionStatistics()` - Counts by type
- `exportQuestionsData()` - Full export

### Study Plans (20 Functions)
**Create:**
- `createStudyPlan()` - Single
- `createStudyPlanWithItems()` - With items
- `createStudyPlanItem()` - Add to existing

**Read:**
- `getStudyPlanWithItems()` - Full plan
- `getUserStudyPlans()` - User's all plans
- `getActiveStudyPlans()` - Current plans
- `getStudyPlanItemsByDateRange()` - Date filtered
- `getPendingStudyPlanItems()` - Not started
- `getOverdueStudyPlanItems()` - Past due
- `getTodaysStudyTasks()` - Today's tasks

**Update:**
- `updateStudyPlan()` - Plan properties
- `updateStudyPlanItem()` - Item properties
- `updateStudyPlanItemStatus()` - Mark done/skip
- `rescheduleStudyPlanItems()` - Shift dates

**Delete:**
- `deleteStudyPlan()` - Full deletion
- `deleteStudyPlanItem()` - Single item

**Statistics:**
- `getStudyPlanStatistics()` - Progress %

### Progress (15 Functions)
**Create:**
- `createUserQuestionProgress()` - Initialize
- `getUserQuestionProgress()` - Get or create

**Record:**
- `recordQuestionAttempt()` - Track attempt
- `markQuestionAttempted()` - First view
- `resetQuestionProgress()` - Clear history
- `resetAllUserProgress()` - Complete reset

**Retrieve:**
- `getUserProgressForQuestions()` - Multiple
- `getUserRecentProgress()` - Recent attempts
- `getQuestionsForReview()` - Struggling

**Statistics:**
- `getUserProgressStatistics()` - Complete stats
- `getUserStrugglingQuestions()` - Failed ones
- `getUserMasteredQuestions()` - Mastered
- `getUserStreak()` - Correct streak

**Update:**
- `updateDifficultyEstimate()` - Personalized

### Ingestion (15 Functions)
**Source Papers:**
- `createSourcePaper()` - Register paper
- `getSourcePapersBySubject()` - List by subject
- `getSourcePapersByYearSession()` - Find by year
- `deleteSourcePaper()` - Remove

**Jobs:**
- `createIngestionJob()` - Start job
- `getIngestionJob()` - Get details
- `updateIngestionJobProgress()` - Update status
- `getIngestionJobsForPaper()` - List jobs
- `getPendingIngestionJobs()` - Waiting jobs
- `getRecentIngestionJobs()` - Recent list

**Processing:**
- `ingestionQuestions()` - Main processor
- `validateExtractedQuestion()` - Single validation
- `validateExtractedQuestions()` - Batch validation

**Statistics:**
- `getIngestionStatistics()` - Overall stats

---

## Key Features

### Rich Content Support
- **LaTeX Math**: `\\int_0^1 x^2 dx` via KaTeX/MathJax
- **Images**: Diagrams, graphs, formula images
- **Tables**: Chemistry, physics data
- **Mixed Content**: All types combined in one question

### Question Types
- MCQ (Multiple Choice)
- Structured (Multi-part with calculations)
- Essay/Long Answer
- Graph/Diagram
- Table-based
- Calculation-heavy
- Combination types

### Study Planning
- AI-generated personalized plans
- User-customizable schedules
- Daily task tracking
- Flexible rescheduling
- Progress monitoring

### Progress Intelligence
- Attempt history
- Success/failure rates
- Personalized difficulty estimates
- Question mastery detection
- Recommended review questions

### Bulk Ingestion
- Gemini 2.5 Pro extraction
- Automatic validation
- Error handling & reporting
- Progress tracking
- Partial failure support

---

## Getting Started

### 1. Database Setup
```bash
# Create database
createdb study_ial

# Set environment
echo "DATABASE_URL=postgresql://localhost/study_ial" > .env.local

# Run migrations
pnpm dlx drizzle-kit migrate

# Seed data
pnpm tsx lib/db/seed.ts
```

### 2. Use in Code
```typescript
import {
  createQuestion,
  searchQuestions,
  recordQuestionAttempt,
} from "@/lib/db";

// Create question
const q = await createQuestion({...});

// Search questions
const { questions } = await searchQuestions({
  subjectId: "...",
  difficulty: "hard"
});

// Track progress
await recordQuestionAttempt(userId, questionId, true);
```

### 3. Build API Routes
Create files in `app/api/` to expose database functions:
```
app/api/
├── questions/
│   ├── route.ts (GET, POST)
│   ├── [id]/
│   │   └── route.ts (GET, PATCH, DELETE)
│   └── search/route.ts (GET)
├── study-plans/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── [id]/items/route.ts
└── progress/
    ├── route.ts
    └── [questionId]/route.ts
```

### 4. Build UI Components
```
components/
├── questions/
│   ├── QuestionViewer.tsx
│   ├── QuestionSearch.tsx
│   └── QuestionForm.tsx
├── studyPlans/
│   ├── PlanList.tsx
│   ├── PlanEditor.tsx
│   └── TaskTracker.tsx
└── progress/
    ├── Dashboard.tsx
    ├── StatisticsPanel.tsx
    └── ProgressChart.tsx
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `DATABASE_SETUP_SUMMARY.md` | Full overview |
| `QUICK_START_DB.md` | Quick setup guide |
| `DB_FUNCTIONS_REFERENCE.md` | Function index |
| `lib/db/README.md` | API documentation |
| `INDEX.md` | This file |

---

## Tech Stack

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL 14+
- **Runtime**: Node.js + TypeScript
- **Frontend**: Next.js 16, React 19
- **Auth**: Clerk
- **AI**: Gemini 2.5 Pro (for OCR/extraction)
- **Content Formats**: LaTeX, Markdown, JSON

---

## Project Statistics

- **Database Tables**: 13
- **Database Functions**: 70+
- **TypeScript Types**: 24 (auto-generated)
- **Enums**: 6
- **Lines of Code**: 2000+
- **Documentation**: 1000+ lines

---

## Next Steps (Prioritized)

1. **API Routes** - Expose database functions via REST API
2. **Authentication** - Integrate Clerk user management
3. **Question Viewer** - Component to display rich questions
4. **Search UI** - Front-end search interface
5. **Study Dashboard** - Show plans and progress
6. **PDF Ingestion** - Integration with Gemini API
7. **Analytics** - User progress analytics
8. **Admin Panel** - Manage questions and papers

---

## File Tree

```
study-ial/
├── lib/db/
│   ├── schema.ts              ← Table definitions
│   ├── client.ts              ← Connection
│   ├── index.ts               ← Exports
│   ├── questions.ts           ← Question functions
│   ├── studyPlans.ts          ← Study plan functions
│   ├── progress.ts            ← Progress functions
│   ├── ingestion.ts           ← Ingestion functions
│   ├── seed.ts                ← Seed script
│   └── README.md              ← API docs
├── drizzle.config.ts          ← Migration config
├── .env.example               ← Environment template
├── DATABASE_SETUP_SUMMARY.md  ← Setup guide
├── QUICK_START_DB.md          ← Quick start
├── DB_FUNCTIONS_REFERENCE.md  ← Function list
└── INDEX.md                   ← This file
```

---

## Support & Resources

- **Drizzle Documentation**: https://orm.drizzle.team
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **TypeScript Documentation**: https://www.typescriptlang.org/docs

---

**Database Setup Complete! Ready for API Development.** ✅
