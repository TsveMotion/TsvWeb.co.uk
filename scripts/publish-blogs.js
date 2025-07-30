// Blog Publishing Script for TsvWeb
// This script helps convert markdown blog posts to database entries

const fs = require('fs');
const path = require('path');

// Blog post data for database insertion
const blogPosts = [
  {
    title: "Website Development Birmingham: 2025 Trends That Will Transform Your Business",
    slug: "website-development-birmingham-2025-trends",
    excerpt: "Discover the latest website development trends specifically impacting Birmingham businesses and how to stay competitive in the West Midlands market. From AI personalization to sustainable web development.",
    content: fs.readFileSync(path.join(__dirname, '../blog-content/birmingham-web-development-trends-2025.md'), 'utf8'),
    coverImage: "/images/blog/birmingham-web-development-trends-2025.jpg",
    author: "TsvWeb Team",
    status: "published",
    tags: ["Birmingham Web Development", "Web Design Trends", "Local SEO", "Business Growth", "West Midlands"],
    publishedAt: new Date("2025-01-30"),
    seoTitle: "Website Development Birmingham: 2025 Trends for Local Businesses",
    seoDescription: "Discover the latest website development trends specifically impacting Birmingham businesses and how to stay competitive in the West Midlands market.",
    seoKeywords: "Birmingham web development, website development Birmingham, web design trends 2025, Birmingham business, West Midlands web development"
  },
  {
    title: "Birmingham SEO: The Complete Guide to Dominating Local Search Results in 2025",
    slug: "birmingham-seo-guide-local-business",
    excerpt: "Learn proven SEO strategies that help Birmingham businesses rank higher in local search results and attract more customers from the West Midlands region.",
    content: fs.readFileSync(path.join(__dirname, '../blog-content/birmingham-seo-guide-local-business.md'), 'utf8'),
    coverImage: "/images/blog/birmingham-seo-guide-2025.jpg",
    author: "TsvWeb SEO Team",
    status: "published",
    tags: ["Birmingham SEO", "Local SEO", "Search Engine Optimization", "Digital Marketing", "Local Business"],
    publishedAt: new Date("2025-01-30"),
    seoTitle: "Birmingham SEO Guide: Dominate Local Search Results 2025",
    seoDescription: "Complete Birmingham SEO guide with proven strategies to help local businesses rank higher in search results and attract more West Midlands customers.",
    seoKeywords: "Birmingham SEO, local SEO Birmingham, SEO services Birmingham, Birmingham search optimization, West Midlands SEO"
  },
  {
    title: "Mobile-First Design: Why Birmingham Businesses Can't Afford to Ignore Mobile Users in 2025",
    slug: "mobile-first-design-birmingham-business",
    excerpt: "Why Birmingham businesses need mobile-optimized websites and how responsive design impacts local customer engagement and conversions in the mobile-first era.",
    content: fs.readFileSync(path.join(__dirname, '../blog-content/mobile-first-design-birmingham-business.md'), 'utf8'),
    coverImage: "/images/blog/mobile-first-design-birmingham.jpg",
    author: "TsvWeb Design Team",
    status: "published",
    tags: ["Mobile Design", "Responsive Web Design", "User Experience", "Birmingham Business", "Mobile Optimization"],
    publishedAt: new Date("2025-01-30"),
    seoTitle: "Mobile-First Design for Birmingham Businesses | Essential 2025 Guide",
    seoDescription: "Why Birmingham businesses need mobile-optimized websites and how responsive design impacts local customer engagement and conversions.",
    seoKeywords: "mobile-first design Birmingham, responsive web design, mobile optimization Birmingham, Birmingham web design, mobile user experience"
  }
];

// Function to create blog posts in database
async function publishBlogPosts() {
  try {
    console.log('🚀 Starting blog post publication...');
    
    for (const post of blogPosts) {
      console.log(`📝 Publishing: ${post.title}`);
      
      // Make API call to create blog post
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Successfully published: ${post.slug}`);
      } else {
        console.error(`❌ Failed to publish: ${post.slug}`);
      }
    }
    
    console.log('🎉 Blog post publication complete!');
    
  } catch (error) {
    console.error('❌ Error publishing blog posts:', error);
  }
}

// Export for use in other scripts
module.exports = {
  blogPosts,
  publishBlogPosts
};

// Run if called directly
if (require.main === module) {
  publishBlogPosts();
}
