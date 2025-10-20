const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Paths
const pluginDir = path.join(__dirname, '..', 'wordpress-plugin', 'tsvweb');
const publicDir = path.join(__dirname, '..', 'public', 'wordpress-plugin');
const outputPath = path.join(publicDir, 'tsvweb.zip');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a file to stream archive data to
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('✅ TsvWeb Plugin zip created successfully!');
  console.log(`📦 Size: ${(archive.pointer() / 1024).toFixed(2)} KB`);
  console.log(`📍 Location: ${outputPath}`);
  console.log(`🌐 Download URL: http://localhost:3000/wordpress-plugin/tsvweb.zip`);
  console.log('\n📋 INSTALLATION INSTRUCTIONS:');
  console.log('1. Go to WordPress Admin → Plugins');
  console.log('2. Deactivate old "TsvWeb" plugin if exists');
  console.log('3. Delete old plugin');
  console.log('4. Click "Add New" → "Upload Plugin"');
  console.log('5. Select tsvweb.zip');
  console.log('6. Click "Install Now" → "Activate"');
  console.log('\n✨ NEW FEATURES:');
  console.log('✅ Product Optimizer built-in');
  console.log('✅ REST API endpoints for remote control');
  console.log('✅ OpenAI key sent from TsvWeb server (no wp-config.php needed!)');
  console.log('✅ Enable/disable from Next.js dashboard');
  console.log('\n🔗 REST ENDPOINTS:');
  console.log('GET  /wp-json/tsvweb/v1/optimizer/status');
  console.log('POST /wp-json/tsvweb/v1/optimizer/toggle');
  console.log('GET  /wp-json/tsvweb/v1/optimizer/stats');
  console.log('POST /wp-json/tsvweb/v1/optimizer/openai-key');
});

// Handle errors
archive.on('error', function(err) {
  console.error('❌ Error creating zip:', err);
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files to the archive
console.log('📦 Creating TsvWeb plugin zip...');
console.log('📁 Including: Monitor + AI Product Optimizer');
archive.directory(pluginDir, 'tsvweb');

// Finalize the archive
archive.finalize();
