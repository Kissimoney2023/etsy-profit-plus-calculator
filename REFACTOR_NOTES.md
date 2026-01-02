# Refactor & Restructure Notes

## Overview
The application was found to have a mixed file structure containing both Next.js and Vite configuration/files. This caused confusion and potential build errors. The project has been refactored to a clean **Vite + React + TypeScript** Single Page Application (SPA).

## Changes Made

### 1. Directory Structure
- Created a `src/` directory to house all source code.
- Moved `pages/`, `components/`, `lib/`, `types/`, `App.tsx`, `index.tsx` into `src/`.
- Updated imports to reflect the new structure.

### 2. Configuration & Dependencies
- **Cleaned `package.json`**: Removed Next.js dependencies (`next`, `@next/mdx`, `remark-gfm`, etc.) which are not needed for a Vite app.
- **Added Tailwind CSS**: Installed `tailwindcss`, `postcss`, and `autoprefixer` properly. Configured `tailwind.config.js` and `postcss.config.js`.
- **Updated `vite.config.ts`**: Updated alias `@` to point to `./src` instead of root.
- **Updated `tsconfig.json`**: Updated paths to align with the new alias location.

### 3. Entry Point
- **Updated `index.html`**: Removed the CDN script for Tailwind (replaced with proper build pipeline) and removed the `importmap`. Pointed the module script to `/src/index.tsx`.
- **Updated `src/index.tsx`**: Added import for `index.css` to ensure global styles and Tailwind classes are loaded.

## How to Run
1. **Install Dependencies**: `npm install` (Already done)
2. **Start Dev Server**: `npm run dev`
3. **Build for Production**: `npm run build`

## Notes
- The `api/` and `app/` directories which contained Next.js server-side code were renamed to `_legacy_api` and `_legacy_app`. You can safely delete them if you do not plan to migrate that specific server-side logic to a backend.
- The application now runs on `http://localhost:3000`.
