/**
 * Generate IndexNow Key
 * 
 * This script generates a random hexadecimal key for IndexNow
 * Run: node scripts/generate-indexnow-key.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a 64-character hexadecimal key
const key = crypto.randomBytes(32).toString('hex');

console.log('\n🔑 IndexNow Key Generated!\n');
console.log('━'.repeat(70));
console.log('\nYour IndexNow Key:');
console.log('\x1b[32m%s\x1b[0m', key);
console.log('\n━'.repeat(70));

console.log('\n📝 Next Steps:\n');
console.log('1. Add this to your .env.local file:');
console.log('\x1b[33m%s\x1b[0m', `   INDEXNOW_KEY=${key}`);
console.log('\n2. Restart your application');
console.log('\n3. Verify the key file is accessible at:');
console.log(`   https://tsvweb.com/${key}.txt`);
console.log('\n━'.repeat(70));

// Optionally save to a file
const outputPath = path.join(__dirname, '..', 'indexnow-key.txt');
try {
  fs.writeFileSync(outputPath, key, 'utf-8');
  console.log('\n✅ Key saved to: indexnow-key.txt');
  console.log('   (You can delete this file after adding to .env.local)');
} catch (error) {
  console.log('\n⚠️  Could not save key to file, but you can copy it from above');
}

console.log('\n');
