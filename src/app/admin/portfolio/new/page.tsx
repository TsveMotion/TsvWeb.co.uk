"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/image-upload'
import { toast } from 'react-hot-toast'

export default function NewPortfolioPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    clientName: '',
    projectType: '',
    technologies: '',
    thumbnailImage: '',
    projectUrl: '',
    featured: false,
    completionDate: ''
  })
  
  const [images, setImages] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format technologies as an array
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '')

      // Prepare data for submission
      const portfolioData = {
        ...formData,
        technologies: technologiesArray,
        images: images // Use the uploaded images array
      }

      // Submit to API
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(portfolioData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create portfolio item')
      }

      toast.success('Portfolio item created successfully!')
      router.push('/admin/portfolio')
    } catch (error) {
      console.error('Error creating portfolio item:', error)
      toast.error('Failed to create portfolio item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    setFormData(prev => ({
      ...prev,
      slug
    }))
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Portfolio Item</h1>
      <div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={() => {
                      if (formData.title && !formData.slug) {
                        generateSlug()
                      }
                    }}
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Slug *
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    className="focus:ring-royal-blue focus:border-royal-blue flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Short Description *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="shortDescription"
                    id="shortDescription"
                    required
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.shortDescription}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Brief summary for portfolio listings</p>
              </div>

              {/* Full Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Description *
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    required
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Type *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="projectType"
                    id="projectType"
                    required
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.projectType}
                    onChange={handleChange}
                    placeholder="E.g., E-commerce, Business, Healthcare"
                  />
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Client Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Technologies
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="technologies"
                    id="technologies"
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="React, Next.js, Tailwind CSS (comma separated)"
                  />
                </div>
              </div>

              {/* Thumbnail Image */}
              <div>
                <ImageUpload
                  label="Thumbnail Image"
                  required={true}
                  currentImage={formData.thumbnailImage}
                  onUploadComplete={(imageUrl) => {
                    setFormData(prev => ({
                      ...prev,
                      thumbnailImage: imageUrl
                    }))
                  }}
                />
              </div>

              {/* Project Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Images
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...images];
                          newImages.splice(index, 1);
                          setImages(newImages);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="relative h-32 w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-royal-blue dark:hover:border-royal-blue transition-colors">
                    <ImageUpload
                      label=""
                      onUploadComplete={(imageUrl) => {
                        if (imageUrl) {
                          setImages([...images, imageUrl]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Project URL */}
              <div>
                <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="projectUrl"
                    id="projectUrl"
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.projectUrl}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Completion Date */}
              <div>
                <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completion Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="completionDate"
                    id="completionDate"
                    className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                    value={formData.completionDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    className="focus:ring-royal-blue h-4 w-4 text-royal-blue border-gray-300 dark:border-gray-700 rounded"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="featured" className="font-medium text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">Featured projects are highlighted on the portfolio page</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/admin/portfolio')}
                  className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Portfolio Item'}
                </button>
              </div>
            </form>
      </div>
    </>
  )
}
