# Deploy to Vercel

## 1. Import Project
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Select **Import** next to `etsy-profit-plus-calculator`.

## 2. Configure Project
- **Framework Preset**: Vercel should automatically detect `Vite`.
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)

## 3. Environment Variables
You MUST add the following environment variables for the app to work:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://xilodhrkemxjpgpnvgxt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_J8TRRU61fMziWwJeaeU1mA_2BMUvTjl` |

## 4. Deploy
1. Click **Deploy**.
2. Wait for the build to finish.
3. Your app will be live!
