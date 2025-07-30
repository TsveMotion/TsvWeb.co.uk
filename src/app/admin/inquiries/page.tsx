"use client"

import { useState, useEffect } from 'react'

interface Inquiry {
  _id: string
  name: string
  email: string
  message: string
  subject?: string
  phone?: string
  createdAt: string
  status: 'new' | 'read' | 'replied' | 'archived'
  type?: 'inquiry' | 'wizard' | 'support'
  // Wizard-specific fields
  company?: string
  projectType?: string
  budget?: string
  timeline?: string
  goals?: string[]
  additionalInfo?: string
  // Support ticket specific fields
  customerId?: string
  customerUsername?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  originalMessage?: string
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all')
  
  // Reply modal state
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [replyInquiry, setReplyInquiry] = useState<Inquiry | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [replyError, setReplyError] = useState('')

  const fetchInquiries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/inquiries')
      const data = await response.json()
      
      if (response.ok && data.success && data.data) {
        setInquiries(data.data)
      } else {
        console.error('Error in API response:', data)
        // Use mock data only if API fails completely
        setInquiries([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            message: 'I would like to discuss a potential project for my company website.',
            subject: 'Project Inquiry',
            createdAt: '2025-07-25T10:30:00Z',
            status: 'new'
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            message: 'Do you offer website maintenance services?',
            subject: 'Service Inquiry',
            createdAt: '2025-07-24T14:15:00Z',
            status: 'read'
          },
          {
            _id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            message: 'I need help with my e-commerce site.',
            subject: 'Support Request',
            phone: '555-123-4567',
            createdAt: '2025-07-23T09:45:00Z',
            status: 'replied'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchInquiries()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (e) {
      return 'Invalid date'
    }
  }

  // Filter inquiries based on search term and status filter
  const filteredInquiries = inquiries.filter((inquiry: Inquiry) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchLower) ||
      inquiry.email.toLowerCase().includes(searchLower) ||
      (inquiry.subject && inquiry.subject.toLowerCase().includes(searchLower)) ||
      inquiry.message.toLowerCase().includes(searchLower)
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Update local state
        setInquiries(inquiries.map(inquiry => 
          inquiry._id === id ? { ...inquiry, status: newStatus } : inquiry
        ))
      } else {
        console.error('Failed to update status:', data.message)
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error)
    }
  }
  
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Remove from local state
        setInquiries(inquiries.filter(inquiry => inquiry._id !== id))
      } else {
        console.error('Failed to delete inquiry:', data.message)
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error)
    }
  }
  
  const handleReplyInquiry = (inquiry: Inquiry) => {
    setReplyInquiry(inquiry)
    setReplyMessage('')
    setReplyError('')
    setIsReplyModalOpen(true)
  }
  
  const handleSendReply = async () => {
    if (!replyInquiry) return
    
    if (!replyMessage.trim()) {
      setReplyError('Reply message cannot be empty')
      return
    }
    
    setIsSendingReply(true)
    setReplyError('')
    
    try {
      const response = await fetch(`/api/admin/inquiries/${replyInquiry._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: replyMessage,
          recipientEmail: replyInquiry.email,
          recipientName: replyInquiry.name
        }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Update status in local state
        setInquiries(inquiries.map(inquiry => 
          inquiry._id === replyInquiry._id ? { ...inquiry, status: 'replied' } : inquiry
        ))
        
        // Close modal
        setIsReplyModalOpen(false)
        setReplyInquiry(null)
      } else {
        setReplyError(data.message || 'Failed to send reply. Please try again.')
      }
    } catch (error: any) {
      setReplyError(error.message || 'An error occurred while sending the reply')
    } finally {
      setIsSendingReply(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Inquiries
            </h2>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="flex-1 space-y-6 py-1 max-w-2xl">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">No inquiries found</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'There are no inquiries yet'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInquiries.map((inquiry) => (
              <li key={inquiry._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          {inquiry.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{inquiry.name}</h4>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inquiry.type === 'wizard' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                            : inquiry.type === 'support'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {inquiry.type === 'wizard' ? 'Setup Wizard' : inquiry.type === 'support' ? 'Support Ticket' : 'Contact Form'}
                        </span>
                        {inquiry.type === 'support' && inquiry.priority && (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inquiry.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                            inquiry.priority === 'high' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                            inquiry.priority === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                            'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          }`}>
                            {inquiry.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{inquiry.email}</p>
                      {inquiry.type === 'support' && inquiry.customerUsername && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">👤 Customer: {inquiry.customerUsername}</p>
                      )}
                      {inquiry.type === 'support' && inquiry.category && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Category:</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            inquiry.category === 'contracts' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' :
                            inquiry.category === 'billing' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                            inquiry.category === 'technical' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                            inquiry.category === 'account' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' :
                            'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {inquiry.category.charAt(0).toUpperCase() + inquiry.category.slice(1)}
                          </span>
                        </div>
                      )}
                      {inquiry.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">📞 {inquiry.phone}</p>
                      )}
                      {inquiry.company && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">🏢 {inquiry.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${inquiry.status === 'new' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                        inquiry.status === 'read' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                        inquiry.status === 'replied' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(inquiry.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  {inquiry.subject && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {inquiry.subject}
                    </p>
                  )}
                  
                  {inquiry.type === 'wizard' && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {inquiry.projectType && (
                        <div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Project Type:</span>
                          <p className="text-sm text-gray-900 dark:text-white">{inquiry.projectType}</p>
                        </div>
                      )}
                      {inquiry.budget && (
                        <div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Budget:</span>
                          <p className="text-sm text-gray-900 dark:text-white">{inquiry.budget}</p>
                        </div>
                      )}
                      {inquiry.timeline && (
                        <div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Timeline:</span>
                          <p className="text-sm text-gray-900 dark:text-white">{inquiry.timeline}</p>
                        </div>
                      )}
                      {inquiry.goals && inquiry.goals.length > 0 && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Goals:</span>
                          <p className="text-sm text-gray-900 dark:text-white">{inquiry.goals.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {inquiry.type === 'support' && (
                    <div className="mt-2 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                            Customer Support Request
                          </h4>
                          {inquiry.originalMessage && (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Original Message:</span>
                              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{inquiry.originalMessage}</p>
                            </div>
                          )}
                          {inquiry.customerId && (
                            <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
                              <strong>Customer ID:</strong> {inquiry.customerId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {inquiry.message}
                  </p>
                  
                  {inquiry.type === 'wizard' && inquiry.additionalInfo && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Additional Information:</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{inquiry.additionalInfo}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  {inquiry.status !== 'read' && inquiry.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(inquiry._id, 'read')}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Mark as Read
                    </button>
                  )}
                  {inquiry.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(inquiry._id, 'archived')}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleReplyInquiry(inquiry)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInquiry(inquiry._id)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && replyInquiry && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Reply to {replyInquiry.name}
                  </h3>
                  <div className="mt-2">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Subject:</span> {replyInquiry.subject || 'No subject'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-medium">Original message:</span> {replyInquiry.message}
                      </p>
                    </div>
                    <textarea
                      rows={5}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      placeholder="Type your reply here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    ></textarea>
                    {replyError && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{replyError}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={handleSendReply}
                  disabled={isSendingReply}
                >
                  {isSendingReply ? 'Sending...' : 'Send Reply'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setIsReplyModalOpen(false)
                    setReplyInquiry(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
