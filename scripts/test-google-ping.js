/**
 * Test Google Sitemap Ping
 * 
 * This script tests the Google sitemap ping functionality
 * Run: node scripts/test-google-ping.js
 */

const https = require('https');

const SITE_URL = 'https://tsvweb.com';
const sitemapUrl = `${SITE_URL}/sitemap.xml`;
const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

console.log('\n🧪 Testing Google Sitemap Ping\n');
console.log('━'.repeat(70));
console.log('\n📍 Sitemap URL:', sitemapUrl);
console.log('📍 Google Ping URL:', googlePingUrl);
console.log('\n📤 Sending ping to Google...\n');

https.get(googlePingUrl, (res) => {
  console.log('Response Status:', res.statusCode);
  console.log('Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:', data || '(empty)');
    
    if (res.statusCode === 200) {
      console.log('\n✅ Google sitemap ping successful!');
      console.log('\nGoogle has been notified to re-crawl your sitemap.');
      console.log('Check Google Search Console in 24-48 hours for results.');
    } else {
      console.log(`\n⚠️  Unexpected status code: ${res.statusCode}`);
    }
    
    console.log('\n' + '━'.repeat(70) + '\n');
  });
}).on('error', (err) => {
  console.error('\n❌ Error:', err.message);
  console.log('\n' + '━'.repeat(70) + '\n');
});
