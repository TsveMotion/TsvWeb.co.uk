# Maintenance Mode Feature - Complete Guide

## Overview
The Maintenance Mode feature allows administrators to display a blocking modal popup on websites when maintenance is being performed. This ensures users are informed about service interruptions.

## Features Implemented

### ✅ Core Functionality
- **Toggle Switch**: Easy ON/OFF control for maintenance mode
- **Scope Control**: Choose between:
  - `tsvweb` - Only affects tsvweb.co.uk
  - `all` - Affects all TSVWeb client websites
- **Custom Message**: Fully customizable maintenance message
- **Modal Popup**: Blocking modal that overlays the entire page
- **Warning Icon**: ⚠️ disclaimer icon prominently displayed

### ✅ Advanced Features
- **Scheduled Maintenance**: Set start and end times for automatic activation
- **Auto-disable**: Automatically turn off maintenance mode after a set duration (in minutes)
- **Real-time Updates**: Modal checks for status changes every 30 seconds
- **Dismissible Modal**: Users can close the modal but will see it again on page refresh if still active
- **Dark Mode Support**: Full support for light and dark themes

## File Structure

### Database Model
- **Location**: `src/models/MaintenanceMode.ts`
- **Fields**:
  - `isEnabled`: Boolean - Current status
  - `message`: String - Display message
  - `scope`: Enum - 'tsvweb' or 'all'
  - `scheduledStart`: Date - Optional scheduled start
  - `scheduledEnd`: Date - Optional scheduled end
  - `autoDisable`: Boolean - Auto-disable flag
  - `autoDisableDuration`: Number - Duration in minutes
  - `enabledAt`: Date - When it was enabled
  - `disabledAt`: Date - When it was disabled

### API Endpoints

#### Admin Endpoint
- **Location**: `src/app/api/admin/maintenance/route.ts`
- **Methods**:
  - `GET`: Fetch current maintenance mode status (admin only)
  - `POST`: Update maintenance mode settings (admin only)

#### Public Endpoint
- **Location**: `src/app/api/public/maintenance/route.ts`
- **Methods**:
  - `GET`: Check maintenance mode status (public access)
  - Returns minimal data: `isEnabled`, `message`, `scope`, `scheduledEnd`

### UI Components

#### Admin Panel
- **Location**: `src/app/admin/announcements/page.tsx`
- **Features**:
  - Large toggle switch for quick enable/disable
  - Status badge showing current state
  - Configuration form with all options
  - Real-time save status feedback
  - Warning message when active

#### Public Modal
- **Location**: `src/components/MaintenanceModal.tsx`
- **Features**:
  - Full-screen blocking overlay
  - Animated warning icon
  - Formatted message display
  - Contact information
  - Dismissible with close button
  - Auto-checks status every 30 seconds

## Usage Instructions

### For Administrators

#### Accessing Maintenance Mode
1. Navigate to: `http://localhost:3000/admin/announcements`
2. The Maintenance Mode section is at the top of the page
3. You'll see a large toggle switch and configuration options

#### Enabling Maintenance Mode
1. **Quick Enable**: Click the toggle switch (turns red when ON)
2. **Configure Settings**:
   - **Scope**: Choose "Only tsvweb.co.uk" or "All TSVWeb Client Websites"
   - **Message**: Customize the popup message (default includes ⚠️ icon)
   - **Auto-disable**: Set duration in minutes for automatic disable
   - **Schedule**: Set start/end times for planned maintenance
3. Click **"Save Settings"** to apply changes

#### Disabling Maintenance Mode
1. Click the toggle switch to turn it OFF (turns gray)
2. Or wait for auto-disable if configured
3. Or wait for scheduled end time if configured

### For Users (What They See)

When maintenance mode is active:
1. A full-screen modal appears with a dark backdrop
2. The modal displays:
   - Large warning icon (⚠️) with animation
   - "MAINTENANCE MODE" header
   - Custom message (default: "⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE")
   - Expected completion time (if scheduled)
   - Contact phone number: 07444 358808
   - "I Understand - Close This Message" button
3. Users can dismiss the modal but will see it again on page refresh
4. The modal checks for updates every 30 seconds

## Technical Details

### Database Schema
```typescript
interface IMaintenanceMode {
  isEnabled: boolean
  message: string
  scope: 'tsvweb' | 'all'
  scheduledStart?: Date
  scheduledEnd?: Date
  autoDisable: boolean
  autoDisableDuration?: number
  customMessage?: string
  createdBy: ObjectId
  enabledAt?: Date
  disabledAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### API Request/Response Examples

#### Enable Maintenance Mode
```bash
POST /api/admin/maintenance
Content-Type: application/json

{
  "isEnabled": true,
  "message": "⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE",
  "scope": "tsvweb",
  "autoDisable": true,
  "autoDisableDuration": 60
}
```

#### Check Status (Public)
```bash
GET /api/public/maintenance

Response:
{
  "success": true,
  "data": {
    "isEnabled": true,
    "message": "⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE",
    "scope": "tsvweb",
    "scheduledEnd": "2025-10-19T15:00:00Z"
  }
}
```

## Integration with Other Pages

The `MaintenanceModal` component is currently integrated into:
- Homepage (`src/app/page.tsx`)

### To Add to Other Pages
Simply import and add the component:

```tsx
import MaintenanceModal from '@/components/MaintenanceModal'

export default function YourPage() {
  return (
    <>
      <MaintenanceModal />
      {/* Your page content */}
    </>
  )
}
```

## Styling & Customization

### Colors
- **Active State**: Red gradient (from-red-600 to-orange-600)
- **Inactive State**: Gray
- **Border**: Animated pulse between red and orange
- **Background**: Semi-transparent black backdrop with blur

### Animations
- **Border Pulse**: 2s infinite animation
- **Icon Bounce**: Continuous bounce animation
- **Hover Effects**: Scale and shadow transitions

### Responsive Design
- Mobile-friendly with proper padding
- Max-width constraint for readability
- Touch-friendly buttons and controls

## Security Considerations

1. **Admin Authentication**: Only admin/editor roles can modify settings
2. **Public Read-Only**: Public endpoint only returns necessary data
3. **No Sensitive Data**: Modal doesn't expose internal system information
4. **Rate Limiting**: Consider adding rate limiting to public endpoint

## Future Enhancements (Optional)

- [ ] Email notifications to admins when maintenance mode is enabled
- [ ] Maintenance history log
- [ ] Multiple maintenance messages for different scopes
- [ ] Integration with monitoring systems
- [ ] Countdown timer in modal
- [ ] Custom styling per website
- [ ] API endpoint for WordPress plugin integration

## Testing Checklist

- [x] Admin can enable maintenance mode
- [x] Admin can disable maintenance mode
- [x] Admin can change scope (tsvweb vs all)
- [x] Admin can customize message
- [x] Admin can set auto-disable duration
- [x] Admin can schedule maintenance
- [x] Modal appears on homepage when enabled
- [x] Modal can be dismissed
- [x] Modal reappears on page refresh if still active
- [x] Modal checks for updates every 30 seconds
- [x] Dark mode works correctly
- [x] Mobile responsive design works

## Troubleshooting

### Modal Not Appearing
1. Check if maintenance mode is enabled in admin panel
2. Verify API endpoint is accessible: `GET /api/public/maintenance`
3. Check browser console for errors
4. Clear browser cache and reload

### Toggle Not Working
1. Verify admin authentication
2. Check MongoDB connection
3. Review API logs for errors
4. Ensure MaintenanceMode model is properly imported

### Styling Issues
1. Verify Tailwind CSS is configured correctly
2. Check for conflicting z-index values
3. Ensure dark mode classes are working

## Support

For issues or questions:
- **Phone**: 07444 358808
- **Admin Panel**: http://localhost:3000/admin/announcements
- **Documentation**: This file

---

**Last Updated**: October 19, 2025
**Version**: 1.0.0
**Author**: TsvWeb Development Team
