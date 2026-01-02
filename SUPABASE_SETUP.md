# Supabase Setup

This application uses Supabase for Authentication, Database, and Edge Functions.

## 1. Authentication
- Users sign up using email/password.
- A trigger automatically creates a `profiles` entry for each new user.
- Authentication state is managed via `onAuthStateChange` in `App.tsx`.

## 2. Database
Two main tables are used:
- **`profiles`**: Stores user plan, stripe info, and email. Linked to `auth.users`.
- **`products`**: Stores saved headers/calculations.

RLS is enabled to ensure users can only access their own data.

## 3. Edge Functions
This project uses Supabase Edge Functions (Deno) for secure backend logic.
- **`stripe-checkout`**: Creates a Stripe Session for plan upgrades.
- **`stripe-webhook`**: Listens for Stripe events to update user plans.

### Deployment
Functions are deployed to Supabase. You need to set the following secrets in your Supabase project:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL` (for webhook)
- `SUPABASE_SERVICE_ROLE_KEY` (for webhook)

## 4. Setup
The `.env.local` file contains your Supabase URL and Anon Key.
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
