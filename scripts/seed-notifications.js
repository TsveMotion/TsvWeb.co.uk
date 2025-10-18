const mongoose = require('mongoose');
const fs = require('fs');

// Read .env.local file manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});
process.env.MONGODB_URI = envVars.MONGODB_URI;

const notificationSchema = new mongoose.Schema({
  userId: String,
  title: String,
  message: String,
  type: String,
  link: String,
  read: Boolean,
  createdAt: Date
});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Notification = mongoose.model('Notification', notificationSchema);
  
  console.log('=== SEEDING SAMPLE NOTIFICATIONS ===\n');
  
  // Sample notifications for admin user
  const sampleNotifications = [
    {
      userId: 'kristiyan@tsvweb.com', // Change to your admin email
      title: 'New Inquiry Received',
      message: 'You have a new inquiry from John Smith about web design services.',
      type: 'info',
      link: '/admin/inquiries',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60000) // 5 minutes ago
    },
    {
      userId: 'kristiyan@tsvweb.com',
      title: 'Invoice Payment Received',
      message: 'Payment of £500 received for Invoice #INV-001.',
      type: 'success',
      link: '/admin/invoices',
      read: false,
      createdAt: new Date(Date.now() - 30 * 60000) // 30 minutes ago
    },
    {
      userId: 'kristiyan@tsvweb.com',
      title: 'Contract Expiring Soon',
      message: 'Contract #CON-123 with ABC Ltd expires in 7 days.',
      type: 'warning',
      link: '/admin/contracts',
      read: false,
      createdAt: new Date(Date.now() - 2 * 3600000) // 2 hours ago
    },
    {
      userId: 'kristiyan@tsvweb.com',
      title: 'New Blog Post Published',
      message: 'Your blog post "Web Design Tips 2025" has been published successfully.',
      type: 'success',
      link: '/admin/blog',
      read: true,
      createdAt: new Date(Date.now() - 24 * 3600000) // 1 day ago
    },
    {
      userId: 'kristiyan@tsvweb.com',
      title: 'System Update Available',
      message: 'A new system update is available. Please review the changes.',
      type: 'info',
      link: '/admin/settings',
      read: true,
      createdAt: new Date(Date.now() - 48 * 3600000) // 2 days ago
    }
  ];
  
  // Clear existing notifications for this user
  await Notification.deleteMany({ userId: 'kristiyan@tsvweb.com' });
  console.log('✓ Cleared existing notifications');
  
  // Insert sample notifications
  await Notification.insertMany(sampleNotifications);
  console.log(`✓ Added ${sampleNotifications.length} sample notifications`);
  
  const unreadCount = sampleNotifications.filter(n => !n.read).length;
  console.log(`\n=== RESULTS ===`);
  console.log(`Total notifications: ${sampleNotifications.length}`);
  console.log(`Unread: ${unreadCount}`);
  console.log(`Read: ${sampleNotifications.length - unreadCount}`);
  console.log(`\n✅ Sample notifications seeded successfully!`);
  console.log(`\nNote: Change userId to your admin email in the script if needed.`);
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
