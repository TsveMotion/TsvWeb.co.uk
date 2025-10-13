"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import { BlogService } from '@/services/blog-service'
import { BlogPost } from '@/types/blog'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch published posts
        const postsData = await BlogService.getPublishedPosts();
        setAllPosts(postsData);
        setPosts(postsData);
        
        // Fetch categories
        const categoriesData = await BlogService.getCategories();
        setCategories(categoriesData);
        
        // Fetch tags
        const tagsData = await BlogService.getTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add 'All' category when categories and posts are loaded
  useEffect(() => {
    if (categories.length > 0 && allPosts.length > 0) {
      const publishedPostCount = allPosts.filter(post => post.status === 'Published').length;
      
      // Check if 'All' category already exists
      if (!categories.some(cat => cat.name === 'All')) {
        setCategories(prev => [
          { name: 'All', count: publishedPostCount },
          ...prev
        ]);
      }
    }
  }, [categories, allPosts]);

  // Filter posts by category
  useEffect(() => {
    // Filter posts by selected category
    if (selectedCategory === 'All') {
      setPosts(allPosts.filter(post => post.status === 'Published'));
    } else {
      setPosts(allPosts.filter(post => post.category === selectedCategory && post.status === 'Published'));
    }
  }, [selectedCategory, allPosts]);

  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title="WordPress Web Design Birmingham Blog | WordPress Developer Tips & Small Business Web Design"
        description="WordPress web design Birmingham blog by our expert WordPress developer. Learn about affordable WordPress websites, custom WordPress development, small business web design, and SEO-friendly WordPress design tips for Birmingham businesses."
        canonical="https://tsvweb.com/blog"
        structuredData={{
          type: 'WebSite',
          data: {
            name: 'TsvWeb Blog',
            url: 'https://tsvweb.com/blog',
            description: 'Web design and development insights from TsvWeb',
            publisher: {
              '@type': 'Organization',
              name: 'TsvWeb',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tsvweb.com/images/logo.png'
              }
            }
          }
        }}
      />
      <Navbar />
      
      {/* Blog Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-1 text-gray-900 dark:text-white mb-6">
              WordPress Web Design <span className="text-royal-blue">Birmingham Blog</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              WordPress developer insights, tips, and strategies to help Birmingham businesses succeed online with affordable WordPress web design.
              Stay updated with the latest trends in WordPress development, custom WordPress websites, and small business web design.
            </p>
          </div>
        </div>
      </section>
      
      {/* Blog Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main content */}
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Latest WordPress Web Design Birmingham Articles</h2>
              
              {/* Category filter */}
              <div className="mb-8 overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedCategory === 'All'
                        ? 'bg-royal-blue text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {categories
                    .filter(cat => cat.name !== 'All')
                    .map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                          selectedCategory === category.name
                            ? 'bg-royal-blue text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                </div>
              </div>
              
              {/* Loading state */}
              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div className="ml-2 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {posts.length > 0 ? (
                    posts.map((post: BlogPost) => (
                      <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        {post.featuredImage && (
                          <div className="relative h-48 w-full">
                            <Image 
                              src={post.featuredImage} 
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime}</span>
                            <span className="mx-2">•</span>
                            <span>{post.category}</span>
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            <Link href={`/blog/${post.slug}`} className="hover:text-royal-blue dark:hover:text-royal-blue-light">
                              {post.title}
                            </Link>
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                                {post.author.substring(0, 1)}
                              </div>
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{post.author}</span>
                            </div>
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="text-royal-blue dark:text-royal-blue-light hover:underline text-sm font-medium"
                            >
                              Read more →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 dark:text-gray-400">No posts found in this category.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="md:w-1/3">
              {/* Recent posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {allPosts
                    .filter(post => post.status === 'Published')
                    .slice(0, 3)
                    .map((post: BlogPost) => (
                      <div key={post.id} className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden relative">
                          {post.featuredImage && (
                            <Image 
                              src={post.featuredImage} 
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            <Link href={`/blog/${post.slug}`} className="hover:text-royal-blue dark:hover:text-royal-blue-light">
                              {post.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{post.date}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Popular tags */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span 
                      key={tag.name} 
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {tag.name} ({tag.count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
