# Remaining Dark Mode Tasks

## ✅ COMPLETED:
1. Homepage - 100% Dark Mode
2. Services Page - 100% Dark Mode
3. Barbers Page - 100% Dark Mode
4. Plumbers Page - 100% Dark Mode
5. Electricians Page - 100% Dark Mode
6. Builders Page - 100% Dark Mode
7. Cleaning Page - 100% Dark Mode
8. Removals Page - 100% Dark Mode
9. Privacy Policy - 100% Dark Mode
10. Terms of Service - 100% Dark Mode + Redesigned

## 🔄 REMAINING:

### 1. Restaurants Page (`/restaurants`)
Apply same dark mode pattern as other trade pages:
- Hero: `dark:from-gray-800 dark:to-gray-900`
- Sections: `dark:bg-gray-900` / `dark:bg-gray-800`
- Text: `dark:text-white`, `dark:text-gray-300`, `dark:text-gray-400`
- Cards: `dark:bg-gray-800` / `dark:bg-gray-900`
- Forms: `dark:bg-gray-700`, `dark:text-white`
- Borders: `dark:border-gray-600`

### 2. Admin Login Page (`/admin/login`)
**Issues:**
- Logo not visible in dark mode (needs white version)
- No theme toggle

**Fixes Needed:**
- Add conditional logo rendering (white logo for dark mode)
- Add theme toggle slider component
- File: `src/app/admin/login/page.tsx`

### 3. Customer Login Page (`/customer/login`)
**Issues:**
- No theme toggle

**Fixes Needed:**
- Add theme toggle slider component
- File: `src/app/customer/login/page.tsx`

## Pattern for Theme Toggle:
```tsx
import { useTheme } from 'next-themes'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="..."
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

## Logo Fix Pattern:
```tsx
{theme === 'dark' ? (
  <Image src="/TsvWeb_Logo_White.png" alt="TsvWeb" />
) : (
  <Image src="/TsvWeb_Logo.png" alt="TsvWeb" />
)}
```
