// Quick script to check and optionally fix maintenance mode status
// Run with: node scripts/check-maintenance-status.js

const mongoose = require('mongoose');

// You'll need to set your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';

const MaintenanceModeSchema = new mongoose.Schema({
  isEnabled: Boolean,
  message: String,
  scope: String,
  scheduledStart: Date,
  scheduledEnd: Date,
  enabledAt: Date,
  disabledAt: Date,
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

const MaintenanceMode = mongoose.model('MaintenanceMode', MaintenanceModeSchema);

async function checkMaintenanceStatus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to database');

    const maintenanceMode = await MaintenanceMode.findOne({}).sort({ updatedAt: -1 });

    if (!maintenanceMode) {
      console.log('ℹ No maintenance mode record found in database');
      return;
    }

    console.log('\n📊 Current Maintenance Mode Status:');
    console.log('=====================================');
    console.log(`isEnabled: ${maintenanceMode.isEnabled}`);
    console.log(`message: ${maintenanceMode.message}`);
    console.log(`scope: ${maintenanceMode.scope}`);
    console.log(`scheduledStart: ${maintenanceMode.scheduledStart || 'Not set'}`);
    console.log(`scheduledEnd: ${maintenanceMode.scheduledEnd || 'Not set'}`);
    console.log(`enabledAt: ${maintenanceMode.enabledAt || 'Not set'}`);
    console.log(`disabledAt: ${maintenanceMode.disabledAt || 'Not set'}`);
    console.log(`updatedAt: ${maintenanceMode.updatedAt}`);

    // Check if maintenance should be disabled
    if (maintenanceMode.isEnabled) {
      const now = new Date();
      let shouldBeDisabled = false;
      let reason = '';

      // Check scheduled end time
      if (maintenanceMode.scheduledEnd && now > maintenanceMode.scheduledEnd) {
        shouldBeDisabled = true;
        reason = 'Scheduled end time has passed';
      }
      // Check if enabled for more than 24 hours without schedule
      else if (!maintenanceMode.scheduledStart && !maintenanceMode.scheduledEnd && maintenanceMode.enabledAt) {
        const hoursSinceEnabled = (now.getTime() - maintenanceMode.enabledAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceEnabled > 24) {
          shouldBeDisabled = true;
          reason = `Enabled for ${hoursSinceEnabled.toFixed(1)} hours without schedule (>24h limit)`;
        }
      }

      if (shouldBeDisabled) {
        console.log(`\n⚠️  WARNING: Maintenance mode should be disabled!`);
        console.log(`Reason: ${reason}`);
        console.log('\nTo fix this, run: node scripts/check-maintenance-status.js --fix');
      } else {
        console.log('\n✓ Maintenance mode is correctly enabled');
      }
    } else {
      console.log('\n✓ Maintenance mode is disabled');
    }

    // Auto-fix if --fix flag is provided
    if (process.argv.includes('--fix') && maintenanceMode.isEnabled) {
      console.log('\n🔧 Disabling maintenance mode...');
      maintenanceMode.isEnabled = false;
      maintenanceMode.disabledAt = new Date();
      await maintenanceMode.save();
      console.log('✓ Maintenance mode has been disabled');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from database');
  }
}

checkMaintenanceStatus();
