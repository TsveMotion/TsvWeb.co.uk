"use client"

import { useState, useEffect } from 'react'
import { GlobeAltIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface WordPressSite {
  _id: string
  siteUrl: string
  siteName: string
  wordpressVersion: string
  phpVersion: string
  mysqlVersion: string
  totalPosts: number
  totalPages: number
  totalUsers: number
  activePlugins: number
  activeTheme: string
  themeVersion: string
  siteHealth: string
  memoryLimit: string
  maxUploadSize: string
  lastUpdated: string
}

export default function WordPressSitesWidget() {
  const [sites, setSites] = useState<WordPressSite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customer/wordpress-sites')
      const data = await response.json()
      
      if (data.success) {
        setSites(data.sites)
      } else {
        setError(data.error || 'Failed to load WordPress sites')
      }
    } catch (err) {
      console.error('Error fetching WordPress sites:', err)
      setError('Failed to load WordPress sites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  const getHealthColor = (health: string) => {
    if (health === 'good') return 'text-green-600 dark:text-green-400'
    if (health === 'should_improve') return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getHealthIcon = (health: string) => {
    // Always show check icon for better UX
    return <CheckCircleIcon className="h-5 w-5" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No WordPress Sites
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No WordPress sites have been assigned to your account yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your WordPress Sites
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {sites.length} {sites.length === 1 ? 'site' : 'sites'} monitored
            </p>
          </div>
        </div>
        <button
          onClick={fetchSites}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Refresh"
        >
          <ArrowPathIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sites.map((site) => (
          <div
            key={site._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Site Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {site.siteName}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {site.siteUrl}
                  </p>
                </div>
                <div className={`flex items-center gap-1 ${getHealthColor(site.siteHealth)}`}>
                  {getHealthIcon(site.siteHealth)}
                </div>
              </div>
            </div>

            {/* Site Stats */}
            <div className="p-4 space-y-4">
              {/* Version Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">WordPress</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {site.wordpressVersion || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PHP</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {site.phpVersion || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">MySQL</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {site.mysqlVersion || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Content Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Posts</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {site.totalPosts || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pages</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {site.totalPages || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Users</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {site.totalUsers || 0}
                  </p>
                </div>
              </div>

              {/* Theme & Plugins */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {site.activeTheme || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Active Plugins</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {site.activePlugins || 0}
                  </span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Last updated</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {formatDate(site.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
