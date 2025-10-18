const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

const CustomerSchema = new mongoose.Schema({
  username: String,
  email: String,
  name: String,
  phone: String,
  address: String,
  city: String,
  postcode: String,
  country: String,
  password: String,
  role: { type: String, default: 'customer' },
  googleId: String,
  googleEmail: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Customer = mongoose.model('Customer', CustomerSchema);
  
  console.log('=== CREATING TEST CUSTOMERS ===\n');
  
  // Check if customers already exist
  const existing = await Customer.countDocuments();
  if (existing > 0) {
    console.log(`✓ ${existing} customers already exist in database`);
    const customers = await Customer.find({}).select('_id username email name');
    customers.forEach((c, i) => {
      console.log(`${i + 1}. ${c.name || c.username} (${c.email})`);
    });
    mongoose.disconnect();
    return;
  }
  
  // Create test customers
  const testCustomers = [
    {
      username: 'johndoe',
      email: 'john@example.com',
      name: 'John Doe',
      phone: '+44 123 456 7890',
      address: '123 Main Street',
      city: 'Birmingham',
      postcode: 'B1 1AA',
      country: 'United Kingdom',
      password: await bcrypt.hash('password123', 10),
      role: 'customer'
    },
    {
      username: 'janesmith',
      email: 'jane@example.com',
      name: 'Jane Smith',
      phone: '+44 987 654 3210',
      address: '456 High Street',
      city: 'Birmingham',
      postcode: 'B2 2BB',
      country: 'United Kingdom',
      password: await bcrypt.hash('password123', 10),
      role: 'customer'
    },
    {
      username: 'bobwilson',
      email: 'bob@example.com',
      name: 'Bob Wilson',
      phone: '+44 555 123 4567',
      address: '789 Park Lane',
      city: 'Birmingham',
      postcode: 'B3 3CC',
      country: 'United Kingdom',
      password: await bcrypt.hash('password123', 10),
      role: 'customer'
    }
  ];
  
  await Customer.insertMany(testCustomers);
  
  console.log(`✓ Created ${testCustomers.length} test customers:\n`);
  testCustomers.forEach((customer, index) => {
    console.log(`${index + 1}. ${customer.name} (${customer.email})`);
    console.log(`   Username: ${customer.username}`);
    console.log(`   Password: password123`);
    console.log('');
  });
  
  console.log('✅ Test customers created successfully!');
  console.log('\nYou can now:');
  console.log('1. Refresh the WordPress sites page');
  console.log('2. Click "Bind" on any site');
  console.log('3. Select a customer from the dropdown');
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
