# Technical Documentation

## 1. Database Backups & Recovery
**Status:** Managed by Supabase Platform.

### Verification Steps
To ensure your data is safe, please follow these steps in your Supabase Dashboard:

1.  **Automated Backups:**
    *   Go to **Database** > **Backups**.
    *   Verify that "PITR" (Point in Time Recovery) is enabled (Pro plan) or that daily backups are listed.
    *   *Note: Free tier includes daily backups retained for 7 days.*

2.  **Schema Backup:**
    *   We recommend keeping a local copy of your schema.
    *   Run: `npx supabase db dump > schema.sql` (requires Supabase CLI login).
    *   Currently, the key tables are: `products` and `profiles`.

## 2. Error Handling (White Screen of Death Protection)
**Implementation:** Global `ErrorBoundary` component.

We have implemented a React Error Boundary (`src/components/ErrorBoundary.tsx`) that wraps the entire application.

*   **Function:** Catches unhandled JavaScript errors in the component tree.
*   **Behavior:** Instead of the app crashing to a white screen, the user sees a friendly "Oops!" UI with options to "Reload Page" or "Go Home".
*   **Logging:** Errors are currently logged to the console. In a production environment, you should integrate a service like Sentry in `componentDidCatch`.

## 3. SEO Architecture
**Implementation:** `react-helmet-async`.

*   **Component:** `src/components/SEO.tsx`
*   **Usage:** Every page (`Pricing`, `Calculator`, `Blog`, etc.) calls this component to dynamically inject `<title>` and `<meta>` tags.
*   **Dynamic generation:** The Calculator page updates its title based on the active tool (e.g., "Etsy Break-Even Calculator").

## 4. Build & Deployment
*   **Build Command:** `npm run build` (Vite)
*   **Type Checking:** `npx tsc --noEmit` (TypeScript)
*   **Gemini API:** Requires `GEMINI_API_KEY` in Supabase Edge Function secrets.
