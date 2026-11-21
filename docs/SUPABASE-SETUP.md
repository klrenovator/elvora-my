# Supabase setup — step by step

This connects the shop to a Supabase Postgres database so that **catalogue
edits and customer orders are stored permanently**. Until you complete these
steps the site keeps working exactly as it does now, using the compiled
catalogue and in-memory orders.

Budget about 15 minutes. You need a Supabase account and nothing else.

---

## 0. What you are setting up, and what it costs

| Item | Plan | Cost |
| --- | --- | --- |
| Supabase Free | 2 projects, 500 MB database, 1 GB file storage, 50,000 monthly active users | **$0** |
| Supabase Pro | 8 GB database, 100 GB storage, 250 GB egress, daily backups, **never pauses** | **$25/month** |

**Start on Free.** This catalogue is 7 products of text; 500 MB is far more than
enough. But note two Free-plan limitations that matter for a shop:

1. **Free projects pause after 7 days of inactivity.** A paused shop returns
   errors until you log in and resume it. For a live storefront this is the
   reason to move to Pro.
2. **No automated backups on Free.** For real order data that is a genuine risk.

**Recommendation:** run Free while testing, then move to Pro ($25/month) before
you take real orders. I will not enable any paid plan — you do that on the
Supabase billing page yourself.

---

## 1. Create the project

1. Sign in at <https://supabase.com/dashboard>.
2. **New project**.
3. Name: `elvora-my`. Region: **Southeast Asia (Singapore)** — closest to
   Malaysia and to Vercel's Singapore region.
4. Generate a strong database password and **save it in a password manager**.
   You will not need it if you use the connection strings in step 3, but keep it.
5. Wait ~2 minutes for provisioning.

## 2. Create the tables and security policies

1. In the dashboard, open **SQL Editor** → **New query**.
2. Open `supabase/migrations/0001_init.sql` from this repository, copy the whole
   file, paste it in, and press **Run**.
3. You should see "Success. No rows returned". The script is idempotent, so
   running it twice is harmless.

That file creates the `products` and `orders` tables, the constraints that stop
an order being marked paid without a payment record, and enables Row Level
Security with **no public access at all**.

### 2b. Create the photo bucket

Uploaded product photos live in Supabase Storage, which has its own permissions,
so it needs a separate script.

1. **SQL Editor** → **New query** again.
2. Open `supabase/migrations/0002_storage.sql`, copy the whole file, paste it in,
   and press **Run**.

It creates a bucket called `product-images` and makes it **public to read,
private to write**. That split is deliberate:

- **Read is public** because these are shop photos on public pages. Private
  buckets would need expiring links, which breaks Google image indexing and
  caching for no benefit.
- **Write is private** because a public upload policy would let anyone holding
  the public key fill your bucket with their own files, served from your domain,
  and spend your bandwidth allowance. Uploads go through the admin, which uses
  the secret service-role key and checks each file's actual bytes first.

The bucket also refuses anything over 8 MB and accepts only JPEG, PNG, WebP and
AVIF. **SVG is refused on purpose**: an SVG is a document that can carry
JavaScript, and serving one from your own domain is a genuine security risk.

## 3. Copy the connection string

1. **Project Settings** → **Database** → **Connection string** → **URI**.
2. Choose the **Connection pooling** tab, mode **Transaction**.
3. It looks like:

   ```
   postgresql://postgres.abcdefghijkl:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

Two things matter here:

- **Port 6543, not 5432.** 5432 is the direct connection and will exhaust
  connections from serverless functions. The app is configured for the pooler.
- **Replace `[YOUR-PASSWORD]`** with the database password from step 1.

## 4. Set the environment variables

Locally, in `.env.local` (already git-ignored):

```bash
SUPABASE_DB_URL=postgresql://postgres.abcdefghijkl:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Needed for product photo uploads, and for the verification script.
SUPABASE_URL=https://abcdefghijkl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...   # Project Settings → API → anon public

# SECRET. Project Settings → API → service_role. Server-side only.
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

On Vercel: **Project → Settings → Environment Variables**, add
`SUPABASE_DB_URL`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for
Production, Preview and Development.

The `service_role` key bypasses all database security. It is only ever read in
server code in this app, but treat it like a password: never paste it into a
client component, a chat message, a screenshot or a support ticket. If it leaks,
rotate it in **Project Settings → API → JWT Settings**.

> **Never** prefix these with `NEXT_PUBLIC_`. That would ship the database
> credentials to every browser. The app reads them only in server code.

## 5. Load your 7 products

```bash
npm run db:seed
```

This copies `src/content/products.ts` into the database verbatim — no price or
description is invented. It is insert-only, so running it again will not
overwrite a price you have since changed in the admin. To deliberately overwrite
*everything* from the compiled file, use `npm run db:seed -- --force`.

## 6. Verify the security

```bash
npm run db:verify
```

This is the step worth not skipping. It checks that:

- both tables exist with the payment and total constraints,
- RLS is enabled on both,
- **no** policy allows public access,
- the **anon key genuinely cannot read** products or orders,
- the `product-images` bucket exists, is public-read, and enforces the 8 MB limit,
- **no** policy allows public writes to storage,
- every product in the database passes the application's own validation.

All lines should say PASS. If any line says the public key can read a table,
stop — that means customer names, phone numbers and addresses are publicly
readable, and the schema was not applied correctly.

## 7. Restart and test

```bash
npm run verify        # typecheck, lint, tests, build
```

Then:

1. Open `/admin`, sign in.
2. The read-only banner should be **gone** — saving is now enabled.
3. Edit a product's price and save.
4. Open that product's page in a **private window** (to bypass cache) within a
   minute. The new price appears.
5. Place a test order. It appears at `/admin/orders` and **survives a restart**.

---

## How it behaves when things go wrong

| Situation | What happens |
| --- | --- |
| No `SUPABASE_DB_URL` set | Compiled catalogue, in-memory orders. The site works; admin is read-only. |
| Database unreachable (storefront) | Seed catalogue is served and a warning is logged. The shop stays up. |
| Database unreachable (checkout) | The order is **refused** with "nothing has been ordered or charged". Never priced from stale data. |
| Product page opened within 60s of an edit | May show the previous price. At most 60 seconds. |
| Cart holds an old price | Checkout refuses and asks the customer to review. It never overcharges. |

## Why RLS is configured as "deny everything"

The application talks to Postgres **only from the server** — Next.js server
components and server actions, using a connection string that bypasses RLS. No
browser ever queries the database directly.

So the correct policy is: **no policy**. The `anon` and `authenticated` roles
have no grants and no policies, and therefore no access. Customer names, phone
numbers and addresses are not reachable with the public key.

If you later add a customer account area that queries Supabase from the browser,
that is the moment to add scoped policies — and to re-read the comment block in
the migration before doing so.

## Backups

On Pro, Supabase keeps daily backups for 7 days. Also worth doing regardless:

```bash
pg_dump "postgresql://postgres:PASSWORD@db.abcdefghijkl.supabase.co:5432/postgres" \
  --no-owner --no-acl -f elvora-backup-$(date +%F).sql
```

Run that from your machine (port **5432** here, because this is a one-off
maintenance task, not a serverless connection), store the file somewhere that is
not this repository, and keep the last few.

## What is deliberately not done yet

- **Authentication is unchanged.** The admin still uses the single-owner
  password from Phase 2c. Moving to Supabase Auth would mean rewriting and
  re-testing authorisation that currently works, for no benefit at one user.
- **Photo storage requires the two Supabase variables.** Without `SUPABASE_URL`
  and `SUPABASE_SERVICE_ROLE_KEY` the admin refuses uploads with a plain message
  rather than pretending to save. Existing repository photos keep working, so a
  shop with no storage configured is still fully browsable and orderable — you
  just cannot add a *new* photo until those are set. Uploads are refused, never
  faked.
- **Payments remain disabled.** `features.payments` is still `false`. No order
  can be marked paid; the database constraint enforces this too.
