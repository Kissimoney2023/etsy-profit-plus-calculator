
# Etsy Profit + Price Calculator Micro-SaaS

A production-ready Next.js Micro-SaaS designed to help Etsy sellers master their margins.

## 🚀 Key Features

- **Advanced Etsy Fee Logic**: Covers listing, transaction (6.5%), and processing fees.
- **Offsite Ads Analyzer**: Calculates "Safe Prices" to protect margins from 12%/15% fees.
- **Target Profit Strategy**: Reverse-calculates recommended prices based on target margin or amount.
- **Micro-SaaS Ready**: Integrated with Supabase Auth and Stripe Subscriptions.
- **SEO Optimized**: Static tool pages for major Etsy fee-related keywords.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, DB, RLS), Server Actions
- **Payments**: Stripe (Checkout, Billing Portal, Webhooks)
- **Forms**: React Hook Form, Zod

## ⚙️ Setup Instructions

### 1. Supabase Setup
- Create a new project at [supabase.com](https://supabase.com).
- Navigate to the **SQL Editor** and run the contents of `/supabase/migrations/20240101_init.sql`.
- Enable Email/Password and/or Magic Link in **Authentication > Providers**.

### 2. Stripe Setup
- Create **Starter** ($9) and **Pro** ($19) monthly products in Stripe Dashboard.
- Copy the **Price IDs** for each.
- Configure a **Webhook Endpoint** pointing to `your-app.com/api/stripe/webhook` with events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### 3. Environment Variables
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Local Development
```bash
npm install
npm run dev
```

## 📈 Deployment
- Push to GitHub.
- Connect repository to **Vercel**.
- Add all environment variables to the Vercel project settings.
- Deploy!

## ⚖️ Disclaimer
This tool is not affiliated with, endorsed, or sponsored by Etsy, Inc. "Etsy" is a trademark of Etsy, Inc.
