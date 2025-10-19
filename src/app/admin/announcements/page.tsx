"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface Announcement {
  _id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'scheduled' | 'archived'
  startDate: string
  endDate?: string
  targetAudience?: string
  createdAt: string
  updatedAt: string
}

interface MaintenanceMode {
  _id?: string
  isEnabled: boolean
  message: string
  scope: 'tsvweb' | 'all'
  scheduledStart?: string
  scheduledEnd?: string
  autoDisable: boolean
  autoDisableDuration?: number
  customMessage?: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  // Maintenance Mode state
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode>({
    isEnabled: false,
    message: '⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE',
    scope: 'tsvweb',
    autoDisable: false
  })
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false)
  const [maintenanceSaveStatus, setMaintenanceSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchAnnouncements()
    fetchMaintenanceMode()
  }, [])

  const fetchAnnouncements = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/announcements')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      if (data.success && data.data) {
        setAnnouncements(data.data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMaintenanceMode = async () => {
    try {
      const response = await fetch('/api/admin/maintenance')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      if (data.success && data.data) {
        setMaintenanceMode(data.data)
      }
    } catch (error) {
      console.error('Error fetching maintenance mode:', error)
    }
  }

  const handleMaintenanceToggle = async () => {
    setIsMaintenanceLoading(true)
    setMaintenanceSaveStatus('idle')
    
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...maintenanceMode,
          isEnabled: !maintenanceMode.isEnabled
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMaintenanceMode(data.data)
          setMaintenanceSaveStatus('success')
          setTimeout(() => setMaintenanceSaveStatus('idle'), 3000)
        }
      } else {
        setMaintenanceSaveStatus('error')
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error)
      setMaintenanceSaveStatus('error')
    } finally {
      setIsMaintenanceLoading(false)
    }
  }

  const handleMaintenanceSave = async () => {
    setIsMaintenanceLoading(true)
    setMaintenanceSaveStatus('idle')
    
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintenanceMode)
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMaintenanceMode(data.data)
          setMaintenanceSaveStatus('success')
          setTimeout(() => setMaintenanceSaveStatus('idle'), 3000)
        }
      } else {
        setMaintenanceSaveStatus('error')
      }
    } catch (error) {
      console.error('Error saving maintenance mode:', error)
      setMaintenanceSaveStatus('error')
    } finally {
      setIsMaintenanceLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        const response = await fetch(`/api/admin/announcements/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setAnnouncements(announcements.filter(item => item._id !== id))
          setDeleteConfirm(null)
          alert('Announcement deleted successfully!')
        } else {
          alert('Failed to delete announcement')
        }
      } catch (error) {
        console.error('Error deleting announcement:', error)
        alert('Failed to delete announcement')
      }
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.message.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === 'all' || item.type === typeFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      
      return matchesSearch && matchesType && matchesStatus
    })
  }, [announcements, searchTerm, typeFilter, statusFilter])

  // Stats
  const stats = {
    total: announcements.length,
    active: announcements.filter(item => item.status === 'active').length,
    scheduled: announcements.filter(item => item.status === 'scheduled').length,
    archived: announcements.filter(item => item.status === 'archived').length
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
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <MegaphoneIcon className="h-8 w-8 mr-3 text-orange-600 dark:text-orange-400" />
              Customer Announcements
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create and manage announcements for your customers
            </p>
          </div>
          
          <Link
            href="/admin/announcements/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Announcement
          </Link>
        </div>
      </div>

      {/* Maintenance Mode Section */}
      <div className="mb-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl shadow-lg border-2 border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 mr-3 text-red-600 dark:text-red-400" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Mode</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Control website downtime notifications</p>
            </div>
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={handleMaintenanceToggle}
            disabled={isMaintenanceLoading}
            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              maintenanceMode.isEnabled 
                ? 'bg-red-600 dark:bg-red-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            } ${isMaintenanceLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                maintenanceMode.isEnabled ? 'translate-x-12' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
            maintenanceMode.isEnabled 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          }`}>
            {maintenanceMode.isEnabled ? '🔴 MAINTENANCE MODE ACTIVE' : '✅ All Systems Operational'}
          </span>
        </div>

        {/* Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scope Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <GlobeAltIcon className="h-5 w-5 inline mr-2" />
              Scope
            </label>
            <select
              value={maintenanceMode.scope}
              onChange={(e) => setMaintenanceMode({...maintenanceMode, scope: e.target.value as 'tsvweb' | 'all'})}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
            >
              <option value="tsvweb">Only tsvweb.co.uk</option>
              <option value="all">All TSVWeb Client Websites</option>
            </select>
          </div>

          {/* Auto-disable Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <ClockIcon className="h-5 w-5 inline mr-2" />
              Auto-disable After (minutes)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Leave empty for manual disable"
              value={maintenanceMode.autoDisableDuration || ''}
              onChange={(e) => setMaintenanceMode({
                ...maintenanceMode, 
                autoDisable: !!e.target.value,
                autoDisableDuration: e.target.value ? parseInt(e.target.value) : undefined
              })}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Custom Message */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              ⚠️ Popup Message
            </label>
            <textarea
              value={maintenanceMode.message}
              onChange={(e) => setMaintenanceMode({...maintenanceMode, message: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
              placeholder="⚠️ SERVICES MAY BE DOWN&#10;WEBSITES ARE ALL UNDER MAINTENANCE"
            />
          </div>

          {/* Scheduled Start/End (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Scheduled Start (Optional)
            </label>
            <input
              type="datetime-local"
              value={maintenanceMode.scheduledStart || ''}
              onChange={(e) => setMaintenanceMode({...maintenanceMode, scheduledStart: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Scheduled End (Optional)
            </label>
            <input
              type="datetime-local"
              value={maintenanceMode.scheduledEnd || ''}
              onChange={(e) => setMaintenanceMode({...maintenanceMode, scheduledEnd: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleMaintenanceSave}
            disabled={isMaintenanceLoading}
            className={`px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
              isMaintenanceLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isMaintenanceLoading ? 'Saving...' : 'Save Settings'}
          </button>

          {maintenanceSaveStatus === 'success' && (
            <div className="flex items-center text-green-700 dark:text-green-400 font-semibold">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Settings saved successfully!
            </div>
          )}

          {maintenanceSaveStatus === 'error' && (
            <div className="flex items-center text-red-700 dark:text-red-400 font-semibold">
              <XCircleIcon className="h-5 w-5 mr-2" />
              Failed to save settings
            </div>
          )}
        </div>

        {/* Warning Message */}
        {maintenanceMode.isEnabled && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-300 font-semibold text-center">
              ⚠️ WARNING: Maintenance mode is currently ACTIVE. Users will see a blocking popup on affected websites.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <MegaphoneIcon className="h-12 w-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold mt-2">{stats.active}</p>
            </div>
            <CheckCircleIcon className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Scheduled</p>
              <p className="text-3xl font-bold mt-2">{stats.scheduled}</p>
            </div>
            <ClockIcon className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Archived</p>
              <p className="text-3xl font-bold mt-2">{stats.archived}</p>
            </div>
            <ArchiveBoxIcon className="h-12 w-12 text-gray-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAnnouncements.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span> announcements
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <MegaphoneIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">No Announcements Yet</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first announcement to notify customers'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Announcement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAnnouncements.map((item) => {
                  const TypeIcon = getTypeIcon(item.type)
                  return (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {item.message}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          item.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>{new Date(item.startDate).toLocaleDateString()}</div>
                        {item.endDate && <div className="text-xs">to {new Date(item.endDate).toLocaleDateString()}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/announcements/${item._id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              deleteConfirm === item._id
                                ? 'text-white bg-red-600 hover:bg-red-700'
                                : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}
                            title={deleteConfirm === item._id ? 'Click again to confirm' : 'Delete'}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
