"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/admin/image-upload'
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PhotoIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  StarIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

export default function EditPortfolioItem() {
  const router = useRouter()
  const { id } = useParams()
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    clientName: '',
    projectType: '',
    technologies: '',
    thumbnailImage: '',
    projectUrl: '',
    featured: false,
    completionDate: ''
  })
  
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Fetch existing portfolio item
  useEffect(() => {
    const fetchPortfolioItem = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/portfolio/${id}`)
        
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        
        if (data.success && data.data) {
          const item = data.data
          setFormData({
            title: item.title || '',
            slug: item.slug || '',
            description: item.description || '',
            shortDescription: item.shortDescription || '',
            clientName: item.clientName || '',
            projectType: item.projectType || '',
            technologies: item.technologies ? item.technologies.join(', ') : '',
            thumbnailImage: item.thumbnailImage || '',
            projectUrl: item.projectUrl || '',
            featured: item.featured || false,
            completionDate: item.completionDate ? new Date(item.completionDate).toISOString().split('T')[0] : ''
          })
          
          setImages(item.images || [])
        }
      } catch (error) {
        console.error('Error fetching portfolio item:', error)
        alert('Failed to load portfolio item')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchPortfolioItem()
    }
  }, [id])

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Format technologies as an array
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)

      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: technologiesArray,
          images: images
        })
      })

      if (!response.ok) throw new Error('Failed to update portfolio item')

      alert('Portfolio item updated successfully!')
      router.push('/admin/portfolio')
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      alert('Failed to update portfolio item')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleImageUpload = (url: string) => {
    if (url && !images.includes(url)) {
      setImages(prev => [...prev, url])
    }
  }

  const removeImage = (url: string) => {
    setImages(prev => prev.filter(img => img !== url))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio item...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <BriefcaseIcon className="h-8 w-8 mr-3 text-pink-600 dark:text-pink-400" />
              Edit Portfolio Item
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Update your portfolio project
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
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium rounded-lg hover:from-pink-700 hover:to-pink-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {formData.thumbnailImage && (
              <img
                src={formData.thumbnailImage}
                alt={formData.title}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
            )}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {formData.title || 'Untitled Project'}
              </h1>
              {formData.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <StarIcon className="h-4 w-4 mr-1" />
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4 mb-6">
              {formData.clientName && <span>Client: {formData.clientName}</span>}
              {formData.clientName && <span>•</span>}
              <span>{formData.projectType || 'Uncategorized'}</span>
              <span>•</span>
              <span>{new Date(formData.completionDate).toLocaleDateString()}</span>
            </div>

            {formData.shortDescription && (
              <div className="mb-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-500">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {formData.shortDescription}
                </p>
              </div>
            )}

            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: formData.description || '<p>No description yet...</p>' }}
            />

            {formData.technologies && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technologies Used:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.split(',').map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-sm font-medium"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Project Gallery:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Project ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {formData.projectUrl && (
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={formData.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <GlobeAltIcon className="h-5 w-5 mr-2" />
                  View Live Project
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Same as create page */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <DocumentTextIcon className="h-6 w-6 text-pink-600 dark:text-pink-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">/portfolio/</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    HTML tags are supported
                  </p>
                </div>
              </div>
            </div>

            {/* Project Images Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <PhotoIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Images</h2>
              </div>

              <div className="space-y-4">
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  label="Add Project Image"
                />

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Project ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Same as create page */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <PhotoIcon className="h-5 w-5 text-pink-600 dark:text-pink-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thumbnail</h3>
              </div>
              
              <ImageUpload
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, thumbnailImage: url }))}
                currentImage={formData.thumbnailImage}
                label="Thumbnail Image"
                required
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Type *
                  </label>
                  <input
                    type="text"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies (comma-separated) *
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project URL
                  </label>
                  <input
                    type="url"
                    name="projectUrl"
                    value={formData.projectUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    <StarIcon className="h-4 w-4 inline mr-1 text-yellow-500" />
                    Mark as Featured
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      )}
    </div>
  )
}
