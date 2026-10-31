# Flashcards with spaced repetition

## User problem
A lot of IAL marks are recall: definitions, equations, reagents and conditions, standard results. A student who loses
marks on a definition doesn't need another 6-mark question. They need to remember the definition, and to be reminded
again just before they would forget it.

## Product shape
- A **deck per topic**: shared cards (seeded, reviewed by an admin) plus the student's **own cards**, which only they
  can see.
- Reviewing is a short, calm session: see the front, reveal the back, grade it **Again / Good / Easy**. There's no
  timer, no score and no streak pressure.
- Scheduling is a small SM-2-style algorithm (`lib/srs.ts`, pure and unit-tested). Due dates are **local calendar
  days** (`localDayKey`, Maldives time), the same as plan tasks.
- **New cards per day are capped (10)** so a big deck never turns into a wall of 200 due cards. Reviews of cards
  already started are always shown.

## Connection to mastery and the dashboard
- Flashcards **do not change mastery**: mastery stays "your own recent marks on questions" (Honest progress).
- New cards are introduced **from the student's weakest topics first** (ordered by `revisionPriority`), so the review
  queue points at the same topics as "Revise next".
- **Dashboard**: the "Revise next" rail gets a compact "Flashcards" line: "12 cards due today", with an outline "Review"
  button (One Orange Rule: the page's orange action stays the plan task or weak-topic practice). When nothing is due,
  it says when the next card is due.
- **Topic page**: the aside shows the deck size and due count, with links to review this topic and to add your own card.

## Schema changes
```prisma
model Flashcard {
  id, seedKey String? @unique, topicId → Topic (cascade), front String, back String,
  status QuestionStatus @default(DRAFT)   // shared cards: admin publishes; own cards are PUBLISHED on create
  userId String? → User (cascade)         // null = shared deck card, set = the student's own card
  createdAt, updatedAt, reviews FlashcardReview[]
  @@index([topicId, status]) @@index([userId])
}
model FlashcardReview {                    // one row per (student, card) once they've seen it
  userId, flashcardId (cascade both), dueDay DateTime @db.Date, intervalDays Int, ease Float,
  reps Int, lapses Int, lastReviewedAt DateTime
  @@id([userId, flashcardId]) @@index([userId, dueDay])
}
```
Seeded cards come from `prisma/seed-data/flashcards/*.ts` (written from each topic's spec points and summary) and are
**DRAFT**, with the same review gate as draft questions.

## Routes
- `/flashcards`: due today, new available, and decks for your units grouped by unit, each with due/new counts. One
  primary action: "Review N cards".
- `/flashcards/review?topic=<id>` (topic optional): the review session (client component; queue built on the server).
- `/flashcards/[topicId]`: the deck for one topic, listing shared cards and your own, with add, edit and delete for
  your own cards.
- `/admin/flashcards`: draft and published counts per topic; publish or unpublish a topic's cards, or delete a card.
- Nav: "Flashcards" sits between Practice and Plans.

## Server actions (`app/(app)/flashcards/actions.ts`)
`gradeCard({ cardId, grade })`, `createCard({ topicId, front, back })`, `updateCard`, `deleteCard`. Each one calls
`assertUser()`, validates with zod, and checks ownership: a student can only grade cards they're allowed to see
(published shared cards, or their own) and can only edit or delete their own. Each calls `revalidatePath` for
`/flashcards` and `/dashboard`. Admin actions call `assertAdmin()`.

## Non-AI fallback
The whole feature is non-AI.

## Done means
- `lib/srs.test.ts` covers first review, Again resets, Easy grows faster, the ease floor, interval caps and day
  arithmetic across month ends.
- Queue tests cover the new-card cap, weakest topics first, and due before new.
- Seeded cards (all subjects, Physics included) arrive as DRAFT. Once an admin publishes a deck at /admin/flashcards,
  the demo user can review it and the due count shows on the dashboard; screenshots pass in light/dark at 1440/375.
