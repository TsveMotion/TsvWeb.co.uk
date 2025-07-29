"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'

// Mock blog data
const BLOG_POSTS = [
  {
    id: '1',
    title: 'How to Choose the Right Web Design Company for Your Business',
    slug: 'how-to-choose-web-design-company',
    excerpt: 'Finding the perfect web design partner is crucial for your business success. Learn the key factors to consider when selecting a web design agency.',
    content: `
# How to Choose the Right Web Design Company for Your Business

Selecting the right web design company is a crucial decision for your business. Your website is often the first impression potential customers have of your brand, and a well-designed site can significantly impact your success.

## Consider Your Specific Needs

Before beginning your search, clearly define what you need:

- A simple informational website
- An e-commerce platform
- A complex web application
- Rebranding of an existing site

Understanding your requirements will help you find a company with the right expertise.

## Look at Their Portfolio

A company's portfolio reveals their design style, technical capabilities, and industry experience. Look for:

- Projects similar to what you need
- Variety in design approaches
- Attention to detail
- Mobile responsiveness

## Check Reviews and Testimonials

Client feedback provides valuable insights into a company's reliability, communication, and ability to deliver results. Look beyond the testimonials on their website—check Google reviews, social media, and platforms like Clutch.

## Evaluate Their Process

A professional web design company should have a clear, structured process that includes:

1. Discovery and planning
2. Design concepts
3. Development
4. Testing
5. Launch
6. Post-launch support

Ask potential companies to walk you through their typical project workflow.

## Consider Communication Style

Effective communication is essential for a successful web design project. During initial interactions, assess:

- Responsiveness to inquiries
- Clarity in explaining technical concepts
- Willingness to understand your business goals
- Transparency about timelines and costs

## Assess Technical Expertise

Modern websites require various technical skills. Ensure the company has expertise in:

- Responsive design
- SEO best practices
- Content management systems
- Performance optimization
- Security measures

## Compare Pricing Structures

Web design pricing can vary significantly. Look for companies that offer:

- Transparent pricing
- Detailed proposals
- Value for your investment
- No hidden costs

Remember that the cheapest option isn't always the best value.

## Conclusion

Taking the time to thoroughly research and evaluate potential web design partners will pay dividends in the long run. The right company will not only create an attractive website but will also ensure it effectively supports your business goals.
    `,
    category: 'Web Design',
    tags: ['web design', 'business', 'website development'],
    featuredImage: '/images/blog/web-design-company.jpg',
    author: 'John Smith',
    date: '2023-06-15',
    readTime: '5 min read',
    status: 'published'
  },
  {
    id: '2',
    title: 'The Impact of Website Speed on SEO and User Experience',
    slug: 'website-speed-seo-user-experience',
    excerpt: 'Website speed affects both search engine rankings and user satisfaction. Discover how to optimize your site for better performance.',
    content: 'Full content here...',
    category: 'SEO',
    tags: ['website speed', 'SEO', 'user experience', 'performance'],
    featuredImage: '/images/blog/website-speed.jpg',
    author: 'Jane Doe',
    date: '2023-05-28',
    readTime: '4 min read',
    status: 'published'
  },
  {
    id: '3',
    title: 'Responsive Web Design: Why It Matters More Than Ever',
    slug: 'responsive-web-design-importance',
    excerpt: 'With mobile traffic dominating the internet, responsive design is no longer optional. Learn why it matters and how to implement it effectively.',
    content: 'Full content here...',
    category: 'Web Design',
    tags: ['responsive design', 'mobile-friendly', 'web development'],
    featuredImage: '/images/blog/responsive-design.jpg',
    author: 'Mark Johnson',
    date: '2023-05-10',
    readTime: '6 min read',
    status: 'published'
  },
  {
    id: '4',
    title: '10 Essential Elements Every Business Website Should Have',
    slug: '10-essential-business-website-elements',
    excerpt: 'Is your business website missing critical elements? Discover the 10 must-have components that drive conversions and improve user experience.',
    content: 'Full content here...',
    category: 'Business',
    tags: ['business website', 'web design', 'conversion optimization'],
    featuredImage: '/images/blog/business-website-elements.jpg',
    author: 'Sarah Williams',
    date: '2023-04-22',
    readTime: '7 min read',
    status: 'published'
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call to fetch post data
    const fetchPost = () => {
      setLoading(true);
      setTimeout(() => {
        const foundPost = BLOG_POSTS.find(p => p.slug === slug);
        setPost(foundPost || null);
        
        // Find related posts (same category)
        if (foundPost) {
          const related = BLOG_POSTS
            .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/blog"
            className="px-6 py-3 bg-royal-blue text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title={`${post.title} | TsvWeb Blog`}
        description={post.excerpt}
        canonical={`https://tsvweb.com/blog/${post.slug}`}
        openGraph={{
          title: post.title,
          description: post.excerpt,
          type: 'article',
          images: [
            {
              url: `https://tsvweb.com${post.featuredImage}`,
              width: 1200,
              height: 630,
              alt: post.title,
            }
          ]
        }}
        structuredData={{
          type: 'BlogPosting',
          data: {
            headline: post.title,
            image: `https://tsvweb.com${post.featuredImage}`,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              '@type': 'Person',
              name: post.author
            },
            publisher: {
              '@type': 'Organization',
              name: 'TsvWeb',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tsvweb.com/images/logo.png'
              }
            },
            description: post.excerpt,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://tsvweb.com/blog/${post.slug}`
            }
          }
        }}
      />
      <Navbar />
      
      {/* Blog Post Header */}
      <section className="pt-32 pb-8 md:pt-40 md:pb-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Link href="/blog" className="hover:text-royal-blue transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span>{post.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>
            
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
              <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Image */}
      <section className="py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video w-full mb-8 overflow-hidden rounded-lg">
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Featured Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Content */}
      <section className="py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-royal-blue max-w-none">
              {/* Render markdown content */}
              {post.content.split('\n').map((line: string, index: number) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold mt-5 mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6 mb-1">{line.substring(2)}</li>;
                } else if (line.match(/^\d+\./)) {
                  return <li key={index} className="ml-6 mb-1">{line.substring(line.indexOf('.') + 1)}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="mb-4">{line}</p>;
                }
              })}
            </div>
            
            {/* Tags */}
            <div className="mt-12 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Share */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-8">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Share this post:</span>
                <div className="flex gap-4">
                  <button className="text-gray-600 dark:text-gray-400 hover:text-royal-blue transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </button>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-royal-blue transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </button>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-royal-blue transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Posts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                      {/* Placeholder for image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">Featured Image</span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        <Link href={`/blog/${relatedPost.slug}`} className="hover:text-royal-blue transition-colors">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                        <span>{relatedPost.date}</span>
                        <span>•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="inline-flex items-center text-royal-blue hover:text-blue-700 font-medium text-sm"
                      >
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  )
}
