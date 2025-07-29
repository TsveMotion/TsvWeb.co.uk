"use client"

import { useState, useEffect } from 'react'
import withAdminAuth from '@/components/admin/with-admin-auth'

interface SiteSettingsData {
  siteName?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  faviconUrl?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}

function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettingsData>({
    socialMedia: {},
    seo: {},
    analytics: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/settings')
        const data = await response.json()
        
        if (data.success && data.data) {
          setSettings(data.data)
        } else {
          // Initialize with empty settings if none exist
          setSettings({
            socialMedia: {},
            seo: {},
            analytics: {}
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        setError('Failed to load settings. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Handle nested objects (socialMedia, seo, analytics)
    if (name.includes('.')) {
      const [category, field] = name.split('.')
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category as keyof SiteSettingsData] as Record<string, any>,
          [field]: value
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('Settings saved successfully!')
      } else {
        setError('Failed to save settings. Please try again.')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('An error occurred while saving settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/20">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 dark:bg-green-900/20">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* General Settings */}
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      General Information
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Site Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="siteName"
                            id="siteName"
                            value={settings.siteName || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tagline
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="tagline"
                            id="tagline"
                            value={settings.tagline || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Site Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={settings.description || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Contact Information
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={settings.email || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={settings.phone || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Address
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="address"
                            name="address"
                            rows={2}
                            value={settings.address || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Social Media */}
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Social Media
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Facebook URL
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="socialMedia.facebook"
                            id="socialMedia.facebook"
                            value={settings.socialMedia?.facebook || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="socialMedia.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Twitter URL
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="socialMedia.twitter"
                            id="socialMedia.twitter"
                            value={settings.socialMedia?.twitter || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Instagram URL
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="socialMedia.instagram"
                            id="socialMedia.instagram"
                            value={settings.socialMedia?.instagram || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="socialMedia.linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          LinkedIn URL
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="socialMedia.linkedin"
                            id="socialMedia.linkedin"
                            value={settings.socialMedia?.linkedin || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="socialMedia.github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          GitHub URL
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="socialMedia.github"
                            id="socialMedia.github"
                            value={settings.socialMedia?.github || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* SEO Settings */}
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      SEO Settings
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="seo.metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Meta Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="seo.metaTitle"
                            id="seo.metaTitle"
                            value={settings.seo?.metaTitle || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="seo.metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Meta Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="seo.metaDescription"
                            name="seo.metaDescription"
                            rows={3}
                            value={settings.seo?.metaDescription || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Analytics */}
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Analytics
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="analytics.googleAnalyticsId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Google Analytics ID
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="analytics.googleAnalyticsId"
                            id="analytics.googleAnalyticsId"
                            value={settings.analytics?.googleAnalyticsId || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="analytics.facebookPixelId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Facebook Pixel ID
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="analytics.facebookPixelId"
                            id="analytics.facebookPixelId"
                            value={settings.analytics?.facebookPixelId || ''}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-royal-blue focus:border-royal-blue block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Settings'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAdminAuth(AdminSettings)
