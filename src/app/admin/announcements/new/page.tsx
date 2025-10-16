"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  EyeIcon,
  CheckCircleIcon,
  CalendarIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export default function NewAnnouncement() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'active' as 'active' | 'scheduled' | 'archived',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '',
    targetAudience: '',
    displayLocation: ['header'] as Array<'dashboard' | 'header' | 'footer' | 'contact'>,
    sendEmail: false
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create announcement')

      alert('Announcement created successfully!')
      router.push('/admin/announcements')
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Failed to create announcement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return InformationCircleIcon
      case 'warning': return ExclamationTriangleIcon
      case 'success': return CheckCircleIcon
      case 'error': return XCircleIcon
      default: return InformationCircleIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-500'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-500'
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-500'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-500'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-500'
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/announcements"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Announcements
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <MegaphoneIcon className="h-8 w-8 mr-3 text-orange-600 dark:text-orange-400" />
              Create New Announcement
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Notify your customers with important updates
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
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Create Announcement
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
            <div className={`p-6 rounded-lg border-l-4 ${getTypeColor(formData.type)}`}>
              <div className="flex items-start">
                {(() => {
                  const TypeIcon = getTypeIcon(formData.type)
                  return <TypeIcon className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                })()}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {formData.title || 'Untitled Announcement'}
                  </h2>
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.message || '<p>No message yet...</p>' }}
                  />
                  <div className="mt-4 flex items-center text-sm space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                      {formData.type}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                      {formData.priority} priority
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                      {formData.status}
                    </span>
                  </div>
                  {formData.targetAudience && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      Target: {formData.targetAudience}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                <DocumentTextIcon className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Announcement Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter announcement title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                    placeholder="Write your announcement message (HTML supported)..."
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    HTML tags are supported. Use &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience (Optional)
                  </label>
                  <input
                    type="text"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., All users, Premium members, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Display Locations *
                  </label>
                  <div className="space-y-2">
                    {['header', 'contact', 'dashboard', 'footer'].map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.displayLocation.includes(location as any)}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setFormData(prev => ({
                              ...prev,
                              displayLocation: checked
                                ? [...prev.displayLocation, location as any]
                                : prev.displayLocation.filter(l => l !== location)
                            }))
                          }}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {location}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Select where this announcement should be displayed
                  </p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sendEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, sendEmail: e.target.checked }))}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Send email notification to all customers
                    </span>
                  </label>
                  <p className="mt-1 ml-6 text-xs text-gray-500 dark:text-gray-400">
                    Sends this announcement via email to all registered customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty for no end date
                  </p>
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
