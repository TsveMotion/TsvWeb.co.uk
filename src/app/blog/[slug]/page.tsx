import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import { BlogService } from '@/services/blog-service';
import { BlogPost } from '@/types/blog';

type Props = {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await BlogService.getPostBySlug(params.slug);
    
    if (!post || post.status !== 'Published') {
      return {
        title: 'Post Not Found | TsvWeb Blog',
        description: 'This blog post could not be found or is no longer available.',
        robots: { index: false, follow: true }
      };
    }
    
    const description = post.excerpt || post.seoDescription || post.title;
    const keywords = post.tags?.join(', ') || 'web design Birmingham, WordPress, SEO';
    
    return {
      title: `${post.title} | TsvWeb Blog`,
      description,
      keywords,
      alternates: {
        canonical: `https://tsvweb.co.uk/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description,
        url: `https://tsvweb.co.uk/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.date,
        authors: [post.author || 'TsvWeb Team'],
        tags: post.tags,
        images: [{
          url: post.featuredImage || 'https://tsvweb.co.uk/TsvWeb_Logo.png',
          width: 1200,
          height: 630,
          alt: post.title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [post.featuredImage || 'https://tsvweb.co.uk/TsvWeb_Logo.png']
      }
    };
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return {
      title: 'Blog Post | TsvWeb',
      description: 'Read our latest web design and SEO insights.',
      robots: { index: false, follow: true }
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  let post: BlogPost | null = null;
  let relatedPosts: BlogPost[] = [];
  
  try {
    post = await BlogService.getPostBySlug(params.slug);
    
    if (!post || post.status !== 'Published') {
      notFound();
    }
    
    // Fetch related posts
    if (post.category) {
      const allPosts = await BlogService.getPublishedPosts();
      relatedPosts = allPosts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
  
  if (!post) {
    notFound();
  }
  
  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://tsvweb.co.uk/blog/${post.slug}`,
    "headline": post.title,
    "description": post.excerpt || post.seoDescription,
    "image": {
      "@type": "ImageObject",
      "url": post.featuredImage || 'https://tsvweb.co.uk/TsvWeb_Logo.png',
      "width": 1200,
      "height": 630
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author || 'TsvWeb Team',
      "url": "https://tsvweb.co.uk/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TsvWeb",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tsvweb.co.uk/TsvWeb_Logo.png",
        "width": 1200,
        "height": 630
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tsvweb.co.uk/blog/${post.slug}`
    },
    "keywords": post.tags?.join(', '),
    "articleSection": post.category,
    "wordCount": post.content?.split(' ').length || 0,
    "inLanguage": "en-GB"
  };
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tsvweb.co.uk/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://tsvweb.co.uk/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://tsvweb.co.uk/blog/${post.slug}`
      }
    ]
  };

  return (
    <main className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-royal-blue via-blue-600 to-electric-blue text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-6 mb-8">
              {post.category && (
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20">
                  {post.category}
                </span>
              )}
              {post.readTime && (
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium">By {post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {post.featuredImage && (
              <div className="mb-16">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              </div>
            )}
            
            <article className="max-w-none prose prose-lg lg:prose-xl dark:prose-invert 
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
              prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-10 prose-h2:text-gray-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-3
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-800 dark:prose-h3:text-gray-100
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-em:text-gray-700 dark:prose-em:text-gray-300
              prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2 prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg prose-blockquote:italic
              prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8
              prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-12
              prose-table:border-collapse prose-table:w-full prose-table:my-8
              prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-bold
              prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-3">
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
            
            {/* Share & Tags Section */}
            <div className="mt-16 pt-12 border-t-2 border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Share */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <svg className="w-5 h-5 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share this post</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </button>
                    <button
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="px-6 py-3 bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'))}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>
                  </div>
                </div>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-5 h-5 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-royal-blue/10 to-blue-500/10 text-royal-blue dark:text-blue-400 rounded-full text-sm font-medium border border-royal-blue/20 hover:border-royal-blue/40 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* CTA Banner */}
              <div className="mt-12 p-8 bg-gradient-to-r from-royal-blue to-blue-600 rounded-2xl shadow-xl text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Need Professional Web Design?</h3>
                    <p className="text-white/90">Get 3x more leads in 30 days with our expert web design services in Birmingham</p>
                  </div>
                  <Link
                    href="/contact"
                    className="px-8 py-4 bg-white text-royal-blue rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Related Posts</h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Discover more insights and articles that might interest you
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost: BlogPost, index: number) => (
                  <Link
                    key={relatedPost.id || `related-${index}`}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    {relatedPost.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          width={500}
                          height={280}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-royal-blue/10 to-blue-500/10 text-royal-blue dark:text-blue-400 text-xs font-semibold rounded-full border border-royal-blue/20">
                          {relatedPost.category}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-royal-blue transition-colors duration-300 leading-tight">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-royal-blue/10 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">By {relatedPost.author}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  );
}
