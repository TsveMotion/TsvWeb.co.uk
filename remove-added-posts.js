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

const blogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  coverImage: String,
  author: String,
  status: String,
  tags: [String],
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const BlogPost = mongoose.model('BlogPost', blogPostSchema);
  
  console.log('=== REMOVING INCORRECTLY ADDED POSTS ===\n');
  
  // Remove the 3 posts I just added
  const postsToRemove = [
    '10-essential-wordpress-web-design-tips-for-birmingham-businesses',
    'how-much-does-a-website-cost-in-birmingham-2025-pricing-guide',
    'local-seo-for-birmingham-businesses-complete-2025-guide'
  ];
  
  for (const slug of postsToRemove) {
    const result = await BlogPost.deleteOne({ slug });
    if (result.deletedCount > 0) {
      console.log(`✓ Removed: ${slug}`);
    }
  }
  
  // Show current state
  const allPosts = await BlogPost.find({ status: 'published' });
  console.log(`\n=== CURRENT PUBLISHED POSTS ===`);
  console.log(`Total: ${allPosts.length}\n`);
  
  allPosts.forEach(post => {
    console.log(`Title: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
    console.log(`Status: ${post.status}`);
    console.log(`Tags: ${post.tags?.join(', ') || 'none'}`);
    console.log('---');
  });
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
