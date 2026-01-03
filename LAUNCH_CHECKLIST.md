# Pre-Launch Checklist

## ✅ Development Complete
- [x] Core calculator with all fee types
- [x] Multi-currency support (18+ currencies)
- [x] Country presets (US, UK, EU, CA, AU)
- [x] Supabase authentication
- [x] Product save/edit/delete
- [x] Dashboard with inventory management
- [x] CSV export
- [x] Blog system with 5 articles
- [x] SEO meta tags on all pages
- [x] Error boundary
- [x] Dark/Light mode
- [x] Pro feature gating (AI Optimizer, Competitor Compare)
- [x] PDF export
- [x] Stripe checkout integration
- [x] Stripe webhook for plan updates

## 🔧 Configuration Required

### Supabase
- [ ] Create production Supabase project
- [ ] Run database migrations
- [ ] Set Edge Function secrets:
  ```bash
  npx supabase secrets set GEMINI_API_KEY=xxx
  npx supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
  npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
  ```
- [ ] Deploy Edge Functions:
  ```bash
  npx supabase functions deploy optimize-listing
  npx supabase functions deploy stripe-checkout
  npx supabase functions deploy stripe-webhook
  ```

### Stripe
- [ ] Create production Stripe account
- [ ] Create two products:
  - [ ] Starter Plan ($9/month) - Copy Price ID
  - [ ] Pro Plan ($19/month) - Copy Price ID
- [ ] Set up webhook endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
- [ ] Select webhook events:
  - [ ] checkout.session.completed
  - [ ] customer.subscription.updated
  - [ ] customer.subscription.deleted
- [ ] Copy webhook signing secret

### Vercel
- [ ] Create Vercel project
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_STRIPE_PRICE_STARTER
  - [ ] VITE_STRIPE_PRICE_PRO
- [ ] Deploy to production

### Google Gemini
- [ ] Get Gemini API key from Google AI Studio
- [ ] Set in Supabase secrets (see above)
- [ ] Test AI Optimizer with Pro account

## 🧪 Testing Checklist

### Authentication
- [ ] Sign up new user
- [ ] Log in existing user
- [ ] Log out
- [ ] Password reset (if implemented)

### Calculator
- [ ] Basic calculation works
- [ ] Currency conversion works
- [ ] Country presets apply correctly
- [ ] Save product (logged in)
- [ ] Edit saved product
- [ ] Delete product

### Dashboard
- [ ] View saved products
- [ ] Search products
- [ ] CSV export works
- [ ] Stats display correctly

### Pro Features
- [ ] Free users see upgrade wall on AI Optimizer
- [ ] Free users see upgrade wall on Competitor Compare
- [ ] Pro users can access AI Optimizer
- [ ] Pro users can access Competitor Compare
- [ ] PDF export works

### Payments
- [ ] Pricing page displays correctly
- [ ] Stripe checkout redirects work
- [ ] Test card payment (4242 4242 4242 4242)
- [ ] Webhook updates user plan
- [ ] User can access Pro features after upgrade
- [ ] Subscription cancellation downgrades to free

### SEO & Performance
- [ ] All pages have unique meta tags
- [ ] Blog posts have article schema
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Dark mode works

## 🚀 Launch Day

### Pre-Launch (1 day before)
- [ ] Final production build test
- [ ] Verify all environment variables
- [ ] Test Stripe in live mode with real card
- [ ] Set up error monitoring (Sentry, optional)
- [ ] Prepare social media posts
- [ ] Prepare launch email (if applicable)

### Launch Day
- [ ] Deploy to production
- [ ] Verify live site is working
- [ ] Test full user journey (signup → upgrade → use Pro features)
- [ ] Monitor Vercel logs
- [ ] Monitor Supabase logs
- [ ] Monitor Stripe dashboard
- [ ] Post on social media
- [ ] Submit to Product Hunt (optional)

### Post-Launch (Week 1)
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Monitor conversion rates (free → paid)
- [ ] Respond to support emails

## 📊 Success Metrics

### Week 1 Goals
- 100+ signups
- 10+ paid conversions
- < 1% error rate
- > 90 Lighthouse score

### Month 1 Goals
- 500+ signups
- 50+ paid conversions
- $500+ MRR
- 5+ blog post shares

## 🐛 Known Issues to Monitor

1. **Gemini API Rate Limits**: Free tier = 15 req/min. May need to implement queue.
2. **Exchange Rate Caching**: 24hr cache may cause slight inaccuracies.
3. **Supabase Free Tier**: 500MB database limit. Monitor usage.

## 📞 Support Plan

- Email: support@etsyprofit.com (set up)
- Response time: < 24 hours
- FAQ page (create post-launch)
- Video tutorials (optional, post-launch)

---

**Ready to launch? Let's go! 🚀**
