const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Paths
const pluginDir = path.join(__dirname, '..', 'wordpress-plugin', 'tsvweb-product-optimizer');
const publicDir = path.join(__dirname, '..', 'public', 'wordpress-plugin');
const outputPath = path.join(publicDir, 'tsvweb-product-optimizer.zip');

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
  console.log('✅ TsvWeb Product Optimizer Plugin zip created successfully!');
  console.log(`📦 Size: ${(archive.pointer() / 1024).toFixed(2)} KB`);
  console.log(`📍 Location: ${outputPath}`);
  console.log(`🌐 Download URL: http://localhost:3000/wordpress-plugin/tsvweb-product-optimizer.zip`);
  console.log('\n📋 INSTALLATION INSTRUCTIONS:');
  console.log('1. Go to WordPress Admin → Plugins → Add New → Upload Plugin');
  console.log('2. Select the tsvweb-product-optimizer.zip file');
  console.log('3. Click "Install Now"');
  console.log('4. Click "Activate"');
  console.log('5. Go to WooCommerce → Product Optimizer');
  console.log('6. You should now have access! (no permission error)');
  console.log('\n🔑 IMPORTANT: Add OpenAI API key to wp-config.php:');
  console.log("define('OPENAI_API_KEY', 'sk-your-key-here');");
});

// Good practice to catch warnings
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

// Good practice to catch errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append files from the plugin directory
console.log('📦 Packaging TsvWeb Product Optimizer Plugin...');
archive.directory(pluginDir, 'tsvweb-product-optimizer');

// Finalize the archive
archive.finalize();
