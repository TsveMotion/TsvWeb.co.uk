"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogService } from '@/services/blog-service'
import { BlogPost } from '@/types/blog'
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PhotoIcon,
  TagIcon,
  GlobeAltIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  ClockIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    featuredImage: '',
    author: 'Admin',
    status: 'Draft' as 'Published' | 'Draft' | 'Scheduled',
    publishDate: new Date().toISOString().slice(0, 16),
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[]
    }
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const post = await BlogService.getPostById(params.id)
        if (post) {
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || '',
            tags: post.tags || [],
            featuredImage: post.featuredImage || '',
            author: post.author?.name || post.author || 'Admin',
            status: post.status as any || 'Draft',
            publishDate: post.date ? new Date(post.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
            seo: {
              metaTitle: post.seoTitle || post.seo?.metaTitle || '',
              metaDescription: post.seoDescription || post.seo?.metaDescription || '',
              keywords: post.seoKeywords?.split(',').map(k => k.trim()) || post.seo?.keywords || []
            }
          })
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        alert('Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await BlogService.updatePost(params.id, formData as any)
      alert('Post updated successfully!')
      router.push('/admin/blog')
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, keywordInput.trim()]
        }
      }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(k => k !== keyword)
      }
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        featuredImage: data.url
      }))
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. You can paste an image URL instead.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Blog Posts
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Update your blog post content and settings
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            {/* Preview Header */}
            <div className="mb-8">
              {formData.featuredImage && (
                <img
                  src={formData.featuredImage}
                  alt={formData.title}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              )}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {formData.title || 'Untitled Post'}
              </h1>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                <span>By {formData.author}</span>
                <span>•</span>
                <span>{new Date(formData.publishDate).toLocaleDateString()}</span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded">
                  {formData.category || 'Uncategorized'}
                </span>
              </div>
            </div>

            {/* Preview Excerpt */}
            {formData.excerpt && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
                <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                  {formData.excerpt}
                </p>
              </div>
            )}

            {/* Preview Content - HTML Rendered */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-pink-600 dark:prose-code:text-pink-400
                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950"
              dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet...</p>' }}
            />

            {/* Preview Tags */}
            {formData.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">/blog/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="post-slug"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the post..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Write your post content here (HTML supported)..."
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    HTML tags are supported. Use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, etc.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <GlobeAltIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO title for search engines..."
                    maxLength={60}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.seo.metaTitle.length}/60 characters
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO description for search results..."
                    maxLength={160}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.seo.metaDescription.length}/160 characters
                  </p>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Keywords
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add keyword..."
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 hover:text-green-900 dark:hover:text-green-300"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Publish</h3>
              
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>

                {/* Publish Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Publish Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.status === 'Scheduled' ? 'Post will be published at this time' : 'Display date for the post'}
                  </p>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Category & Tags Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <TagIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category & Tags</h3>
              </div>
              
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Web Design"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-purple-900 dark:hover:text-purple-300"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <PhotoIcon className="h-5 w-5 text-pink-600 dark:text-pink-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Image</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL or Upload
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paste image URL..."
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Upload an image (max 5MB) or paste a URL
                </p>
                {formData.featuredImage && (
                  <div className="mt-4">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      )}
    </div>
  )
}
