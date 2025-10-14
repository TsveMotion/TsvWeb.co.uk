# Dark Mode Fix Script for Trade Pages

## Pages to Fix:
1. ✅ Plumbers (partially done)
2. ⏳ Electricians
3. ⏳ Builders
4. ⏳ Cleaning
5. ⏳ Removals

## Common Dark Mode Classes Needed:

### Sections
- `bg-white` → `bg-white dark:bg-gray-900`
- `bg-blue-50` → `bg-blue-50 dark:bg-gray-800`
- `bg-gradient-to-br from-blue-50 to-white` → add `dark:from-gray-800 dark:to-gray-900`

### Text
- `text-gray-900` → `text-gray-900 dark:text-white`
- `text-gray-700` → `text-gray-700 dark:text-gray-300`
- `text-gray-600` → `text-gray-600 dark:text-gray-400`

### Cards
- `bg-white` → `bg-white dark:bg-gray-800` or `dark:bg-gray-900`
- `bg-blue-50` → `bg-blue-50 dark:bg-gray-800`

### Forms
- `bg-gray-50` → `bg-gray-50 dark:bg-gray-700`
- `bg-white` → `bg-white dark:bg-gray-800`
- `text-gray-900` → `text-gray-900 dark:text-white`
- `border-gray-300` → `border-gray-300 dark:border-gray-600`

### Borders
- `border-gray-300` → `border-gray-300 dark:border-gray-600`
- Keep `border-[#007BFF]` as is (works in both modes)

## Status:
- Plumbers: 60% complete
- Others: 0% complete
