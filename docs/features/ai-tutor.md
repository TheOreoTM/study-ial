# AI topic tutor ("Explain this")

## User problem
A student gets a question wrong, reads the mark scheme, and still doesn't see *why*. Or they open a topic and one spec
point makes no sense. Without a teacher nearby in the evening, they get stuck and move on, and the topic stays weak.

## Product shape
- **Topic page**: an "Explain a spec point" panel. The student **picks a spec point (or the whole topic) from a list**.
  There is no free-text box, so explanations stay grounded in the specification and no personal text can reach the
  model. The answer is a short explanation, a worked example, and a common mistake.
- **Practice page**: after a question is marked, an "Explain this question" button gives a step-by-step walkthrough
  of the method, grounded in the stem, mark scheme and stored explanation.
- Answers render through `components/markdown.tsx` (GFM + KaTeX).

## Grounding (what the model sees)
Only curriculum content: subject/unit/topic names, topic summary, spec points, and for the topic tutor up to 4 published
question stems with their mark schemes. For the question tutor: the stem, options, mark scheme and explanation. **Never**
the student's name, email, id, or their typed answer. The system prompt tells the model to stay within the IAL spec and
to say when something is beyond it.

## Cost control
- New `AiFeature` `"tutor"`, 20 a day by default (`AI_DAILY_LIMIT_TUTOR`). `consumeAiQuota(userId, "tutor")` runs
  before every model call, and `refundAiQuota` runs if the call fails.
- **Shared cache**: explanations depend only on curriculum content, so they're cached in `TutorExplanation` by
  `(kind, refId, point)` and reused for every student for 30 days. A cache hit spends no quota and no tokens.

## Schema changes
```prisma
model TutorExplanation {
  id, kind String ("topic" | "question"), refId String, point Int (-1 = whole topic / question),
  content String, model String, createdAt DateTime
  @@unique([kind, refId, point])
}
```

## Non-AI fallback
When `aiEnabled` is false, the quota is used up, or the call fails, the panel shows **grounded content from the bank**:
- topic: the topic summary and the chosen spec point, plus the worked explanations of up to 3 published questions in
  that topic, under "Worked explanations from the question bank";
- question: the stored explanation and mark scheme. When AI is switched off entirely, the practice page doesn't offer
  the button at all, because the explanation and mark scheme it would repeat are already on screen after marking.
The panel says plainly why ("AI explanations are off" / "You've used today's 20 explanations").

## Routes and actions
No new routes. `app/(app)/tutor/actions.ts`: `explainTopic({ topicId, point })` and `explainQuestion({ questionId })`.
Each calls `assertUser()` and validates with zod. They return only published content: the topic must exist, and the
question must be PUBLISHED (so drafts can't leak). They return `{ ok, source: "ai" | "cache" | "fallback", ... }`.
Signed-out visitors on topic pages see "Sign in to get explanations".

## Done means
- Prompt builder is pure and tested (`lib/tutor.test.ts`): it includes the spec point and question context, contains no
  user fields, and respects length caps.
- With no `OPENROUTER_API_KEY` locally, both panels show the fallback. Screenshots in light/dark at 1440/375.
