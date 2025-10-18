# WordPress Admin Creator - Standalone Solution

## Problem
The WordPress plugin REST API endpoint doesn't work if the plugin isn't installed or activated.

## Solution
Use a standalone PHP script that can create admin users directly, without needing the plugin.

---

## Setup Instructions

### Step 1: Upload the Script

Upload `wordpress-create-admin.php` to the WordPress root directory:
```
/home/patel123/htdocs/patel.tsvweb.com/wordpress-create-admin.php
```

### Step 2: Set Up Cron Job in CloudPanel

1. Go to CloudPanel → Sites → patel.tsvweb.com
2. Click "Cron Jobs" tab
3. Click "New Cron Job"
4. Set it to run "On Demand" (not scheduled)
5. Command:
```bash
/usr/bin/php8.3 /home/patel123/htdocs/patel.tsvweb.com/wordpress-create-admin.php --email="$EMAIL" --username="$USERNAME" --password="$PASSWORD"
```

### Step 3: Trigger from TsvWeb Dashboard

Update the backend to trigger the cron job via CloudPanel API or SSH.

---

## Usage Methods

### Method 1: Via Cron Job (Recommended)

**In CloudPanel:**
```bash
/usr/bin/php8.3 /home/patel123/htdocs/patel.tsvweb.com/wordpress-create-admin.php --email="admin@example.com" --username="admin" --password="securepass"
```

**Via SSH:**
```bash
ssh patel123@31.49.117.217
cd /home/patel123/htdocs/patel.tsvweb.com
php wordpress-create-admin.php --email="admin@example.com" --username="admin" --password="securepass"
```

### Method 2: Via URL (Less Secure)

**IMPORTANT**: Change the security key in the script first!

```php
define('ADMIN_CREATOR_KEY', 'your-unique-secret-key-here');
```

Then access:
```
https://patel.tsvweb.com/wordpress-create-admin.php?email=admin@example.com&username=admin&password=securepass&key=your-unique-secret-key-here
```

**DELETE THE SCRIPT AFTER USE!**

### Method 3: Via Backend API (Best)

Update the TsvWeb backend to execute the script via SSH:

```typescript
// In create-admin/route.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Execute via SSH
const command = `ssh patel123@31.49.117.217 "cd /home/patel123/htdocs/patel.tsvweb.com && php wordpress-create-admin.php --email='${email}' --username='${username}' --password='${password}'"`;

const { stdout, stderr } = await execAsync(command);
const result = JSON.parse(stdout);
```

---

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Administrator created successfully",
  "user_id": 123,
  "username": "admin",
  "email": "admin@example.com"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Username already exists",
  "username": "admin"
}
```

---

## Security Considerations

### For URL Method:
1. ✅ Change `ADMIN_CREATOR_KEY` to a unique value
2. ✅ Use HTTPS only
3. ✅ Delete the script after creating admin
4. ✅ Check server logs for unauthorized access

### For Cron/SSH Method:
1. ✅ Secure SSH keys
2. ✅ Restrict file permissions: `chmod 600 wordpress-create-admin.php`
3. ✅ Use environment variables for credentials
4. ✅ Log all admin creation attempts

---

## CloudPanel Cron Job Setup

### Create On-Demand Cron Job

1. **Template**: Custom
2. **Schedule**: On Demand (don't set a schedule)
3. **Command**:
```bash
/usr/bin/php8.3 /home/patel123/htdocs/patel.tsvweb.com/wordpress-create-admin.php --email="$EMAIL" --username="$USERNAME" --password="$PASSWORD"
```

### Trigger from Backend

Use CloudPanel API or SSH to trigger the cron job when needed.

---

## Alternative: Direct Database Method

If you have database access, you can create admin users directly:

```php
<?php
// Direct database method (use with caution)
require_once(__DIR__ . '/wp-load.php');

global $wpdb;

$username = 'admin';
$password = 'securepass';
$email = 'admin@example.com';

// Hash password
$hashed_password = wp_hash_password($password);

// Insert user
$wpdb->insert(
    $wpdb->users,
    [
        'user_login' => $username,
        'user_pass' => $hashed_password,
        'user_email' => $email,
        'user_registered' => current_time('mysql'),
        'user_status' => 0,
        'display_name' => $username
    ]
);

$user_id = $wpdb->insert_id;

// Set as administrator
$wpdb->insert(
    $wpdb->usermeta,
    [
        'user_id' => $user_id,
        'meta_key' => $wpdb->prefix . 'capabilities',
        'meta_value' => serialize(['administrator' => true])
    ]
);

$wpdb->insert(
    $wpdb->usermeta,
    [
        'user_id' => $user_id,
        'meta_key' => $wpdb->prefix . 'user_level',
        'meta_value' => 10
    ]
);

echo "Admin created: ID $user_id\n";
?>
```

---

## Recommended Approach

**For Production:**

1. Upload `wordpress-create-admin.php` to each WordPress site
2. Set up SSH access from TsvWeb server to WordPress servers
3. Update backend to execute script via SSH
4. Keep script on server (secured with proper permissions)
5. Log all admin creation attempts

**For Quick Fix:**

1. Upload script to WordPress root
2. Change security key
3. Access via URL to create admin
4. Delete script immediately

---

## Testing

### Test via CLI:
```bash
php wordpress-create-admin.php --email="test@example.com" --username="testadmin" --password="testpass123"
```

### Test via URL:
```
https://patel.tsvweb.com/wordpress-create-admin.php?email=test@example.com&username=testadmin&password=testpass123&key=tsvweb-secure-key-2025
```

### Expected Output:
```json
{
    "success": true,
    "message": "Administrator created successfully",
    "user_id": 123,
    "username": "testadmin",
    "email": "test@example.com"
}
```

---

## Troubleshooting

### Script doesn't work:
- Check PHP version: `php -v`
- Check file permissions: `ls -la wordpress-create-admin.php`
- Check WordPress is loaded: `wp-load.php` exists
- Check error logs: `/var/log/php-error.log`

### User creation fails:
- Check if username/email already exists
- Check WordPress database connection
- Check user role capabilities
- Review WordPress error logs

### SSH connection fails:
- Verify SSH credentials
- Check firewall rules
- Test SSH manually: `ssh patel123@31.49.117.217`
- Check SSH key permissions

---

## Files

- `wordpress-create-admin.php` - Standalone admin creator script
- Upload to WordPress root directory
- Works with or without TsvWeb Monitor plugin

---

**Status**: ✅ Ready to use  
**Security**: 🔒 Requires key or SSH access  
**Compatibility**: ✅ Works on any WordPress site
