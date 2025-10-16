"use client"

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  EnvelopeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  TrashIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Subscriber {
  _id: string
  email: string
  subscribedAt: string
  isActive: boolean
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showComposer, setShowComposer] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    contentType: 'html'
  })
  const [aiConfig, setAiConfig] = useState({
    topic: '',
    length: 'medium' as 'short' | 'medium' | 'long',
    tone: 'professional' as 'professional' | 'casual' | 'friendly',
    includeCallToAction: true
  })
  const [sending, setSending] = useState(false)
  const [generatingContent, setGeneratingContent] = useState(false)
  const [showAiConfig, setShowAiConfig] = useState(false)

  const fetchSubscribers = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/newsletter?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSubscribers(data.subscribers)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || 'Failed to fetch subscribers')
      }
    } catch (error) {
      toast.error('Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }

  const removeSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return

    try {
      const response = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriberId })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Subscriber removed successfully')
        fetchSubscribers(pagination.currentPage)
      } else {
        toast.error(data.error || 'Failed to remove subscriber')
      }
    } catch (error) {
      toast.error('Failed to remove subscriber')
    }
  }

  const generateNewsletterContent = async () => {
    if (!aiConfig.topic.trim()) {
      toast.error('Please enter a topic first');
      return;
    }

    try {
      setGeneratingContent(true);
      
      // TODO: Replace with actual GPT-4o API call
      // This is a placeholder that simulates AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const lengthConfig = {
        short: { paragraphs: 2, listItems: 3 },
        medium: { paragraphs: 4, listItems: 5 },
        long: { paragraphs: 6, listItems: 7 }
      }[aiConfig.length];

      const toneGreeting = {
        professional: 'Dear Valued Subscribers,',
        casual: 'Hey there!',
        friendly: 'Hello friends!'
      }[aiConfig.tone];

      const toneClosing = {
        professional: 'Best regards,<br>The TsvWeb Team',
        casual: 'Cheers,<br>Your TsvWeb Team',
        friendly: 'Warmly,<br>Your friends at TsvWeb'
      }[aiConfig.tone];
      
      const generatedContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">Newsletter: ${aiConfig.topic}</h1>
          
          <p>${toneGreeting}</p>
          
          <p>We're excited to share some insights about <strong>${aiConfig.topic}</strong> with you in this edition of our newsletter.</p>
          
          ${aiConfig.length !== 'short' ? `<h2 style="color: #1f2937;">What's New</h2>
          <p>This section contains AI-generated content about ${aiConfig.topic}, including:</p>
          <ul>
            ${Array.from({ length: lengthConfig.listItems }, (_, i) => `<li>Key insight ${i + 1} about ${aiConfig.topic}</li>`).join('\n            ')}
          </ul>` : ''}
          
          <h2 style="color: #1f2937;">Featured Content</h2>
          <p>Here we showcase relevant articles, case studies, or resources related to ${aiConfig.topic}.</p>
          
          ${aiConfig.length === 'long' ? `<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">💡 Pro Tip</h3>
            <p style="margin-bottom: 0;">AI-generated professional advice or insight would appear here.</p>
          </div>` : ''}
          
          ${aiConfig.includeCallToAction ? `<div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Learn More</a>
          </div>` : ''}
          
          <p>Thank you for being a valued subscriber!</p>
          
          <p>${toneClosing}</p>
        </div>
      `;
      
      setNewsletterData(prev => ({
        ...prev,
        subject: `Newsletter: ${aiConfig.topic}`,
        content: generatedContent
      }));
      
      setShowAiConfig(false);
      toast.success('Newsletter content generated! You can edit it before sending.');
      
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setGeneratingContent(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map(s => s._id));
    }
  };

  const toggleSubscriber = (subscriberId: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(subscriberId)
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const sendNewsletter = async () => {
    if (!newsletterData.subject.trim() || !newsletterData.content.trim()) {
      toast.error('Subject and content are required')
      return
    }

    const recipientCount = selectedSubscribers.length > 0 ? selectedSubscribers.length : pagination.totalItems;
    const recipientText = selectedSubscribers.length > 0 ? `${selectedSubscribers.length} selected subscribers` : `all ${pagination.totalItems} active subscribers`;
    
    if (!confirm(`Send newsletter to ${recipientText}?`)) return

    try {
      setSending(true)
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newsletterData,
          selectedSubscribers: selectedSubscribers.length > 0 ? selectedSubscribers : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Newsletter sent! ${data.stats.successful} successful, ${data.stats.failed} failed`)
        setShowComposer(false)
        setNewsletterData({ subject: '', content: '', contentType: 'html' })
        setSelectedSubscribers([])
      } else {
        toast.error(data.error || 'Failed to send newsletter')
      }
    } catch (error) {
      toast.error('Failed to send newsletter')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [searchTerm, statusFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Newsletter Management</h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            Manage subscribers and send newsletters to your audience
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
          Compose Newsletter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Subscribers */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <ChartBarIcon className="h-6 w-6 opacity-50" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Subscribers</h3>
            <p className="text-4xl font-bold">{pagination.totalItems}</p>
            <p className="text-xs opacity-75 mt-2">All newsletter subscribers</p>
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {pagination.totalItems > 0 ? Math.round((subscribers.filter(s => s.isActive).length / pagination.totalItems) * 100) : 0}%
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Active</h3>
            <p className="text-4xl font-bold">{subscribers.filter(s => s.isActive).length}</p>
            <p className="text-xs opacity-75 mt-2">Engaged subscribers</p>
          </div>
        </div>

        {/* Inactive Subscribers */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <XCircleIcon className="h-8 w-8" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {pagination.totalItems > 0 ? Math.round((subscribers.filter(s => !s.isActive).length / pagination.totalItems) * 100) : 0}%
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Inactive</h3>
            <p className="text-4xl font-bold">{subscribers.filter(s => !s.isActive).length}</p>
            <p className="text-xs opacity-75 mt-2">Unsubscribed users</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FunnelIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all min-w-[160px]"
          >
            <option value="all">All Status</option>
            <option value="active">✓ Active</option>
            <option value="inactive">✕ Inactive</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              Subscribers List
            </h2>
            {selectedSubscribers.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                  {selectedSubscribers.length} selected
                </span>
                <button
                  onClick={() => setSelectedSubscribers([])}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading subscribers...</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
              <EnvelopeIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No subscribers found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Subscribed
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber._id)}
                          onChange={() => toggleSubscriber(subscriber._id)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                            <EnvelopeIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${
                          subscriber.isActive 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300'
                        }`}>
                          {subscriber.isActive ? (
                            <>
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-3.5 w-3.5" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          {formatDate(subscriber.subscribedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => removeSubscriber(subscriber._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-500 rounded-lg transition-all duration-200 font-medium"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Showing <span className="font-bold text-teal-600 dark:text-teal-400">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{' '}
                    <span className="font-bold text-teal-600 dark:text-teal-400">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of{' '}
                    <span className="font-bold text-teal-600 dark:text-teal-400">{pagination.totalItems}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchSubscribers(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ← Previous
                    </button>
                    <div className="px-4 py-2 text-sm font-bold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg">
                      {pagination.currentPage} / {pagination.totalPages}
                    </div>
                    <button
                      onClick={() => fetchSubscribers(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-700 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <PaperAirplaneIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Compose Newsletter
                    </h2>
                    <p className="text-sm text-blue-100">Send to {pagination.totalItems} subscribers</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowComposer(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={newsletterData.subject}
                    onChange={(e) => setNewsletterData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter an engaging subject line..."
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Make it catchy to improve open rates</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content Type
                  </label>
                  <select
                    value={newsletterData.contentType}
                    onChange={(e) => setNewsletterData(prev => ({ ...prev, contentType: e.target.value }))}
                    className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="html">📄 HTML</option>
                    <option value="text">📝 Plain Text</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Newsletter Content {newsletterData.contentType === 'html' && '(HTML/Markdown)'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        disabled={!newsletterData.content}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAiConfig(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                      >
                        <SparklesIcon className="h-4 w-4" />
                        Generate with AI
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={newsletterData.content}
                    onChange={(e) => setNewsletterData(prev => ({ ...prev, content: e.target.value }))}
                    rows={15}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={newsletterData.contentType === 'html' 
                      ? "Enter your newsletter content in HTML or Markdown format...\n\nExample:\n<h1>Welcome!</h1>\n<p>Your content here...</p>" 
                      : "Enter your newsletter content in plain text...\n\nWrite your message here..."
                    }
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {newsletterData.content.length} characters
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowComposer(false)}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendNewsletter}
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    {sending ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5" />
                        {selectedSubscribers.length > 0 
                          ? `Send to ${selectedSubscribers.length} Selected` 
                          : `Send to ${pagination.totalItems} Subscribers`}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Configuration Modal */}
      {showAiConfig && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">AI Content Generator</h2>
                </div>
                <button
                  onClick={() => setShowAiConfig(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Topic / Theme *
                </label>
                <input
                  type="text"
                  value={aiConfig.topic}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g., Web Development Trends, Company Updates..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content Length
                  </label>
                  <select
                    value={aiConfig.length}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, length: e.target.value as any }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="short">📝 Short (Quick read)</option>
                    <option value="medium">📄 Medium (Standard)</option>
                    <option value="long">📚 Long (Detailed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tone
                  </label>
                  <select
                    value={aiConfig.tone}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, tone: e.target.value as any }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="professional">💼 Professional</option>
                    <option value="casual">😊 Casual</option>
                    <option value="friendly">🤝 Friendly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiConfig.includeCallToAction}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, includeCallToAction: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Include Call-to-Action Button
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowAiConfig(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={generateNewsletterContent}
                  disabled={generatingContent || !aiConfig.topic.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {generatingContent ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 border-b border-gray-700 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <EyeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Email Preview</h2>
                    <p className="text-sm text-gray-200">How your newsletter will look</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-300 dark:border-gray-700">
                  <EnvelopeIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Subject:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{newsletterData.subject || 'No subject'}</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner">
                  {newsletterData.contentType === 'html' ? (
                    <div dangerouslySetInnerHTML={{ __html: newsletterData.content }} />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-white">{newsletterData.content}</pre>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
