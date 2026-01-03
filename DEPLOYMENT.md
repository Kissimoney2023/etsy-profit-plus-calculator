# Deployment Guide

## Prerequisites
Before deploying, ensure you have:
- [ ] Supabase project created
- [ ] Vercel account
- [ ] Stripe account with products created
- [ ] Gemini API key

## 1. Supabase Setup

### Database Tables
Your database should have these tables (already created via migrations):
- `profiles` (user data, plan info)
- `products` (saved calculations)

### Environment Secrets
Set these in Supabase Dashboard → Project Settings → Edge Functions:

```bash
npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### Deploy Edge Functions
```bash
npx supabase functions deploy optimize-listing
npx supabase functions deploy stripe-checkout
npx supabase functions deploy stripe-webhook
```

### Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret and set it in Supabase secrets

## 2. Vercel Deployment

### Environment Variables
Set these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PRICE_STARTER=price_xxxxx  # Stripe Price ID for Starter plan
VITE_STRIPE_PRICE_PRO=price_xxxxx      # Stripe Price ID for Pro plan
```

**IMPORTANT:** Use Stripe **Price IDs** (start with `price_`), NOT Product IDs (start with `prod_`).

### Deploy
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 3. Stripe Product Setup

### Create Products
1. Go to Stripe Dashboard → Products
2. Create two products:
   - **Starter Plan**: $9/month recurring
   - **Pro Plan**: $19/month recurring
3. Copy the **Price IDs** (not Product IDs) for each

### Test Mode vs Live Mode
- Use test mode Price IDs during development
- Switch to live mode Price IDs for production
- Update Vercel environment variables accordingly

## 4. Post-Deployment Verification

### Test Checklist
- [ ] User signup/login works
- [ ] Calculator saves products to Supabase
- [ ] Dashboard displays saved products
- [ ] Blog pages load with SEO meta tags
- [ ] Pricing page redirects to Stripe checkout
- [ ] Pro features show upgrade wall for free users
- [ ] Stripe webhook updates user plan after payment
- [ ] AI Optimizer works for Pro users (requires GEMINI_API_KEY)

### Common Issues

**Issue:** Stripe checkout fails with "Invalid Price ID"
- **Fix:** Ensure you're using Price IDs (`price_xxx`), not Product IDs (`prod_xxx`)

**Issue:** AI Optimizer returns 500 error
- **Fix:** Verify `GEMINI_API_KEY` is set in Supabase secrets

**Issue:** Webhook not updating user plan
- **Fix:** Check Stripe webhook endpoint is correct and signing secret matches

**Issue:** Build fails on Vercel
- **Fix:** Ensure all environment variables are set in Vercel dashboard

## 5. Monitoring

### Supabase Logs
- View Edge Function logs in Supabase Dashboard → Edge Functions → Logs
- Monitor database queries in Database → Query Performance

### Stripe Dashboard
- Monitor subscriptions in Stripe Dashboard → Subscriptions
- Check webhook delivery in Developers → Webhooks → Events

### Vercel Analytics
- Enable Vercel Analytics for traffic insights
- Monitor build logs in Vercel Dashboard → Deployments

## 6. Backup Strategy

### Database Backups
- Supabase automatically backs up your database daily (7-day retention on free tier)
- For Pro tier: Enable PITR (Point-in-Time Recovery) for up to 30 days
- Manual backup: `npx supabase db dump > backup.sql`

### Code Backups
- Keep your GitHub repository up to date
- Tag releases for easy rollback

## 7. Scaling Considerations

### Free Tier Limits
- Supabase: 500MB database, 2GB bandwidth/month
- Vercel: 100GB bandwidth/month
- Stripe: No limits on free plan

### When to Upgrade
- Supabase Pro ($25/mo): When you exceed 500MB or need PITR
- Vercel Pro ($20/mo): When you exceed 100GB bandwidth
- Consider upgrading when you have 100+ active users

## Support
For issues, check:
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs
- Vercel docs: https://vercel.com/docs
