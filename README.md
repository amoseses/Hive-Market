# Hive Markets

B2B wholesale storefront and staff console built with **Next.js (App Router)**, **Tailwind CSS**, **shadcn/ui**, and **Supabase** (Postgres + Auth + Storage).

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

## Setup

1. Clone and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

   Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project **Settings → API**.

   Use the **Project URL** only (e.g. `https://YOUR_REF.supabase.co`) — **not** the REST URL ending in `/rest/v1`.

3. Apply the database schema. In the Supabase SQL editor, run the migration file:

   - [`supabase/migrations/20250509000000_init_hive_markets.sql`](supabase/migrations/20250509000000_init_hive_markets.sql)

   Optionally seed demo categories/products:

   - [`supabase/seed.sql`](supabase/seed.sql)

4. In Supabase **Authentication → URL configuration**, add:

   - **Site URL**: `http://localhost:3000` (and your production URL when deployed)
   - **Redirect URLs**: `http://localhost:3000/auth/callback` (and production equivalent)

5. Promote your first staff or admin user (run in SQL editor **after** you sign up once):

   First, if you already applied the original migration, run the bootstrap fix once:

   - [`supabase/migrations/20250509000001_allow_dashboard_role_bootstrap.sql`](supabase/migrations/20250509000001_allow_dashboard_role_bootstrap.sql)

   Then promote your account:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'your-email@example.com';
   ```

   Allowed values for `role` are `customer`, `staff`, and `admin`. Sellers use the **`staff`** role (seller console at `/admin`). Customers can also self-register as sellers at **Account → Become a seller** after running:

   - [`supabase/migrations/20250509000002_seller_registration.sql`](supabase/migrations/20250509000002_seller_registration.sql)

   For checkout (product weight, Stripe Connect, seller sub-orders, tax/shipping):

   - [`supabase/migrations/20250509000011_commerce_checkout.sql`](supabase/migrations/20250509000011_commerce_checkout.sql)

6. Configure payments and shipping in `.env.local` (see [`.env.local.example`](.env.local.example)):

   - **Stripe** — enable [Connect](https://dashboard.stripe.com/connect) (Express accounts) and [Stripe Tax](https://dashboard.stripe.com/tax). Create a webhook endpoint pointing to `/api/stripe/webhook` for `payment_intent.succeeded` and `account.updated`.
   - **Shippo** — create a test API token for Ground rate quotes at checkout.
   - **Supabase service role** — required for webhook order fulfillment (`SUPABASE_SERVICE_ROLE_KEY`).

   Sellers must complete **Seller console → Shipping & payouts** (ship-from address + Stripe Connect) before their products can be purchased. Each product requires **weight per unit (oz)** when listing.

## Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## RLS smoke tests (manual)

After signup, verify behavior in the Supabase dashboard or with the SQL editor:

| Scenario | Expected |
|----------|----------|
| Anonymous / anon key | Can `select` published products, categories, reviews, and `product_rating_stats`; can insert into `feedback` with email when logged out. |
| Authenticated customer | Can manage own cart, place orders, read own orders, insert/update own reviews; cannot access `/admin`. |
| Staff / admin | Full product CRUD, feedback read, all orders read/update, storage uploads to `product-images`. |

**Never** put the service role key in `NEXT_PUBLIC_*` variables or client bundles.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint
