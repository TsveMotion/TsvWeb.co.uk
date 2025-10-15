"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogService } from '@/services/blog-service'
import { BlogPost } from '@/types/blog'
import EnhancedAIBlogGenerator from '@/components/admin/blog/enhanced-ai-blog-generator'
import { BlogGenerationResponse } from '@/types/blog'

export default function NewBlogPost() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    featuredImage: '',
    author: 'Admin',
    status: 'Draft' as 'Published' | 'Draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      
      // Auto-generate slug when title changes
      if (name === 'title') {
        updated.slug = generateSlug(value)
        updated.seoTitle = value
      }
      
      // Auto-generate SEO description from excerpt
      if (name === 'excerpt') {
        updated.seoDescription = value
      }
      
      return updated
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'blog')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({ ...prev, featuredImage: result.url }))
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setIsUploading(false)
    }
  }

  const insertImageIntoContent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'blog')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        const imageHtml = `<img src="${result.url}" alt="Blog image" class="w-full h-auto rounded-lg my-4" />`
        setFormData(prev => ({ 
          ...prev, 
          content: prev.content + '\n\n' + imageHtml + '\n\n'
        }))
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (e.target) e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in the title and content fields')
      return
    }

    setIsLoading(true)
    try {
      const blogPost: Omit<BlogPost, 'id'> = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.tags.split(',')[0]?.trim() || 'General',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featuredImage: formData.featuredImage,
        author: formData.author,
        date: new Date().toISOString().split('T')[0],
        readTime: '',
        status: formData.status,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.excerpt,
        seoKeywords: formData.seoKeywords || formData.tags
      }

      const createdPost = await BlogService.createPost(blogPost)
      if (createdPost) {
        router.push('/admin/blog')
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
      alert('Error creating blog post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIBlogGenerated = (generatedBlog: BlogGenerationResponse) => {
    // Populate form with AI-generated content
    setFormData(prev => ({
      ...prev,
      title: generatedBlog.title,
      slug: generateSlug(generatedBlog.title),
      excerpt: generatedBlog.excerpt,
      content: generatedBlog.content,
      tags: generatedBlog.tags.join(', '),
      featuredImage: generatedBlog.imageUrl || '',
      seoTitle: generatedBlog.seoTitle || generatedBlog.title,
      seoDescription: generatedBlog.seoDescription || generatedBlog.excerpt,
      seoKeywords: generatedBlog.seoKeywords || generatedBlog.tags.join(', ')
    }))
    
    // Close AI generator modal
    setShowAIGenerator(false)
    
    // Switch to preview mode to show the generated content
    setPreviewMode(true)
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Blog Post</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Write and publish a new blog post with HTML support and images
            </p>
          </div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ← Back to Blog Posts
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                placeholder="Enter blog post title"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                placeholder="url-friendly-slug"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                id="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                placeholder="Brief description of the blog post"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                placeholder="tag1, tag2, tag3"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate tags with commas</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Featured Image</h2>
          
          <div className="space-y-4">
            {formData.featuredImage && (
              <div className="relative">
                <img
                  src={formData.featuredImage}
                  alt="Featured image preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-royal-blue file:text-white hover:file:bg-blue-700"
              />
              {isUploading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Content</h2>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <div className="flex space-x-2">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={insertImageIntoContent}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-royal-blue hover:bg-blue-700 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isUploading ? 'Uploading...' : 'Add Image'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAIGenerator(true)}
                  className="inline-flex items-center px-3 py-2 border border-purple-600 text-sm leading-4 font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 dark:bg-gray-700 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-900/20"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generate with AI
                </button>
              </div>
            </div>
          </div>

          {previewMode ? (
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 min-h-96 bg-gray-50 dark:bg-gray-900">
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                name="content"
                id="content"
                rows={20}
                required
                value={formData.content}
                onChange={handleInputChange}
                className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm font-mono"
                placeholder="Write your blog content here. You can use HTML tags like <h2>, <p>, <strong>, <em>, <img>, <a>, etc."
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-2">HTML Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>&lt;h2&gt;Heading&lt;/h2&gt;</code> for subheadings</li>
                  <li><code>&lt;p&gt;Paragraph text&lt;/p&gt;</code> for paragraphs</li>
                  <li><code>&lt;strong&gt;Bold text&lt;/strong&gt;</code> for bold</li>
                  <li><code>&lt;em&gt;Italic text&lt;/em&gt;</code> for italic</li>
                  <li><code>&lt;a href="url"&gt;Link text&lt;/a&gt;</code> for links</li>
                  <li>Use the "Add Image" button to insert images</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* SEO Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">SEO Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                id="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                placeholder="SEO optimized title"
              />
            </div>

            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                SEO Description
              </label>
              <textarea
                name="seoDescription"
                id="seoDescription"
                rows={3}
                value={formData.seoDescription}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                placeholder="SEO meta description"
              />
            </div>

            <div>
              <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                SEO Keywords
              </label>
              <input
                type="text"
                name="seoKeywords"
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/admin/blog"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-royal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Blog Post'}
          </button>
        </div>
      </form>

      {/* AI Blog Generator Modal */}
      {showAIGenerator && (
        <EnhancedAIBlogGenerator
          onBlogGenerated={handleAIBlogGenerated}
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </div>
  )
}
