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

// Define schema
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
  
  console.log('=== FIXING BLOG POSTS FOR GOOGLE ===\n');
  
  // Check current state
  const currentCount = await BlogPost.countDocuments({ status: 'published' });
  console.log(`Current published posts: ${currentCount}`);
  
  // Update all existing posts to ensure they have proper tags
  const existingPosts = await BlogPost.find({ status: 'published' });
  
  for (const post of existingPosts) {
    if (!post.tags || post.tags.length === 0) {
      post.tags = ['Web Design', 'Birmingham', 'Business'];
      await post.save();
      console.log(`✓ Updated tags for: ${post.title}`);
    }
  }
  
  // Add 3 Birmingham-focused blog posts if they don't exist
  const birminghamPosts = [
    {
      title: '10 Essential WordPress Web Design Tips for Birmingham Businesses',
      slug: '10-essential-wordpress-web-design-tips-for-birmingham-businesses',
      excerpt: 'Discover the top 10 WordPress web design tips that Birmingham businesses are using to attract more customers and boost their online presence in 2025.',
      content: `<h2>Why WordPress Web Design Matters for Birmingham Businesses</h2>
<p>In Birmingham's competitive digital landscape, having a professionally designed WordPress website isn't just nice to have—it's essential for business growth. Here are 10 proven tips to elevate your WordPress web design.</p>

<h2>1. Mobile-First Design is Non-Negotiable</h2>
<p>Over 60% of Birmingham web users browse on mobile devices. Ensure your WordPress theme is fully responsive and loads quickly on smartphones.</p>

<h2>2. Local SEO Integration</h2>
<p>Optimize your WordPress site for "web design Birmingham" and other local keywords. Use plugins like Yoast SEO to improve your local search rankings.</p>

<h2>3. Fast Loading Speed</h2>
<p>Birmingham users expect websites to load in under 3 seconds. Use caching plugins like WP Rocket and optimize images with ShortPixel.</p>

<h2>4. Professional Color Schemes</h2>
<p>Choose colors that reflect your Birmingham brand identity. Use tools like Adobe Color to create harmonious palettes.</p>

<h2>5. Clear Call-to-Actions</h2>
<p>Every page should have a clear CTA. Whether it's "Get a Quote" or "Contact Us", make it prominent and compelling.</p>

<h2>6. Trust Signals</h2>
<p>Display customer testimonials, Birmingham business awards, and security badges to build credibility.</p>

<h2>7. Accessibility Compliance</h2>
<p>Ensure your WordPress site meets WCAG 2.1 standards. This expands your Birmingham customer base and improves SEO.</p>

<h2>8. Integration with Google Business Profile</h2>
<p>Connect your WordPress site to your Google Business Profile for better local visibility in Birmingham searches.</p>

<h2>9. Regular Updates and Maintenance</h2>
<p>Keep WordPress core, themes, and plugins updated for security and performance.</p>

<h2>10. Professional Support</h2>
<p>Partner with a Birmingham web design agency that offers ongoing support and maintenance.</p>

<h2>Ready to Transform Your WordPress Website?</h2>
<p>At TsvWeb, we specialize in creating stunning WordPress websites for Birmingham businesses. From £30/month, get a professional website that drives real results.</p>

<p><strong>Contact us today for a free consultation!</strong></p>`,
      coverImage: '/blog/wordpress-tips-birmingham.jpg',
      author: 'TsvWeb Team',
      status: 'published',
      tags: ['WordPress', 'Web Design', 'Birmingham', 'Small Business', 'Tips'],
      publishedAt: new Date('2025-01-15'),
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15')
    },
    {
      title: 'How Much Does a Website Cost in Birmingham? 2025 Pricing Guide',
      slug: 'how-much-does-a-website-cost-in-birmingham-2025-pricing-guide',
      excerpt: 'Complete breakdown of website costs in Birmingham for 2025. From budget-friendly options starting at £30/month to custom enterprise solutions.',
      content: `<h2>Understanding Website Costs in Birmingham</h2>
<p>One of the most common questions Birmingham business owners ask is: "How much does a website cost?" The answer depends on your specific needs, but this guide will help you understand the pricing landscape in 2025.</p>

<h2>Budget-Friendly Options: £30-£50/month</h2>
<p>Perfect for small Birmingham businesses and startups:</p>
<ul>
<li>WordPress website with professional theme</li>
<li>5-10 pages of content</li>
<li>Mobile-responsive design</li>
<li>Basic SEO setup</li>
<li>Contact forms and Google Maps integration</li>
<li>Hosting and maintenance included</li>
</ul>

<h2>Mid-Range Solutions: £295-£795 One-Time</h2>
<p>Ideal for established Birmingham businesses:</p>
<ul>
<li>Custom WordPress design</li>
<li>10-20 pages</li>
<li>E-commerce functionality (WooCommerce)</li>
<li>Advanced SEO optimization</li>
<li>Blog setup</li>
<li>Social media integration</li>
<li>3 months support included</li>
</ul>

<h2>Premium Custom Solutions: £1,500-£5,000+</h2>
<p>For Birmingham businesses needing advanced features:</p>
<ul>
<li>Fully custom design and development</li>
<li>Complex functionality (booking systems, member areas)</li>
<li>Custom integrations (CRM, payment gateways)</li>
<li>Advanced e-commerce with multiple payment options</li>
<li>Comprehensive SEO strategy</li>
<li>12 months support and maintenance</li>
</ul>

<h2>Hidden Costs to Consider</h2>
<p>Beyond the initial website cost, Birmingham businesses should budget for:</p>
<ul>
<li><strong>Domain name:</strong> £10-£15/year</li>
<li><strong>Hosting:</strong> £5-£50/month (if not included)</li>
<li><strong>SSL certificate:</strong> Free-£100/year</li>
<li><strong>Maintenance:</strong> £50-£200/month</li>
<li><strong>Content updates:</strong> £30-£100/hour</li>
<li><strong>SEO services:</strong> £200-£1,000/month</li>
</ul>

<h2>TsvWeb's Transparent Pricing</h2>
<p>At TsvWeb, we believe in transparent pricing for Birmingham businesses:</p>
<ul>
<li><strong>WordPress Website:</strong> From £30/month (no upfront costs)</li>
<li><strong>E-commerce Site:</strong> From £50/month</li>
<li><strong>Custom Development:</strong> Contact us for a free quote</li>
</ul>

<h2>Get Your Free Quote Today</h2>
<p>Every Birmingham business is unique. Contact TsvWeb for a personalized quote based on your specific needs and budget.</p>`,
      coverImage: '/blog/website-cost-birmingham.jpg',
      author: 'TsvWeb Team',
      status: 'published',
      tags: ['Pricing', 'Birmingham', 'Business', 'Web Design', 'Cost'],
      publishedAt: new Date('2025-01-10'),
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10')
    },
    {
      title: 'Local SEO for Birmingham Businesses: Complete 2025 Guide',
      slug: 'local-seo-for-birmingham-businesses-complete-2025-guide',
      excerpt: 'Master local SEO in Birmingham with this comprehensive guide. Learn how to rank #1 on Google for local searches and attract more customers.',
      content: `<h2>Why Local SEO Matters for Birmingham Businesses</h2>
<p>Local SEO is the key to getting found by Birmingham customers searching for your services. With 46% of all Google searches having local intent, optimizing for local search is crucial for business growth.</p>

<h2>1. Optimize Your Google Business Profile</h2>
<p>Your Google Business Profile is the foundation of local SEO in Birmingham:</p>
<ul>
<li>Complete every section with accurate information</li>
<li>Add high-quality photos of your Birmingham location</li>
<li>Collect and respond to customer reviews</li>
<li>Post regular updates and offers</li>
<li>Use relevant Birmingham-specific keywords</li>
</ul>

<h2>2. Birmingham-Focused Keyword Research</h2>
<p>Target keywords that Birmingham customers actually search for:</p>
<ul>
<li>"web design Birmingham"</li>
<li>"Birmingham web developer"</li>
<li>"website design near me"</li>
<li>"affordable web design Birmingham"</li>
<li>"local SEO services Birmingham"</li>
</ul>

<h2>3. Create Location-Specific Content</h2>
<p>Publish blog posts and pages targeting Birmingham neighborhoods:</p>
<ul>
<li>Web design services in Edgbaston</li>
<li>SEO for Sutton Coldfield businesses</li>
<li>Digital marketing in Kings Heath</li>
</ul>

<h2>4. Build Local Citations</h2>
<p>List your Birmingham business on:</p>
<ul>
<li>Yell.com</li>
<li>Thomson Local</li>
<li>Birmingham Chamber of Commerce</li>
<li>Local business directories</li>
<li>Industry-specific directories</li>
</ul>

<h2>5. Get Birmingham Business Reviews</h2>
<p>Reviews are crucial for local SEO rankings:</p>
<ul>
<li>Ask satisfied Birmingham customers for reviews</li>
<li>Respond to all reviews (positive and negative)</li>
<li>Make it easy with direct review links</li>
<li>Aim for 50+ reviews in the first year</li>
</ul>

<h2>6. Mobile Optimization</h2>
<p>Most Birmingham local searches happen on mobile:</p>
<ul>
<li>Ensure fast loading speeds (under 3 seconds)</li>
<li>Use responsive design</li>
<li>Make phone numbers clickable</li>
<li>Simplify navigation for mobile users</li>
</ul>

<h2>7. Local Link Building</h2>
<p>Build relationships with other Birmingham businesses:</p>
<ul>
<li>Sponsor local events</li>
<li>Partner with complementary businesses</li>
<li>Get featured in Birmingham news sites</li>
<li>Join Birmingham business associations</li>
</ul>

<h2>8. Schema Markup for Local SEO</h2>
<p>Implement LocalBusiness schema to help Google understand your Birmingham location:</p>
<ul>
<li>Business name and address</li>
<li>Phone number</li>
<li>Opening hours</li>
<li>Service areas</li>
<li>Customer reviews</li>
</ul>

<h2>TsvWeb's Local SEO Services</h2>
<p>We specialize in helping Birmingham businesses rank #1 on Google. Our local SEO services include:</p>
<ul>
<li>Google Business Profile optimization</li>
<li>Local keyword research and targeting</li>
<li>Citation building</li>
<li>Review management</li>
<li>Local content creation</li>
<li>Monthly reporting and optimization</li>
</ul>

<h2>Start Ranking Higher Today</h2>
<p>Ready to dominate local search in Birmingham? Contact TsvWeb for a free SEO audit and personalized strategy.</p>`,
      coverImage: '/blog/local-seo-birmingham.jpg',
      author: 'TsvWeb Team',
      status: 'published',
      tags: ['SEO', 'Local SEO', 'Birmingham', 'Marketing', 'Google'],
      publishedAt: new Date('2025-01-05'),
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05')
    }
  ];
  
  let addedCount = 0;
  
  for (const postData of birminghamPosts) {
    const exists = await BlogPost.findOne({ slug: postData.slug });
    
    if (!exists) {
      const post = new BlogPost(postData);
      await post.save();
      console.log(`✓ Added: ${postData.title}`);
      addedCount++;
    } else {
      // Update existing post to ensure it has proper data
      exists.tags = postData.tags;
      exists.status = 'published';
      exists.publishedAt = postData.publishedAt;
      await exists.save();
      console.log(`✓ Updated: ${postData.title}`);
    }
  }
  
  const finalCount = await BlogPost.countDocuments({ status: 'published' });
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Total published posts: ${finalCount}`);
  console.log(`New posts added: ${addedCount}`);
  console.log(`\n✅ Blog page is now ready for Google indexing!`);
  console.log(`\nNext steps:`);
  console.log(`1. Visit https://tsvweb.com/blog to verify posts appear`);
  console.log(`2. Request indexing in Google Search Console`);
  console.log(`3. Submit updated sitemap`);
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
