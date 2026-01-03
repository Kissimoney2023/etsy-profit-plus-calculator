# Vercel Deployment Notes

## ⚠️ IMPORTANT: Blog Images

The blog images are located in `public/blog-images/` and **must be committed to Git** for Vercel deployment.

### Current Blog Images:
- `etsy-fees-breakdown.png`
- `profit-margin-comparison.png`
- `offsite-ads-strategy.png`
- `pricing-strategy-guide.png`
- `break-even-calculator.png`

### Before Deploying to Vercel:

1. **Commit the images to Git:**
```bash
git add public/blog-images/*.png
git commit -m "Add blog SEO images"
git push
```

2. **Verify images are in the repo:**
```bash
git ls-files public/blog-images/
```

### If Build Fails on Vercel:

**Error:** "Command vite build exited with 1"

**Cause:** Blog images are missing from the deployment

**Fix:**
1. Check if `public/blog-images/` is in `.gitignore` (it shouldn't be)
2. Ensure images are committed to Git
3. Redeploy

### Alternative: Use CDN for Images

If you prefer not to commit images to Git, you can:

1. Upload images to a CDN (Cloudinary, Imgur, etc.)
2. Update `src/lib/blog-data.ts` with CDN URLs:
```typescript
image: "https://your-cdn.com/etsy-fees-breakdown.png"
```

### Vercel Build Command:
```bash
npm run build
```

This should work if images are present in `public/blog-images/`.
