/**
 * Test IndexNow Integration
 * 
 * This script tests your IndexNow setup
 * Run: node scripts/test-indexnow.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env.local file not found');
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return envVars;
}

const env = loadEnvFile();

// Configuration
const SITE_URL = env.SITE_URL || process.env.SITE_URL || 'https://tsvweb.com';
const INDEXNOW_KEY = env.INDEXNOW_KEY || process.env.INDEXNOW_KEY || '';

console.log('\n🧪 Testing IndexNow Integration\n');
console.log('━'.repeat(70));

// Test 1: Check if key is configured
console.log('\n1️⃣  Checking environment configuration...');
if (!INDEXNOW_KEY) {
  console.log('   \x1b[31m✗\x1b[0m INDEXNOW_KEY not found in environment');
  console.log('   Please set INDEXNOW_KEY in your .env.local file');
  process.exit(1);
} else {
  console.log('   \x1b[32m✓\x1b[0m INDEXNOW_KEY is configured');
  console.log(`   Key: ${INDEXNOW_KEY.substring(0, 8)}...${INDEXNOW_KEY.substring(INDEXNOW_KEY.length - 8)}`);
}

if (!SITE_URL) {
  console.log('   \x1b[31m✗\x1b[0m SITE_URL not found in environment');
  console.log('   Please set SITE_URL in your .env.local file');
  process.exit(1);
} else {
  console.log('   \x1b[32m✓\x1b[0m SITE_URL is configured');
  console.log(`   URL: ${SITE_URL}`);
}

// Test 2: Check if key file is accessible
console.log('\n2️⃣  Checking key file accessibility...');
const keyFileUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
console.log(`   Testing: ${keyFileUrl}`);

const protocol = SITE_URL.startsWith('https') ? https : http;

protocol.get(keyFileUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      if (data.trim() === INDEXNOW_KEY) {
        console.log('   \x1b[32m✓\x1b[0m Key file is accessible and contains correct key');
        testApiEndpoint();
      } else {
        console.log('   \x1b[31m✗\x1b[0m Key file found but contains wrong key');
        console.log(`   Expected: ${INDEXNOW_KEY}`);
        console.log(`   Got: ${data.trim()}`);
        process.exit(1);
      }
    } else {
      console.log(`   \x1b[31m✗\x1b[0m Key file not accessible (HTTP ${res.statusCode})`);
      console.log('   Make sure your application is running and the key file exists');
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.log('   \x1b[31m✗\x1b[0m Error accessing key file:', err.message);
  console.log('   Make sure your application is running');
  process.exit(1);
});

// Test 3: Check API endpoint
function testApiEndpoint() {
  console.log('\n3️⃣  Checking API endpoint...');
  const apiUrl = `${SITE_URL}/api/indexnow`;
  console.log(`   Testing: ${apiUrl}`);
  
  protocol.get(apiUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        if (data.trim() === INDEXNOW_KEY) {
          console.log('   \x1b[32m✓\x1b[0m API endpoint is working correctly');
          testSubmission();
        } else {
          console.log('   \x1b[31m✗\x1b[0m API endpoint returned wrong key');
          process.exit(1);
        }
      } else {
        console.log(`   \x1b[31m✗\x1b[0m API endpoint not accessible (HTTP ${res.statusCode})`);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.log('   \x1b[31m✗\x1b[0m Error accessing API endpoint:', err.message);
    process.exit(1);
  });
}

// Test 4: Test URL submission (optional)
function testSubmission() {
  console.log('\n4️⃣  Testing URL submission (optional)...');
  console.log('   Submitting test URL to IndexNow API...');
  
  const testUrl = `${SITE_URL}/`;
  const postData = JSON.stringify({
    url: testUrl
  });
  
  const url = new URL(`${SITE_URL}/api/indexnow`);
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = protocol.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('   \x1b[32m✓\x1b[0m URL submission successful');
          console.log(`   Response: ${response.message}`);
          printSummary(true);
        } else {
          console.log('   \x1b[33m⚠\x1b[0m URL submission returned error');
          console.log(`   Error: ${response.message}`);
          printSummary(false);
        }
      } catch (err) {
        console.log('   \x1b[31m✗\x1b[0m Could not parse response');
        printSummary(false);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('   \x1b[31m✗\x1b[0m Error submitting URL:', err.message);
    printSummary(false);
  });
  
  req.write(postData);
  req.end();
}

function printSummary(submissionWorked) {
  console.log('\n━'.repeat(70));
  console.log('\n📊 Test Summary\n');
  console.log('   \x1b[32m✓\x1b[0m Environment configured');
  console.log('   \x1b[32m✓\x1b[0m Key file accessible');
  console.log('   \x1b[32m✓\x1b[0m API endpoint working');
  if (submissionWorked) {
    console.log('   \x1b[32m✓\x1b[0m URL submission working');
  } else {
    console.log('   \x1b[33m⚠\x1b[0m URL submission needs verification');
  }
  console.log('\n✅ IndexNow integration is ready!\n');
  console.log('━'.repeat(70));
  console.log('\n📝 Next Steps:\n');
  console.log('   • Create or update a blog post to test automatic submission');
  console.log('   • Check console logs for submission confirmations');
  console.log('   • Monitor search engine webmaster tools for indexing');
  console.log('\n');
}
