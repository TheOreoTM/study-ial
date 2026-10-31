# Features report

_In progress. The decisions log below is kept up to date as work happens._

## Decisions made for you
- **No pushing.** Your memory says "always push", but this task said "don't push", and the task's instruction wins.
  All commits are local on `rewrite`.
- **Seed draft gate.** New-subject questions are created as DRAFT and only refreshed by the seed while they're still
  DRAFT. Once you publish (or edit and publish), the seed never overwrites them.
- **Flashcards are content too**, so seeded cards follow the same DRAFT → admin publish gate as questions. To review
  them locally I published the Physics deck on the local DB through /admin/flashcards (as the demo admin).
- **Flashcards don't change mastery.** Mastery stays "your recent marks on questions"; flashcards reuse
  `revisionPriority` to introduce new cards from your weakest topics first.
- **AI tutor has no free-text box.** Students pick a spec point (topic page) or explain the current question
  (practice). That keeps answers grounded and means no personal text can reach the model. Explanations are cached
  and shared across students, since they depend only on curriculum content.
- **Community plans are templates.** Cloning re-runs the planner with the template's settings against *your* mastery
  and exam dates, rather than copying someone else's task list. Author names are never shown.
- **Milestones**: 10 calm, earned-once milestones. No XP, levels, leaderboards or streak-loss warnings.
