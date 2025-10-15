// Script to seed sample blog posts for SEO
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsvweb';

const samplePosts = [
  {
    title: "10 Essential WordPress Web Design Tips for Birmingham Businesses",
    slug: "wordpress-web-design-tips-birmingham",
    excerpt: "Discover the top 10 WordPress web design tips that will help your Birmingham business stand out online and attract more customers.",
    content: `<h2>Why WordPress Web Design Matters for Birmingham Businesses</h2>
<p>As a Birmingham-based business, having a professional WordPress website is crucial for attracting local customers and competing in the digital marketplace. Here are 10 essential tips to make your WordPress site shine.</p>

<h3>1. Mobile-First Design</h3>
<p>Over 60% of Birmingham users browse on mobile devices. Ensure your WordPress theme is fully responsive and looks great on all screen sizes.</p>

<h3>2. Local SEO Optimization</h3>
<p>Optimize your WordPress site for Birmingham-specific keywords. Include location-based content and register with Google My Business.</p>

<h3>3. Fast Loading Speed</h3>
<p>Birmingham users expect fast websites. Use caching plugins like WP Rocket and optimize images to improve load times.</p>

<h3>4. Professional Branding</h3>
<p>Your WordPress site should reflect your Birmingham business's unique identity. Use consistent colors, fonts, and imagery.</p>

<h3>5. Clear Call-to-Actions</h3>
<p>Make it easy for Birmingham customers to contact you. Include prominent phone numbers, contact forms, and booking buttons.</p>

<h3>6. Security First</h3>
<p>Protect your WordPress site with SSL certificates, regular updates, and security plugins like Wordfence.</p>

<h3>7. User-Friendly Navigation</h3>
<p>Birmingham visitors should find what they need quickly. Keep your menu simple and organized.</p>

<h3>8. Quality Content</h3>
<p>Regularly publish blog posts about your industry and Birmingham community to improve SEO and engage visitors.</p>

<h3>9. Social Proof</h3>
<p>Display customer testimonials and reviews from Birmingham clients to build trust.</p>

<h3>10. Analytics Tracking</h3>
<p>Use Google Analytics to understand how Birmingham visitors interact with your WordPress site.</p>

<h2>Get Professional WordPress Web Design in Birmingham</h2>
<p>Need help implementing these tips? TsvWeb specializes in affordable WordPress web design for Birmingham businesses. Contact us today for a free consultation!</p>`,
    category: "Web Design",
    tags: ["WordPress", "Web Design", "Birmingham", "SEO", "Small Business"],
    author: {
      name: "TsvWeb Team",
      email: "hello@tsvweb.com"
    },
    featuredImage: "/blog/wordpress-design-tips.jpg",
    status: "Published",
    publishedAt: new Date("2025-01-15"),
    seo: {
      metaTitle: "10 WordPress Web Design Tips for Birmingham Businesses | TsvWeb",
      metaDescription: "Expert WordPress web design tips for Birmingham businesses. Learn how to create a professional, SEO-friendly WordPress website that attracts local customers.",
      keywords: ["WordPress web design Birmingham", "Birmingham web design", "WordPress tips", "small business website"]
    }
  },
  {
    title: "How Much Does a Website Cost in Birmingham? 2025 Pricing Guide",
    slug: "website-cost-birmingham-2025",
    excerpt: "Wondering how much a professional website costs in Birmingham? Our comprehensive 2025 pricing guide breaks down costs for small businesses.",
    content: `<h2>Understanding Website Costs for Birmingham Businesses</h2>
<p>If you're a Birmingham business owner looking to establish an online presence, understanding website costs is crucial for budgeting. Let's break down the typical costs in 2025.</p>

<h3>Basic Website Packages (£500 - £1,500)</h3>
<p>Perfect for small Birmingham businesses just starting out. Includes:</p>
<ul>
  <li>5-10 pages</li>
  <li>Mobile-responsive design</li>
  <li>Basic SEO setup</li>
  <li>Contact forms</li>
  <li>Social media integration</li>
</ul>

<h3>Professional Business Websites (£1,500 - £5,000)</h3>
<p>Ideal for established Birmingham businesses. Features:</p>
<ul>
  <li>Custom design</li>
  <li>10-20 pages</li>
  <li>Advanced SEO</li>
  <li>Blog functionality</li>
  <li>Google Analytics</li>
  <li>Content management system</li>
</ul>

<h3>E-commerce Websites (£3,000 - £10,000+)</h3>
<p>For Birmingham retailers selling online. Includes:</p>
<ul>
  <li>Product catalog</li>
  <li>Shopping cart</li>
  <li>Payment gateway integration</li>
  <li>Inventory management</li>
  <li>Customer accounts</li>
</ul>

<h3>Monthly Maintenance (£30 - £200/month)</h3>
<p>Ongoing costs for Birmingham businesses:</p>
<ul>
  <li>Hosting</li>
  <li>Security updates</li>
  <li>Backups</li>
  <li>Content updates</li>
  <li>Technical support</li>
</ul>

<h2>TsvWeb's Affordable Pricing for Birmingham</h2>
<p>At TsvWeb, we offer professional websites from just £30/month, making quality web design accessible to all Birmingham businesses. No large upfront costs!</p>`,
    category: "Business",
    tags: ["Pricing", "Birmingham", "Web Design", "Small Business", "Budget"],
    author: {
      name: "TsvWeb Team",
      email: "hello@tsvweb.com"
    },
    featuredImage: "/blog/website-pricing.jpg",
    status: "Published",
    publishedAt: new Date("2025-01-10"),
    seo: {
      metaTitle: "Website Cost Birmingham 2025 | Affordable Web Design Pricing",
      metaDescription: "How much does a website cost in Birmingham? Complete 2025 pricing guide for small businesses. Professional websites from £30/month with TsvWeb.",
      keywords: ["website cost Birmingham", "web design pricing", "affordable websites", "Birmingham web design"]
    }
  },
  {
    title: "Local SEO for Birmingham Businesses: Complete 2025 Guide",
    slug: "local-seo-birmingham-guide-2025",
    excerpt: "Master local SEO to rank #1 on Google for Birmingham searches. Our complete guide shows you exactly how to dominate local search results.",
    content: `<h2>Why Local SEO Matters for Birmingham Businesses</h2>
<p>76% of Birmingham customers search online before visiting a business. If you're not ranking on Google's first page for local searches, you're losing customers to competitors.</p>

<h3>Google My Business Optimization</h3>
<p>Your Google My Business profile is crucial for Birmingham local SEO:</p>
<ul>
  <li>Complete all business information</li>
  <li>Add Birmingham-specific keywords</li>
  <li>Upload high-quality photos</li>
  <li>Collect and respond to reviews</li>
  <li>Post regular updates</li>
</ul>

<h3>Birmingham-Specific Keywords</h3>
<p>Target location-based keywords like:</p>
<ul>
  <li>"web design Birmingham"</li>
  <li>"Birmingham web developer"</li>
  <li>"[your service] near me"</li>
  <li>"[your service] in Birmingham"</li>
</ul>

<h3>Local Citations</h3>
<p>List your Birmingham business on:</p>
<ul>
  <li>Yell.com</li>
  <li>Thomson Local</li>
  <li>Bing Places</li>
  <li>Apple Maps</li>
  <li>Industry-specific directories</li>
</ul>

<h3>Customer Reviews</h3>
<p>Reviews are ranking factors for Birmingham local SEO:</p>
<ul>
  <li>Ask satisfied customers for reviews</li>
  <li>Respond to all reviews (positive and negative)</li>
  <li>Make it easy with review links</li>
</ul>

<h3>Local Content</h3>
<p>Create Birmingham-focused content:</p>
<ul>
  <li>Blog about Birmingham events</li>
  <li>Feature local case studies</li>
  <li>Mention Birmingham neighborhoods</li>
  <li>Partner with local businesses</li>
</ul>

<h2>Get Expert Local SEO Help in Birmingham</h2>
<p>TsvWeb specializes in local SEO for Birmingham businesses. We've helped 500+ local companies rank #1 on Google. Contact us for a free SEO audit!</p>`,
    category: "SEO",
    tags: ["SEO", "Local SEO", "Birmingham", "Google", "Marketing"],
    author: {
      name: "TsvWeb Team",
      email: "hello@tsvweb.com"
    },
    featuredImage: "/blog/local-seo-birmingham.jpg",
    status: "Published",
    publishedAt: new Date("2025-01-05"),
    seo: {
      metaTitle: "Local SEO Birmingham 2025 | Rank #1 on Google | TsvWeb",
      metaDescription: "Complete local SEO guide for Birmingham businesses. Learn how to dominate Google search results and attract more local customers in 2025.",
      keywords: ["local SEO Birmingham", "Birmingham SEO", "Google My Business", "local search optimization"]
    }
  }
];

async function seedBlogPosts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('blogposts');
    
    // Check if posts already exist
    const existingCount = await collection.countDocuments({ status: 'Published' });
    
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing published posts`);
      console.log('Do you want to add sample posts anyway? (This will create duplicates)');
      console.log('Run with --force flag to add anyway');
      
      if (!process.argv.includes('--force')) {
        console.log('Skipping seed. Use --force to add sample posts anyway.');
        return;
      }
    }
    
    // Insert sample posts
    const result = await collection.insertMany(samplePosts);
    console.log(`✅ Successfully inserted ${result.insertedCount} blog posts`);
    
    // Display inserted posts
    console.log('\n📝 Inserted Posts:');
    samplePosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   URL: https://tsvweb.com/blog/${post.slug}`);
    });
    
    console.log('\n🎉 Blog seeding complete!');
    console.log('Visit https://tsvweb.com/blog to see your posts');
    
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
  } finally {
    await client.close();
  }
}

seedBlogPosts();
