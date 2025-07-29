'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CalendarIcon, CurrencyPoundIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface Inquiry {
  _id: string
  name: string
  email: string
  message: string
  subject?: string
  phone?: string
  createdAt: string
  status: 'new' | 'read' | 'replied' | 'archived'
  type?: 'inquiry' | 'wizard'
  company?: string
  projectType?: string
  budget?: string
  timeline?: string
  goals?: string[]
  additionalInfo?: string
}

export default function InquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const inquiryId = params.id as string

  useEffect(() => {
    fetchInquiry()
  }, [inquiryId])

  const fetchInquiry = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch inquiry')
      }
      
      const data = await response.json()
      setInquiry(data.inquiry)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setInquiry(prev => prev ? { ...prev, status: newStatus as any } : null)
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'wizard' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Inquiries
          </button>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="text-center">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {error || 'Inquiry not found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The inquiry you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Inquiries
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Inquiry Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {inquiry._id}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(inquiry.type || 'inquiry')}`}>
                {inquiry.type === 'wizard' ? 'Setup Wizard' : 'Contact Form'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {inquiry.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {inquiry.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  </div>
                </div>

                {inquiry.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {inquiry.phone}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    </div>
                  </div>
                )}

                {inquiry.company && (
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {inquiry.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Details (for wizard submissions) */}
            {inquiry.type === 'wizard' && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Project Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {inquiry.projectType && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Type</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {inquiry.projectType}
                      </p>
                    </div>
                  )}

                  {inquiry.budget && (
                    <div className="flex items-center">
                      <CurrencyPoundIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {inquiry.budget}
                        </p>
                      </div>
                    </div>
                  )}

                  {inquiry.timeline && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {inquiry.timeline}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {inquiry.goals && inquiry.goals.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Project Goals</p>
                    <div className="flex flex-wrap gap-2">
                      {inquiry.goals.map((goal, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Message */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {inquiry.subject ? 'Subject & Message' : 'Message'}
              </h2>
              
              {inquiry.subject && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {inquiry.subject}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {inquiry.type === 'wizard' ? 'Additional Information' : 'Message'}
                </p>
                <div className="mt-2 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {inquiry.type === 'wizard' ? inquiry.additionalInfo || 'No additional information provided.' : inquiry.message}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Status Management
              </h2>
              
              <div className="space-y-3">
                {['new', 'read', 'replied', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={updating || inquiry.status === status}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      inquiry.status === status
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {inquiry.status === status && (
                      <CheckCircleIcon className="inline-block w-4 h-4 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Metadata
              </h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Submitted</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Type</p>
                  <p className="text-gray-900 dark:text-white">
                    {inquiry.type === 'wizard' ? 'Setup Wizard Submission' : 'Contact Form Inquiry'}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">ID</p>
                  <p className="text-gray-900 dark:text-white font-mono text-xs">
                    {inquiry._id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
