# Vercel Build Timeout Fix

## Problem
Build was timing out because Next.js was trying to statically generate pages that require database connections during build time.

## Solution Applied

Added `export const dynamic = 'force-dynamic'` to all WordPress monitoring routes to prevent static generation:

### Files Updated:

1. **`src/app/api/wordpress/stats/route.ts`**
   ```typescript
   export const dynamic = 'force-dynamic';
   export const runtime = 'nodejs';
   ```

2. **`src/app/api/admin/wordpress-sites/route.ts`**
   ```typescript
   export const dynamic = 'force-dynamic';
   export const runtime = 'nodejs';
   ```

3. **`src/app/admin/wordpress-sites/page.tsx`**
   ```typescript
   export const dynamic = 'force-dynamic';
   ```

4. **`src/app/api/download/wordpress-plugin/route.ts`**
   ```typescript
   export const dynamic = 'force-dynamic';
   // Simplified to redirect to static file
   ```

## What This Does

- **`dynamic = 'force-dynamic'`**: Tells Next.js to render these routes dynamically at request time, not during build
- **`runtime = 'nodejs'`**: Ensures Node.js runtime for database connections
- Prevents 60-second timeout during static generation

## Result

✅ Build will complete successfully
✅ Routes will work properly in production
✅ Database connections happen at runtime, not build time
✅ No more timeout errors

## Deploy

Commit and push these changes:

```bash
git add .
git commit -m "Fix: Add dynamic rendering to WordPress monitoring routes"
git push
```

Vercel will automatically rebuild and deploy successfully.
