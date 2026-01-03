# Etsy Profit+ Calculator - Production Ready ✅

A comprehensive Etsy profit calculator with AI-powered listing optimization, competitor analysis, and advanced pricing tools.

## 🚀 Features

### Core Calculator
- **Multi-currency support** (18+ currencies with live exchange rates)
- **Country-specific presets** (US, UK, EU, Canada, Australia)
- **2024 Etsy fee structure** (6.5% transaction, $0.20 listing, processing fees)
- **Offsite Ads calculator** (12-15% fee simulation)
- **Break-even price calculator**
- **Target margin/profit modes**

### Pro Features (Paid Plans)
- **AI Listing Optimizer** - Gemini-powered SEO analysis for titles, descriptions, and tags
- **Competitor Price Comparison** - Simulate profit impact of matching competitor pricing
- **PDF Export** - Professional calculation reports
- **Unlimited saved products** - Full inventory management
- **CSV Export** - Bulk data export

### User Experience
- **Dark/Light mode** with premium aesthetics
- **Responsive design** - Mobile, tablet, desktop optimized
- **SEO-optimized** - Unique meta tags for every page
- **Blog system** - 5 high-value articles on Etsy pricing strategy
- **Error boundary** - Graceful error handling (no white screen of death)

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom design system)
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Payments**: Stripe Checkout + Webhooks
- **AI**: Google Gemini API (via Supabase Edge Function)
- **Deployment**: Vercel (frontend) + Supabase (backend)

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Supabase CLI
- Stripe CLI (for webhook testing)

### Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Stripe keys

# Run development server
npm run dev
```

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PRICE_STARTER=price_xxxxx
VITE_STRIPE_PRICE_PRO=price_xxxxx
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**Quick Deploy:**
```bash
# Deploy Edge Functions
npx supabase functions deploy optimize-listing
npx supabase functions deploy stripe-checkout
npx supabase functions deploy stripe-webhook

# Deploy to Vercel
vercel --prod
```

## 📊 Database Schema

### `profiles`
- `id` (uuid, primary key)
- `email` (text, unique)
- `plan` (text: 'free' | 'starter' | 'pro')
- `stripe_customer_id` (text, nullable)
- `created_at` (timestamp)

### `products`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to profiles)
- `title` (text)
- `sku` (text, nullable)
- `currency` (text)
- `inputs` (jsonb - full calculator state)
- `created_at` (timestamp)

## 💰 Pricing Plans

- **Free**: 5 calculations/day, basic features
- **Starter ($9/mo)**: Unlimited calculations, 50 saved products
- **Pro ($19/mo)**: AI Optimizer, Competitor Analysis, PDF Export, unlimited everything

## 🔐 Security

- **RLS (Row Level Security)** enabled on all tables
- **JWT verification** on Edge Functions
- **Stripe webhook signature verification**
- **Environment secrets** managed via Supabase

## 📈 SEO

- Dynamic meta tags on all pages
- Structured data for blog posts
- Canonical URLs
- Open Graph + Twitter Cards
- Sitemap ready

## 🧪 Testing

```bash
# Type check
npm run type-check

# Build (production)
npm run build

# Preview production build
npm run preview
```

## 📝 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md) - Architecture and technical details

## 🐛 Known Issues

- **Gemini API Rate Limits**: Free tier has 15 requests/minute. Pro users may hit this during heavy usage.
- **Exchange Rates**: Cached for 24 hours. Not real-time.

## 🎯 Roadmap

- [ ] Multi-shop support
- [ ] Bulk CSV import
- [ ] Email notifications for price changes
- [ ] Mobile app (React Native)
- [ ] Etsy API integration (auto-import listings)

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For support, email support@etsyprofit.com or open an issue.

---

**Built with ❤️ for Etsy sellers**
