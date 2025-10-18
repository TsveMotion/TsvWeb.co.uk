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
  
  console.log('=== CHECKING CUSTOMERS IN DATABASE ===\n');
  
  const customers = await Customer.find({})
    .select('_id username email name phone')
    .sort({ name: 1, username: 1 });
  
  console.log(`Total customers found: ${customers.length}\n`);
  
  if (customers.length === 0) {
    console.log('❌ NO CUSTOMERS IN DATABASE!');
    console.log('\nThis is why the dropdown is empty.');
    console.log('You need to create customers first.\n');
  } else {
    console.log('✅ Customers found:\n');
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name || customer.username} (${customer.email})`);
      console.log(`   ID: ${customer._id}`);
      console.log(`   Username: ${customer.username}`);
      console.log('');
    });
  }
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
