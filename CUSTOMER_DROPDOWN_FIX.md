# Customer Dropdown Fix - RESOLVED

## Problem
Customer dropdown in "Bind to Customer" modal was showing "-- Select a customer --" but no actual customers were loading.

## Root Cause
**Database Collection Mismatch:**
- `/admin/users` API uses MongoDB client → `users` collection
- `/admin/customers` API was using Mongoose → `Customer` model (different collection)
- They were looking at **different database collections**!

## Solution
Updated `/api/admin/customers/route.ts` to:
1. Use same MongoDB client as `/admin/users`
2. Query same `users` collection
3. Return users in expected format for dropdown

## Changes Made

### Before (WRONG):
```typescript
// Used Mongoose with Customer model
const Customer = mongoose.model('Customer', CustomerSchema);
const customers = await Customer.find({})
```

### After (CORRECT):
```typescript
// Use same MongoDB client as /admin/users
const client = await clientPromise;
const db = client.db();
const users = await db.collection('users').find({})
```

## File Modified
- `src/app/api/admin/customers/route.ts`

## How to Test

1. **Refresh WordPress sites page:**
   ```
   http://localhost:3000/admin/wordpress-sites
   ```

2. **Click "Bind" on any site**

3. **Dropdown should now show:**
   - ktsvets001@gmail.com
   - MuscleMatrix
   - SwissTimeDeals
   - (All users from /admin/users)

## Why This Happened
The system has TWO different database access patterns:
1. **MongoDB Client** (`clientPromise`) - Used by `/admin/users`
2. **Mongoose** (`connectToDatabase`) - Used by some other APIs

The customers API was created with Mongoose, but it needed to use MongoDB Client to access the same `users` collection.

## Verification

**Check users exist:**
```bash
# Visit admin users page
http://localhost:3000/admin/users
```

**Check customers API:**
```bash
# Should return same users
http://localhost:3000/api/admin/customers
```

**Test binding:**
1. Go to WordPress sites
2. Click "Bind" button
3. Dropdown shows all users
4. Select user
5. Click "Bind Customer"
6. ✅ Site bound successfully!

---

**Status:** ✅ FIXED
**Dropdown:** ✅ Now shows all users
**Binding:** ✅ Working correctly
