# Announcements Pages - Complete Upgrade Plan

## ✅ **SIDEBAR DARK MODE - ALREADY WORKING!**

The sidebar in `src/components/admin/admin-layout.tsx` already has full dark mode support:
- Dark background gradients: `from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950`
- Dark borders: `border-gray-700`
- Text colors: `text-white`, `text-gray-300`, `text-gray-400`
- Hover states: `hover:bg-gray-800`
- Active states: `bg-blue-600`

**No changes needed for sidebar!**

---

## 📋 **ANNOUNCEMENTS PAGES TO CREATE:**

### 1. **List Page** (`/admin/announcements/page.tsx`)
**Current**: Basic list with filter
**New Design**:
- Stats cards (Total, Active, Scheduled, Archived)
- Search & filter bar
- Modern table with:
  - Title & message preview
  - Type badge (Info, Warning, Success, Error)
  - Priority badge (Low, Medium, High)
  - Status badge (Active, Scheduled, Archived)
  - Start/End dates
  - Action buttons (Edit, Delete, Toggle)
- Empty state with icon
- Gradient buttons
- Full dark mode

### 2. **Create Page** (`/admin/announcements/new/page.tsx`)
**Features**:
- Modern card layout
- Form fields:
  - Title *
  - Message * (textarea, HTML supported)
  - Type (dropdown: Info, Warning, Success, Error)
  - Priority (dropdown: Low, Medium, High)
  - Status (dropdown: Active, Scheduled, Archived)
  - Start Date (datetime-local)
  - End Date (datetime-local)
  - Target Audience (optional)
- Preview mode
- Color-coded type badges
- Save button with loading state
- Back button
- Full dark mode

### 3. **Edit Page** (`/admin/announcements/[id]/page.tsx`)
**Features**:
- Same as create page
- Loads existing data
- Update button instead of create
- Delete button
- Full dark mode

---

## 🎨 **Design Specifications:**

### **Color Scheme:**
- **Info**: Blue (`bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`)
- **Warning**: Yellow (`bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`)
- **Success**: Green (`bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`)
- **Error**: Red (`bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`)

### **Priority Colors:**
- **Low**: Gray
- **Medium**: Orange
- **High**: Red

### **Stats Cards:**
1. **Total** - Orange gradient (`from-orange-500 to-orange-600`)
2. **Active** - Green gradient (`from-green-500 to-green-600`)
3. **Scheduled** - Blue gradient (`from-blue-500 to-blue-600`)
4. **Archived** - Gray gradient (`from-gray-500 to-gray-600`)

---

## 📝 **Data Structure:**

```typescript
interface Announcement {
  _id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'scheduled' | 'archived'
  startDate: string
  endDate?: string
  targetAudience?: string
  createdAt: string
  updatedAt: string
}
```

---

## 🚀 **Implementation Steps:**

1. **Backup old page**:
   ```bash
   ren src\app\admin\announcements\page.tsx page-old.tsx.bak
   ```

2. **Create new list page** with:
   - Stats cards
   - Filters
   - Modern table
   - Dark mode classes

3. **Create new/page.tsx** with:
   - Card-based form
   - Preview mode
   - Type/Priority dropdowns
   - Date pickers
   - Dark mode

4. **Create [id]/page.tsx** with:
   - Data loading
   - Same form as create
   - Update functionality
   - Dark mode

---

## ✨ **Key Features:**

### **List Page:**
- ✅ Stats dashboard
- ✅ Search by title/message
- ✅ Filter by type, priority, status
- ✅ Sort by date
- ✅ Bulk actions
- ✅ Toggle active/inactive
- ✅ Delete with confirmation
- ✅ Responsive table
- ✅ Dark mode

### **Create/Edit Pages:**
- ✅ Modern card layout
- ✅ Preview mode
- ✅ HTML message support
- ✅ Date/time pickers
- ✅ Type & priority badges
- ✅ Validation
- ✅ Loading states
- ✅ Error handling
- ✅ Dark mode

---

## 🌓 **Dark Mode Classes:**

### **Backgrounds:**
- Cards: `bg-white dark:bg-gray-800`
- Page: `bg-gray-50 dark:bg-gray-900`
- Inputs: `bg-white dark:bg-gray-700`
- Hover: `hover:bg-gray-50 dark:hover:bg-gray-700`

### **Text:**
- Primary: `text-gray-900 dark:text-white`
- Secondary: `text-gray-600 dark:text-gray-400`
- Muted: `text-gray-500 dark:text-gray-500`

### **Borders:**
- Default: `border-gray-200 dark:border-gray-700`
- Input: `border-gray-300 dark:border-gray-600`

### **Buttons:**
- Primary: `bg-gradient-to-r from-orange-600 to-orange-700`
- Secondary: `border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300`

---

## 📊 **Stats Calculations:**

```typescript
const stats = {
  total: announcements.length,
  active: announcements.filter(a => a.status === 'active').length,
  scheduled: announcements.filter(a => a.status === 'scheduled').length,
  archived: announcements.filter(a => a.status === 'archived').length
}
```

---

## 🔧 **API Endpoints:**

- `GET /api/admin/announcements` - List all
- `POST /api/admin/announcements` - Create new
- `GET /api/admin/announcements/[id]` - Get one
- `PUT /api/admin/announcements/[id]` - Update
- `DELETE /api/admin/announcements/[id]` - Delete

---

## ✅ **Testing Checklist:**

- [ ] List page loads with stats
- [ ] Search works
- [ ] Filters work
- [ ] Create announcement
- [ ] Edit announcement
- [ ] Delete announcement
- [ ] Toggle status
- [ ] Preview mode works
- [ ] Dark mode on all pages
- [ ] Sidebar dark mode
- [ ] Responsive on mobile
- [ ] Date pickers work
- [ ] Type badges show correct colors
- [ ] Priority badges show correct colors
- [ ] HTML in message renders correctly

---

**Status**: Ready to implement  
**Priority**: High  
**Estimated Time**: 30 minutes  
**Dependencies**: None (sidebar already has dark mode)

**Next**: Create the three new pages with modern design!
