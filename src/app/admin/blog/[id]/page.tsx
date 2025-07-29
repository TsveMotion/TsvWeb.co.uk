"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogService } from '@/services/blog-service'
import { BlogPost, BlogGenerationResponse } from '@/types/blog'
import AIBlogGenerator from '@/components/admin/blog/ai-blog-generator'
import MarkdownPreview from '@/components/admin/blog/markdown-preview'

// Using the shared BlogPost type from types/blog.ts

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNewPost = params.id === 'new'
  const postId = isNewPost ? 'new' : params.id
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [post, setPost] = useState<BlogPost>({
    id: postId,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'Draft' as 'Draft' | 'Published',
    category: '',
    tags: [],
    featuredImage: '',
    author: 'Admin',
    date: new Date().toISOString(),
    readTime: '5 min read',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  })
  
  const [activeTab, setActiveTab] = useState('content')
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (isNewPost) {
      setIsLoading(false)
      return
    }

    const fetchPost = async () => {
      try {
        const fetchedPost = await BlogService.getPostById(params.id)
        if (fetchedPost) {
          setPost(fetchedPost)
        } else {
          // Handle post not found
          console.error('Post not found')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [isNewPost, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPost(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateSlug = () => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    setPost(prev => ({ ...prev, slug }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!post.title.trim()) newErrors.title = 'Title is required'
    if (!post.slug.trim()) newErrors.slug = 'Slug is required'
    if (!post.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    if (!post.content.trim()) newErrors.content = 'Content is required'
    if (!post.category.trim()) newErrors.category = 'Category is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setActiveTab('content') // Switch to content tab if there are errors there
      return
    }
    
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Update status if saving as draft
      const postToSave = {
        ...post,
        status: (saveAsDraft ? 'Draft' : 'Published') as 'Draft' | 'Published'
      }
      
      let savedPost: BlogPost | null
      
      if (isNewPost) {
        savedPost = await BlogService.createPost(postToSave)
      } else {
        savedPost = await BlogService.updatePost(String(post.id), postToSave)
      }
      
      if (savedPost) {
        setSaveMessage(saveAsDraft ? 'Draft saved successfully!' : 'Post published successfully!')
        
        // Redirect to blog list after successful save
        setTimeout(() => {
          router.push('/admin/blog')
        }, 1500)
      } else {
        setSaveMessage('Error saving post. Please try again.')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      setSaveMessage('Error saving post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle AI-generated blog content
  const handleBlogGenerated = (generatedBlog: BlogGenerationResponse) => {
    setPost(prev => ({
      ...prev,
      title: generatedBlog.title,
      content: generatedBlog.content,
      excerpt: generatedBlog.excerpt,
      tags: generatedBlog.tags,
      featuredImage: generatedBlog.imageUrl || prev.featuredImage,
      seoTitle: generatedBlog.seoTitle || generatedBlog.title,
      seoDescription: generatedBlog.seoDescription || generatedBlog.excerpt,
      seoKeywords: generatedBlog.seoKeywords || generatedBlog.tags.join(', ')
    }))
    
    // Generate slug from title
    const slug = generatedBlog.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    setPost(prev => ({ ...prev, slug }))
    
    // Hide AI generator and show content
    setShowAIGenerator(false)
    setActiveTab('content')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {saveMessage && (
          <div className={`p-4 rounded-md ${saveMessage.includes('Error') ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'}`}>
            {saveMessage}
          </div>
        )}

        {showAIGenerator ? (
          <AIBlogGenerator onBlogGenerated={handleBlogGenerated} />
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64"></div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            {/* Header with Action Buttons */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
                  </h3>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAIGenerator(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    🤖 Generate with AI
                  </button>
                  <button
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50"
                  >
                    💾 Save Draft
                  </button>
                  <button
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-royal-blue hover:bg-royal-blue-dark"
                  >
                    🚀 Publish
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'content'
                      ? 'border-royal-blue text-royal-blue dark:border-royal-blue-light dark:text-royal-blue-light'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'seo'
                      ? 'border-royal-blue text-royal-blue dark:border-royal-blue-light dark:text-royal-blue-light'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  SEO
                </button>
              </nav>
            </div>

            {/* Content Tab */}
            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={post.title}
                        onChange={handleChange}
                        onBlur={() => !post.slug && generateSlug()}
                        className={`shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md ${
                          errors.title ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.title && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug *
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm">
                        /blog/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={post.slug}
                        onChange={handleChange}
                        className={`flex-1 focus:ring-royal-blue focus:border-royal-blue block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white ${
                          errors.slug ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.slug ? (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        URL-friendly name for your post.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-royal-blue hover:text-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
                    >
                      Generate from title
                    </button>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Excerpt *
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="excerpt"
                        name="excerpt"
                        rows={3}
                        value={post.excerpt}
                        onChange={handleChange}
                        className={`shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md ${
                          errors.excerpt ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.excerpt ? (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.excerpt}</p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          A short summary of your post. Displayed on blog listing pages.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Content *
                      </label>
                      <div>
                        <button
                          type="button"
                          onClick={() => setPreviewMode(!previewMode)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-royal-blue"
                        >
                          {previewMode ? 'Edit Mode' : 'Preview Mode'}
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      {previewMode ? (
                        <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 min-h-[300px] bg-white dark:bg-gray-900">
                          <MarkdownPreview content={post.content} />
                        </div>
                      ) : (
                        <textarea
                          id="content"
                          name="content"
                          rows={15}
                          value={post.content}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md font-mono ${
                            errors.content ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500' : ''
                          }`}
                        />
                      )}
                      {errors.content ? (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Supports Markdown formatting.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category *
                    </label>
                    <div className="mt-1">
                      <select
                        id="category"
                        name="category"
                        value={post.category}
                        onChange={handleChange}
                        className={`shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md ${
                          errors.category ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      >
                        <option value="">Select a category</option>
                        <option value="Design">Design</option>
                        <option value="Development">Development</option>
                        <option value="SEO">SEO</option>
                        <option value="Business">Business</option>
                        <option value="Mobile">Mobile</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="CMS">CMS</option>
                        <option value="General">General</option>
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                    <div className="mt-1">
                      <div className="flex items-center">
                        <input
                          type="text"
                          id="tags"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                          className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="Add a tag and press Enter"
                        />
                        <button
                          type="button"
                          onClick={handleTagAdd}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-royal-blue-light text-royal-blue-dark dark:bg-royal-blue-dark dark:text-royal-blue-light"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-royal-blue-light bg-royal-blue-dark dark:text-royal-blue-dark dark:bg-royal-blue-light hover:bg-royal-blue"
                            >
                              <span className="sr-only">Remove tag {tag}</span>
                              <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured Image URL
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="featuredImage"
                        id="featuredImage"
                        value={post.featuredImage}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Enter the URL of the featured image for this post.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        name="status"
                        value={post.status}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Tab */}
            <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      SEO Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="seoTitle"
                        id="seoTitle"
                        value={post.seoTitle}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Title that appears in search engine results. If left blank, the post title will be used.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="seoDescription"
                        name="seoDescription"
                        rows={3}
                        value={post.seoDescription}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Description that appears in search engine results. If left blank, the post excerpt will be used.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Keywords
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="seoKeywords"
                        id="seoKeywords"
                        value={post.seoKeywords}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Comma-separated keywords for search engines.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Search Engine Preview
                    </h3>
                    <div className="mt-3 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
                      <div className="text-xl text-blue-600 dark:text-blue-400 font-medium">
                        {post.seoTitle || post.title || 'Post Title'}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        https://tsvweb.com/blog/{post.slug || 'post-slug'}
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        {post.seoDescription || post.excerpt || 'Post description will appear here.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
