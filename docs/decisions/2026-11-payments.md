# Decisions: payments and the Pro plan

Agreed with the product owner on 6 Nov 2026 (interview in the Claude Code session). Status: **Decided** = agreed;
**Open** = still to answer.

## Context: how Maldivian AI products charge (researched 6 Nov 2026)

- **Stripe doesn't support businesses based in the Maldives**, so it's out unless we set up a foreign company.
- **Thaana AI:** monthly plans in MVR (Go 100, Pro 200, Max 500) **+ 8% GST**, shown before paying; billed through
  **Bank of Maldives**, Visa/Mastercard; free account; top-ups; corporate packages by contact. <https://thaana.ai/pricing>
- **DhivehiGPT** (Javaabu): prepaid credit passes in MVR (daily 29, weekly 99, monthly 249, Pro 529; yearly −6%);
  unused credits roll over only if you renew within 3 days, which suggests manual renewal. Javaabu maintains a
  BML Connect package, so BML is likely. <https://dhivehigpt.com/plans>
- **BML Connect** (Bank of Maldives' gateway) has a REST API with sandbox (UAT) and production, keys from the merchant
  portal, official PHP/Python SDKs (none for Node). Card-on-file tokenisation exists for repeat charges, but at least
  one developer reports charging a stored card failing (`PP-TKN-007`) and unresolved with BML.

## Decided

1. **One paid plan, "Pro", monthly.** **MVR 99 + GST** (8% → MVR 106.92, shown before paying). Prices in MVR so
   local cards aren't hit by USD limits.
2. **Pro unlocks AI marking and the AI tutor**, the only features that cost us money per use. Everything else stays
   free (practice, self-marking, mastery, plans, mistakes, mock papers, flashcards, checklists, sharing), which keeps
   PRODUCT.md's "free to use" true for the core loop.
3. **Auto-renew with a saved card** through BML Connect card-on-file. Accepted risk: BML's stored-card charge has
   reported problems. To contain it:
   - the subscription is stored as our own record (status, period end); BML only stores the card token;
   - every renewal is retried, then falls back to a "pay to renew" link by email/dashboard; Pro stays on through a
     short grace period, so a failed charge never cuts a student off mid-week;
   - the provider sits behind one interface, so prepaid months (or another gateway) can replace auto-renew without
     touching the rest of the app;
   - **before building against production, confirm with BML's merchant integration team that card-on-file
     (merchant-initiated) charges work for monthly renewals.**
4. **7-day free trial**, no card needed, then back to Free unless they subscribe.

5. **GST-registered:** prices show as "MVR 99 + 8% GST" with the total (MVR 106.92) before paying, and every paid
   charge gets a numbered **tax invoice** with the business name, address and TIN. Those details come from environment
   variables (`BILLING_BUSINESS_NAME`, `BILLING_BUSINESS_ADDRESS`, `BILLING_TIN`), never the repo.
6. **Trial:** opt-in ("Start your free week") when a student first reaches for AI marking or the tutor, once per
   account, no card.
7. **Failed renewal:** keep Pro for a **3-day grace period**, retry the saved card daily, email and show a "renew"
   button; after day 3, back to Free. Nothing else is lost.
8. **Cancel anytime, no partial refunds:** Pro runs to the end of the paid month, then stops renewing. Refunds by
   request for mistakes (double charges).
9. **Who pays:** the student, from their own account. A "pay for my child" link (from the read-only share page) comes
   later.
10. **Scheduler:** a daily **Vercel Cron** job (08:00 Maldives time) renews due subscriptions, retries failures, ends
    grace periods and trials. It's an authenticated route (`CRON_SECRET`).
11. **Business set-up:** registered; BML merchant account in progress. Until keys arrive, everything runs against a
    **fake provider** (`BILLING_PROVIDER=fake`, dev and tests only) with its own approve/decline checkout page; the BML
    adapter plugs into the same interface once UAT keys exist.

## Scope notes

- The AI plan summary on new study plans stays free (small, capped at 5 a day); only marking and the tutor are Pro.
- Admin AI tools are unaffected.
- Money is stored in **laari** (1/100 MVR) as integers.
