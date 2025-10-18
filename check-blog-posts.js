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

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const BlogPost = mongoose.model('BlogPost', new mongoose.Schema({}, { strict: false }));
  
  const count = await BlogPost.countDocuments();
  const published = await BlogPost.countDocuments({ status: 'published' });
  const posts = await BlogPost.find({ status: 'published' }).limit(5);
  
  console.log('=== BLOG POST CHECK ===');
  console.log('Total posts:', count);
  console.log('Published posts:', published);
  console.log('\nSample published posts:');
  posts.forEach(p => {
    console.log(`- ${p.title}`);
    console.log(`  Status: ${p.status}`);
    console.log(`  Slug: ${p.slug}`);
    console.log(`  Tags: ${p.tags?.join(', ') || 'none'}`);
    console.log('');
  });
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
