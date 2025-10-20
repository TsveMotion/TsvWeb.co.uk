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
  console.log(`🌐 Download URL: https://tsvweb.co.uk/wordpress-plugin/tsvweb.zip`);
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
