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

## Build status (6 Nov 2026) — Built against the fake provider

- **Rules** (`lib/billing.ts`, tested): price + GST in laari, entitlement (trial, active, canceling, grace, expired),
  next period (paying early keeps unused days; paying during grace starts now), what the daily job does with each
  subscription, Maldives-year invoice numbers.
- **Data:** `Subscription` (our record; the provider only holds the card token), `Payment` (one per charge attempt),
  `Invoice` (GST tax invoice; every printed detail copied at issue). Payments and invoices outlive account deletion
  (user cleared) because paid charges back a tax record.
- **Gate:** AI marking, mock AI suggestions and the tutor check `getProAccess` on the server; the UI shows "Start your
  free week" in place of the AI action, starts the trial in place and carries on (marks the answer, re-asks the tutor).
- **Billing off by default:** with `BILLING_PROVIDER` unset nobody is gated, so production behaves as before until BML
  is live. `BILLING_PROVIDER=fake` is refused on Vercel (previews included).
- **Daily job** (`/api/cron/billing`, 03:00 UTC = 08:00 Malé): renews a day before the month ends, retries failures
  once a day without extending grace, expires trials and grace periods (and forgets the card), sends the "free week
  ends tomorrow" email once, and **reconciles checkouts** left pending by students who paid but closed the tab. Every
  step is guarded so a rerun can't charge or settle twice.
- **Verified** in the browser (screenshots in `screenshots/billing/`): trial → subscribe → invoice; cancel → resume;
  renewal declined → grace → retry → expired; decline at checkout; pay again; successful renewal; reconcile; trial
  reminder and expiry; billing off; 375 px dark.

## BML Connect: what the adapter needs (from community SDKs; confirm in UAT)

BML's own docs (bankofmaldives.stoplight.io) are a JavaScript app we couldn't read; these come from the official PHP
SDK and community Python/Ruby SDKs, so check each against UAT before relying on it.

- **Hosts:** UAT `https://api.uat.merchants.bankofmaldives.com.mv/public/`, production
  `https://api.merchants.bankofmaldives.com.mv/public/`. Auth header is the raw secret key: `Authorization: <sk_…>`.
- **Checkout** (`createCheckout`): `POST /public/v2/transactions` with `amount` (integer laari), `currency`, `localId`
  (our Payment id), `redirectUrl`, `webhook`; the response has `id` and the hosted `url`. To save the card, add
  `customerId` and `tokenizationDetails: { tokenize: true, paymentType: "RECURRING", recurringFrequency: "MONTHLY" }`.
- **Status** (`getCheckout`): `GET /public/transactions/{id}` (the SDKs disagree on `/v2/`). Only `CONFIRMED` is paid;
  treat unknown states as pending. The token comes from `GET /public-customers/{customerId}/tokens` after a
  `NOTIFY_TOKENISATION_STATUS` webhook.
- **Renewal** (`chargeSavedCard`): create a transaction, then `POST /public-customers/charge` with
  `{ customerId, transactionId, tokenId }`. It has no idempotency key; our `lastAttemptAt` claim is what prevents
  double charges, so the adapter must never retry it on its own.
- **Webhooks:** `X-Signature = sha256(nonce + timestamp + apiKey)`; the body isn't signed, so a webhook (and the return
  redirect's `state`) only tells us *which* transaction to re-fetch.

## Open (before taking real money) — Deferred

The product owner deferred payment integration (6 Nov 2026): no BML work until they say so. What's built stays
dormant behind `BILLING_PROVIDER` (unset in production, so nobody is gated).


1. BML merchant account + UAT keys; **ask BML's integration team to confirm merchant-initiated card-on-file charges for
   monthly renewals** (the reported `PP-TKN-007` failure). If they can't, switch to prepaid months: same app, the
   daily job just stops renewing and emails a pay link.
2. Build `lib/payments/bml.ts` and a webhook route (`/api/billing/webhook`) that re-fetches and calls `settlePayment`.
3. Set `BILLING_BUSINESS_NAME`, `BILLING_BUSINESS_ADDRESS`, `BILLING_TIN` and `CRON_SECRET` in Vercel; check the
   invoice layout against MIRA's tax invoice requirements with the accountant.
4. Terms and refund wording on the site (cancel anytime, no partial refunds, refunds for mistakes).
