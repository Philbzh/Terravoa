# Terravoa — Pre-Launch Checklist

Last generated: 2026-05-01. Work top-to-bottom. Every item is concrete: you
should be able to point at a URL, an env var, a SQL result, or a screenshot
when you tick it.

- [ ] = not done
- [x] = done
- [~] = not applicable (write why)

---

## 1. Environment variables

Target: every row in `.env.example` is either set in Vercel (all three
environments: Production / Preview / Development) or explicitly skipped.

### 1.1 Hard-required in production (app refuses to start without them)

| Var | Purpose | Source |
|---|---|---|
| [ ] `NEXT_PUBLIC_SUPABASE_URL` | Supabase browser client | Supabase → Project Settings → API |
| [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase browser client | same |
| [ ] `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin client | same — **never expose client-side** |
| [ ] `STRIPE_SECRET_KEY` | Checkout + webhook | Stripe → Developers → API keys |
| [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Checkout Elements | same |
| [ ] `STRIPE_WEBHOOK_SECRET` | Signature verify | Stripe → Webhooks → Signing secret |
| [ ] `RESEND_API_KEY` | Transactional email | Resend → API Keys |
| [ ] `EMAIL_FROM` | From address for all system mail | Must match a verified Resend domain |
| [ ] `ADMIN_EMAILS` | CSV of staff emails allowed into `/admin` | Your team |
| [ ] `CRON_SECRET` | Auth for `/api/cron/*` and `/api/health/*` | `openssl rand -hex 32` |

Verification: deploy a preview build. Vercel build logs should contain no
`[env] missing` warnings. If any are hard-required and missing, the production
build will crash intentionally — check `src/lib/env.ts` for the full list.

### 1.2 Strongly recommended (soft warnings only)

| Var | Purpose |
|---|---|
| [ ] `UPSTASH_REDIS_REST_URL` | Persistent rate limiter (see §4) |
| [ ] `UPSTASH_REDIS_REST_TOKEN` | same |
| [ ] `ADMIN_CONTACT_EMAIL` | Where ops alerts / escalation digests are sent |
| [ ] `NEXT_PUBLIC_SITE_URL` | Absolute URLs in emails, sitemap, OG tags |
| [ ] `NEXT_PUBLIC_COMPANY_REGISTERED_ADDRESS` | Shown in Terms / Privacy / Impressum (required in DE/AT/FR) |
| [ ] `NEXT_PUBLIC_COMPANY_MANAGING_DIRECTOR` | Impressum §2 — legal representative |
| [ ] `NEXT_PUBLIC_COMPANY_REGISTRATION` | RCS court + number (e.g. `RCS Paris 123 456 789`) |
| [ ] `NEXT_PUBLIC_COMPANY_SIRET` | SIRET (14 digits) |
| [ ] `NEXT_PUBLIC_COMPANY_SHARE_CAPITAL` | Capital social, e.g. `10 000 €` |
| [ ] `NEXT_PUBLIC_COMPANY_VAT_ID` | VAT / TVA / USt-IdNr, e.g. `FR12345678901` |
| [ ] `NEXT_PUBLIC_COMPANY_PHONE` | Public support phone in international format |
| [ ] `NEXT_PUBLIC_COMPANY_CONTACT_EMAIL` | Defaults to `hello@terravoa.com`; override if different |
| [ ] `NEXT_PUBLIC_COMPANY_HOSTING_PROVIDER` | Defaults to Vercel; set if self-hosted or CDN-fronted |

### 1.3 Optional / feature-flagged

| Var | Default | Note |
|---|---|---|
| [ ] `NEXT_PUBLIC_ROBOTS_INDEX` | `false` | Set to `true` **only** when ready to be indexed |
| [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` | — | Only if using Sanity-driven content |
| [ ] `NEXT_PUBLIC_SANITY_DATASET` | — | same |
| [ ] `SANITY_TOKEN` | — | `npm run seed:sanity` only |
| [ ] `ALLOW_LEGACY_CRON_HEADER` | `false` | Leave unset unless migrating an old scheduler |

---

## 2. Supabase — database & RLS

- [ ] **All migrations applied in production.** Run `supabase db push` against
      the production project, or paste each file under `supabase/migrations/`
      in order into the SQL Editor. Minimum required set:
    - [ ] `schema.sql` (base schema, if not already applied)
    - [ ] every file in `supabase/migrations/` timestamped ≤ today
    - [ ] **`20260501000000_rls_lockdown.sql`** (fixes the 7 exposed tables — see audit item HIGH-4)

- [ ] **RLS verification query**. Run in SQL Editor, expect every row
      `rowsecurity = t`:

    ```sql
    select tablename, rowsecurity
    from pg_tables
    where schemaname = 'public'
    order by rowsecurity, tablename;
    ```

  Any `false` row is an exploitable hole via the anon key.

- [ ] **Policy sanity check.** Expected minimums:

    ```sql
    select tablename, count(*) as n_policies
    from pg_policies
    where schemaname = 'public'
    group by tablename
    order by tablename;
    ```

  Tables that must have at least one policy: every row returned by the query
  above. If a table shows `rowsecurity = t` but no policy, it silently denies
  *all* access — including things you probably want to work.

- [ ] **Automated backups enabled.** Supabase Dashboard → Database → Backups.
      Daily backups are on by default for paid tiers; verify retention ≥ 7 days.
- [ ] **Point-in-time recovery.** Consider enabling for the production project
      if your tier supports it — cheap insurance for accidental admin deletes.
- [ ] **Service role key never in client code.** Grep one more time:

    ```bash
    rg "SUPABASE_SERVICE_ROLE_KEY" src | rg -v "server-only|admin.ts|env.ts"
    ```

  Should return nothing beyond the admin client itself.

- [ ] **Auth redirect URLs whitelist.** Supabase → Authentication → URL
      Configuration. Add every locale-prefixed production URL you use:
      `https://www.terravoa.com/en/login`, `/de/login`, `/fr/login`, plus the
      password reset & admin equivalents.

---

## 3. Stripe

- [ ] **Mode toggle.** Using live keys (`sk_live_…`, `pk_live_…`) everywhere in
      Production env. Confirm by checking Vercel env vars, **not** by trust.
- [ ] **Webhook endpoint created in Stripe Dashboard.**
    - URL: `https://www.terravoa.com/api/webhooks/stripe`
    - Events to send: **`checkout.session.completed`** at minimum.
    - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
- [ ] **End-to-end test purchase.** One real `€0.50` test product, refund after.
      Confirm:
    - [ ] Order row appears in `orders` with `stripe_payment_id` populated.
    - [ ] `order_items` inserted with DB-authoritative prices (CRIT-3 fix).
    - [ ] Customer receipt email from Resend arrives.
    - [ ] Admin gets the new-order notification.
- [ ] **Webhook idempotency verified.** Resend the same Stripe event from the
      dashboard — second delivery should return `{ received: true, duplicate: true }`
      (see unique constraint on `orders.stripe_payment_id`).
- [ ] **Refund path tested.** Use `/admin/orders/[id]` → Refund, confirm
      `order_items.refunded_cents` increments and `orders.payment_status`
      updates.

---

## 4. Rate limiting — Upstash Redis

The in-memory fallback is useless on Vercel (every cold-start isolate gets its
own Map). You *must* activate Redis before opening public signup traffic.

- [ ] **Create a free Upstash Redis database.** https://console.upstash.com → New Database → region closest to your Vercel function region.
- [ ] **Copy the REST credentials** from the database's REST API tab into Vercel env:
    - `UPSTASH_REDIS_REST_URL`
    - `UPSTASH_REDIS_REST_TOKEN`
- [ ] **Deploy** to pick up the new env.
- [ ] **Health check:**

    ```bash
    curl -s -H "Authorization: Bearer $CRON_SECRET" \
      https://www.terravoa.com/api/health/rate-limit | jq
    ```

  Expect:

    ```json
    {
      "healthy": true,
      "redis": { "configured": true, "url_host": "…-redis.upstash.io" },
      "counter": { "advanced": true, … },
      "ip": { "source": "x-vercel-forwarded-for", "on_vercel": true },
      "env": "production"
    }
    ```

  If `redis.configured` is `false`, the env vars didn't deploy. If
  `counter.advanced` is `false`, Redis isn't reachable from the function.

- [ ] **Manual abuse test.** POST to `/api/newsletter` 15× in quick
      succession from the same IP. 11th+ request should return 429.

---

## 5. Email — Resend

- [ ] **Domain verified in Resend** (DKIM + SPF + DMARC records added to DNS).
      Unverified → mails get marked as spam or bounce.
- [ ] **`EMAIL_FROM` matches a verified domain.** Typo here silently sends
      everything to Resend's quarantine.
- [ ] **Live smoke test of each template:**
    - [ ] Contact form submission → admin receives escaped HTML (MED-2).
    - [ ] Producer application → applicant gets confirmation.
    - [ ] Producer application → admin gets the long-form alert.
    - [ ] Order confirmation (via Stripe test above).
    - [ ] Plan-request confirmation + admin notification.
- [ ] **Render check in Gmail, Outlook, Apple Mail.** Copy the source of one
      test email, paste into https://www.htmlemailcheck.com or send to
      your personal accounts across three clients.

---

## 6. Security — audit items

All of the following are code fixes from the security audit (done in previous
sessions). Verify each is still in place after final merges:

### Critical
- [x] **CRIT-1** — `/producer/*` redirects non-approved accounts to `/login/producer` with a status banner.
- [x] **CRIT-2** — Checkout validates every product price against the DB before calling Stripe.
- [x] **CRIT-3** — Stripe webhook uses DB `price` as authoritative `unit_amount`.
- [x] **CRIT-4** — `canViewProducerCommercialTerms` requires an approved producer session.

### High
- [x] **HIGH-1** — `/producer/products/new` uses a server action; `producer_id` is session-derived.
- [x] **HIGH-2** — Rate limiter switched to Upstash Redis (see §4).
- [x] **HIGH-3** — Admin login helper text no longer reveals `ADMIN_EMAILS`.
- [x] **HIGH-4** — RLS lockdown migration `20260501000000_rls_lockdown.sql` applied (see §2).
- [x] **HIGH-5** — Producer orders view strips `customer_email` (GDPR data minimisation).
- [x] **HIGH-6** — Customer login `next` param sanitised (`sanitizeCustomerNextPath`).
- [x] **HIGH-7** — Contact form rate-limited (5/IP/hr, 3/email/hr).
- [x] **HIGH-8** — Apply form rate-limited (3/IP/day, 2/email/day).

### Medium
- [x] **MED-1** — Theme init script extracted to a frozen module literal.
- [x] **MED-2** — Email HTML escaped via the `html` tagged template.
- [x] **MED-3** — `/checkout/success` ownership-gates sensitive fields.
- [x] **MED-4** — `/api/search` caps query at 64 chars, strips GROQ meta-chars.
- [x] **MED-5** — In-memory rate-limit Map hard-capped at 10 000 entries.
- [x] **MED-6** — Admin finance/customers/subscribers queries have `.limit()`.
- [x] **MED-7** — Fake social-proof toast removed (EU Omnibus / UWG §5).
- [x] **MED-8** — Producer session only exposes row when `status = 'approved'`.

### Low
- [x] **LOW-1** — Middleware (`proxy.ts`) gates `/admin` and `/producer/*` in all envs.
- [x] **LOW-2** — Startup env validation (`src/lib/env.ts`).
- [x] **LOW-3** — `supabase/admin.ts` imports `server-only`.
- [x] **LOW-4** — `sanity/client.ts` imports `server-only`.
- [x] **LOW-5** — IP extraction trusts `x-vercel-forwarded-for`, not `x-forwarded-for`.
- [x] **LOW-6** — Audit log writes on producer mutations.
- [x] **LOW-8** — Cron auth unified on `Authorization: Bearer`.
- [x] **LOW-9** — POST API routes enforce `Content-Type: application/json`.
- [x] **LOW-10** — `.env.local` not in git history (re-verify with `git log --all --full-history -- .env.local`).

### One-time manual checks before launch
- [ ] **Secret rotation.** Rotate any secret ever pasted into a chat, issue
      tracker, or doc: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
      `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `CRON_SECRET`.
- [ ] **Rotate Supabase JWT secret** if this project was ever used as a demo.
- [ ] **Delete `supabase/seed_admin_demo.sql` output from prod** if it was ever run.
- [ ] **Confirm `NEXT_PUBLIC_ROBOTS_INDEX=true`** only *after* everything below passes.

---

## 7. Legal / compliance (EU e-commerce)

Non-optional under GDPR, Omnibus, DSA, DSGVO, and the German UWG. Missing any
of these exposes Terravoa to Abmahnung within days of launch.

### 7.1 Published pages

- [ ] **Privacy policy (`/privacy`)** — lists every processor: Supabase,
      Stripe, Resend, Vercel, Upstash, Sanity, whatever analytics you add.
- [ ] **Terms of Service (`/terms`)** — with explicit withdrawal instructions
      and the 14-day right-of-cancellation clause (Widerrufsrecht).
- [ ] **Imprint / Impressum (`/imprint`)** — all fields below populated and
      rendered (see §7.2).
- [ ] **Cookie policy (`/cookies`)** — documents the `terravoa_cookie_consent`
      local-storage key and every essential/analytics cookie you actually set.
- [ ] **Return policy (`/returns`)** — reflects what the `return_requests`
      table actually supports.
- [ ] **Producer T&Cs** — separate contract PDF linked from apply page.

### 7.2 Impressum — real data filled in (blocking for DE/AT launch)

Every field below must render a real value on `/imprint`. The page uses env-var
fallbacks (see §1.2) that default to `[TO FILL: …]` placeholders — if any
placeholder appears on the live page, **do not index yet**.

- [ ] Service provider: `COMPANY_LEGAL_NAME` and
      `NEXT_PUBLIC_COMPANY_REGISTERED_ADDRESS` (full street address — **no
      PO box** for DE validity).
- [ ] Contact: `NEXT_PUBLIC_COMPANY_CONTACT_EMAIL` and
      `NEXT_PUBLIC_COMPANY_PHONE` (international format).
- [ ] Legal representative: `NEXT_PUBLIC_COMPANY_MANAGING_DIRECTOR`
      (also responsible for editorial content under §18 MStV).
- [ ] Registration: `NEXT_PUBLIC_COMPANY_REGISTRATION`
      (e.g. `RCS Paris 123 456 789`).
- [ ] `NEXT_PUBLIC_COMPANY_SIRET` — 14 digits.
- [ ] `NEXT_PUBLIC_COMPANY_SHARE_CAPITAL` — capital social amount.
- [ ] `NEXT_PUBLIC_COMPANY_VAT_ID` — FR…, DE…, or your actual intra-EU VAT.
- [ ] `NEXT_PUBLIC_COMPANY_HOSTING_PROVIDER` — defaults to Vercel; override
      only if you self-host or CDN-front.
- [ ] VSBG §36 statement (Germany consumer arbitration) — review the default
      *"not obliged and not willing"* wording. If you intend to join a
      consumer arbitration board, the wording needs to change accordingly.
- [ ] Smoke-test: visit `/de/imprint`, `/fr/imprint`, `/en/imprint` and
      verify no `[TO FILL: …]` string appears anywhere on the page.

### 7.3 Data-processing and commercial contracts

- [ ] **Data-processing agreement (Auftragsverarbeitungsvertrag)** signed
      with Supabase, Stripe, Resend, Vercel, Upstash, Sanity. Store PDFs in
      your compliance archive.

---

## 8. Observability

- [ ] **Error tracking configured.** No error tracker is wired yet (`@sentry/*`
      is only a transitive dep of Sanity). Add Sentry or equivalent **before**
      launch or you're flying blind:
    - `npm i @sentry/nextjs`
    - `npx @sentry/wizard@latest -i nextjs`
    - Add `SENTRY_DSN` + `SENTRY_AUTH_TOKEN` to Vercel.
- [ ] **Vercel log drain** or equivalent to keep `console.warn` / `console.error`
      searchable beyond 24 hours.
- [ ] **Vercel Analytics or Plausible** for traffic. GA4 is possible but
      drags in consent-banner overhead.
- [ ] **Uptime monitoring.** A free BetterStack / Uptime Robot check hitting
      `/` every 60 s. Escalate to email + phone.
- [ ] **Cron health.** `/api/health/rate-limit` and a similar check on
      `/api/cron/email-jobs` reachability. Vercel Cron logs → alerts on
      non-2xx.

---

## 9. Performance & SEO

- [ ] `NEXT_PUBLIC_ROBOTS_INDEX=true` set in Production only.
- [ ] `/sitemap.xml` and `/robots.txt` reachable and correct.
- [ ] **Lighthouse on `/`, `/products`, one product page, one producer page.**
      Targets (mobile): Performance ≥ 80, Accessibility ≥ 95, SEO ≥ 95.
- [ ] **Preload critical fonts.** Manrope + Noto Serif declared once in
      `app/layout.tsx` with `next/font`.
- [ ] **All images use `next/image`** — grep for bare `<img `:

    ```bash
    rg "<img " src
    ```

  Should return only intentional cases (e.g. inline SVG-in-HTML email previews).
- [ ] **OG image** (`/opengraph-image.png`) set and 1200×630.
- [ ] **JSON-LD** present on product pages (we ship Product + Organization schemas).
- [ ] **Lighthouse CI or PageSpeed monitoring** configured for regressions.

---

## 10. DNS, domain, TLS

- [ ] Apex domain (`terravoa.com`) and `www` both point at Vercel.
- [ ] TLS auto-renew active (Vercel-managed).
- [ ] Redirect chain is exactly: `terravoa.com` → `www.terravoa.com` (or vice
      versa — pick one and stick with it; duplicates cost SEO).
- [ ] Email DNS records (MX, SPF, DKIM, DMARC) for the sending domain.

---

## 11. Deployment & rollback

- [ ] **Protected `main` branch.** PR required, at least one approval,
      passing CI (`next build`, `tsc --noEmit`, `eslint`).
- [ ] **Preview deployment proven green.** Run the entire test-purchase flow
      against a preview URL + the prod Stripe test mode.
- [ ] **Rollback plan documented.** Vercel → Deployments → Promote previous.
      Document the *data* consequences: a rollback of the app code with an
      already-migrated DB is generally fine, the other direction is not. Run
      only **additive** migrations if you want this flexibility.
- [ ] **DB rollback playbook.** For any migration that drops a column, keep
      the previous snapshot handy and test restore on a throw-away project.

---

## 12. Post-deploy smoke test (run every release)

Minimum set, in this order. If any step fails, roll back.

1. [ ] Homepage loads, hero video/image renders, no console errors.
2. [ ] `/products` loads, at least one product card present.
3. [ ] Click through to a product detail page, check image + price.
4. [ ] Add to cart → `/checkout` → Stripe redirect succeeds.
5. [ ] Complete a €0.50 test purchase → `/checkout/success` renders with
       the correct amount and ownership-gating fields (MED-3).
6. [ ] Log into `/login` as the test customer → `/account/orders` shows
       the test order.
7. [ ] Log into `/admin` as an `ADMIN_EMAILS` user → dashboard renders.
8. [ ] Log into `/en/login/producer` as an approved test producer → their
       dashboard shows order line (without `customer_email`, see HIGH-5).
9. [ ] Contact form submission → admin email arrives.
10. [ ] Hit `/api/health/rate-limit` with `CRON_SECRET` → `healthy: true`.
11. [ ] Manually refund the test order → state propagates correctly.

---

## Sign-off

Only flip `NEXT_PUBLIC_ROBOTS_INDEX=true` when **every** item above is `[x]`
or explicitly `[~] not applicable because …`. Anything in between means you
launched before you were ready.

---

## 13. Post-launch backlog (deferred on purpose)

These are identified improvements we chose **not** to port before launch.
Each has a concrete trigger: only pick it up when that trigger is real, so
we don't invest in infrastructure before the UX pressure justifies it.

### 13.1 DataTable hook — `useTableControls` + `SortableHeader` + `ColumnFilter`  **[still deferred]**

- **Source**: Marubeni — `apps/web/src/features/admin/components/DataTable/`.
- **What it is**: Client-side multi-column sort + filter hook (text, enum,
  date range, cascading filters) with zero external deps.
- **Why we deferred it**: Terravoa's admin pages are **server-rendered**
  with `.limit()` caps. The hand-rolled URL-driven pattern
  (`?status=…&q=…&page=…`) is now proven across three pages
  (`/admin/applications`, `/admin/products`, `/admin/orders`) and is
  working well — no admin has asked for richer sort/filter yet.
- **Trigger to port**: An admin explicitly asks "I need to filter X on
  this page" **and** a 4th admin page needs the same URL-state filter
  pattern — at that point extract a small shared helper (e.g.
  `src/lib/admin/filters.ts` with a `parseStatus`, `makeStatusCountQuery`,
  `hrefFor` trio). Don't extract speculatively.
- **Rough cost when it happens**: ~2 h to extract + refactor the
  existing 3 pages; ~30 min per new page afterwards.

### 13.2 Tabbed table views with per-tab counts  **[done 2026-05-02 on `/admin/orders`]**

- Implemented on `/admin/orders` using the same hand-rolled pattern as
  `/admin/applications`. Four status tabs (`new / processing / shipped /
  delivered`) with live per-bucket counts.
- Deviated from the original "All / Pending / Shipped / Delivered /
  Disputed" guess: we don't have a `disputed` state yet and the real
  bucket the admin will pivot to most is `new` (needs action). Revisit
  tab set after 2–4 weeks of live orders.

### 13.3 Log when these get revisited

When item 13.1 is actually started, delete the corresponding
sub-section from this backlog and create the implementation tasks in the
regular dev workflow. Keeping it here is only useful until it's real
work.
