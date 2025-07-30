"use client"

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

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
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    contentType: 'html'
  })
  const [sending, setSending] = useState(false)
  const [generatingContent, setGeneratingContent] = useState(false)

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
    const topic = prompt('Enter a topic or theme for the newsletter (e.g., "web development trends", "company updates", "seasonal promotions")');
    
    if (!topic) return;

    try {
      setGeneratingContent(true);
      
      // TODO: Replace with actual GPT-4o API call
      // This is a placeholder that simulates AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const generatedContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">Newsletter: ${topic}</h1>
          
          <p>Dear Subscribers,</p>
          
          <p>We're excited to share some insights about <strong>${topic}</strong> with you in this edition of our newsletter.</p>
          
          <h2 style="color: #1f2937;">What's New</h2>
          <p>This section would contain AI-generated content about ${topic}, including:</p>
          <ul>
            <li>Latest trends and developments</li>
            <li>Expert insights and analysis</li>
            <li>Practical tips and recommendations</li>
            <li>Upcoming events or opportunities</li>
          </ul>
          
          <h2 style="color: #1f2937;">Featured Content</h2>
          <p>Here we would showcase relevant articles, case studies, or resources related to ${topic}.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">💡 Pro Tip</h3>
            <p style="margin-bottom: 0;">AI-generated professional advice or insight would appear here.</p>
          </div>
          
          <p>Thank you for being a valued subscriber!</p>
          
          <p>Best regards,<br>The TsvWeb Team</p>
        </div>
      `;
      
      setNewsletterData(prev => ({
        ...prev,
        subject: `Newsletter: ${topic}`,
        content: generatedContent
      }));
      
      toast.success('Newsletter content generated! You can edit it before sending.');
      
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setGeneratingContent(false);
    }
  };

  const sendNewsletter = async () => {
    if (!newsletterData.subject.trim() || !newsletterData.content.trim()) {
      toast.error('Subject and content are required')
      return
    }

    if (!confirm(`Send newsletter to all ${pagination.totalItems} active subscribers?`)) return

    try {
      setSending(true)
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsletterData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Newsletter sent! ${data.stats.successful} successful, ${data.stats.failed} failed`)
        setShowComposer(false)
        setNewsletterData({ subject: '', content: '', contentType: 'html' })
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage subscribers and send newsletters
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Compose Newsletter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Subscribers</h3>
          <p className="text-3xl font-bold text-blue-600">{pagination.totalItems}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active</h3>
          <p className="text-3xl font-bold text-green-600">
            {subscribers.filter(s => s.isActive).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inactive</h3>
          <p className="text-3xl font-bold text-red-600">
            {subscribers.filter(s => !s.isActive).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading subscribers...</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No subscribers found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          subscriber.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(subscriber.subscribedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => removeSubscriber(subscriber._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
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
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                    {pagination.totalItems} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchSubscribers(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchSubscribers(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                    >
                      Next
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Compose Newsletter
                </h2>
                <button
                  onClick={() => setShowComposer(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newsletterData.subject}
                    onChange={(e) => setNewsletterData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter newsletter subject..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content Type
                  </label>
                  <select
                    value={newsletterData.contentType}
                    onChange={(e) => setNewsletterData(prev => ({ ...prev, contentType: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="html">HTML</option>
                    <option value="text">Plain Text</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content {newsletterData.contentType === 'html' && '(HTML/Markdown)'}
                    </label>
                    <button
                      type="button"
                      onClick={generateNewsletterContent}
                      disabled={generatingContent}
                      className="flex items-center gap-2 px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {generatingContent ? (
                        <>
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={newsletterData.content}
                    onChange={(e) => setNewsletterData(prev => ({ ...prev, content: e.target.value }))}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder={newsletterData.contentType === 'html' 
                      ? "Enter your newsletter content in HTML or Markdown format..." 
                      : "Enter your newsletter content in plain text..."
                    }
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowComposer(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendNewsletter}
                    disabled={sending}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : `Send to ${pagination.totalItems} Subscribers`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
