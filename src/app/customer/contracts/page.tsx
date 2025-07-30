"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Contract {
  _id: string
  title: string
  description?: string
  contractType: string
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
  clientName: string
  clientEmail: string
  clientCompany?: string
  amount: number
  currency: string
  startDate?: string
  endDate?: string
  duration?: number
  files: Array<{
    filename: string
    originalName: string
    path: string
    size: number
    mimeType: string
    uploadedAt: string
  }>
  signedAt?: string
  sentAt?: string
  emailsSent: Array<{
    sentAt: string
    subject: string
    status: string
  }>
  notes: Array<{
    content: string
    createdAt: string
    isPrivate: boolean
  }>
  createdAt: string
  updatedAt: string
}

export default function CustomerContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchContracts()
  }, [currentPage, statusFilter])

  const fetchContracts = async () => {
    setLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/customer/contracts?${params}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/customer/login')
          return
        }
        throw new Error('Failed to fetch contracts')
      }

      const data = await response.json()
      
      if (data.success) {
        setContracts(data.contracts)
        setTotalPages(data.pagination.pages)
      } else {
        setError(data.error || 'Failed to fetch contracts')
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
      setError('Failed to fetch contracts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      signed: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      web_development: 'Web Development',
      maintenance: 'Maintenance',
      hosting: 'Hosting',
      consultation: 'Consultation',
      design: 'Design',
      custom: 'Custom'
    }
    
    return (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
        {typeLabels[type as keyof typeof typeLabels] || type}
      </span>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const openContractDetail = (contract: Contract) => {
    setSelectedContract(contract)
    setShowDetailModal(true)
  }

  if (loading && contracts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Contracts & Documents</h1>
            <p className="text-gray-600 mt-2">View and download your contracts, signed documents, and invoices</p>
          </div>
          <button
            onClick={() => router.push('/customer/dashboard')}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Contracts</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="signed">Signed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('')
                  setCurrentPage(1)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>

        {/* Contracts Grid */}
        {contracts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contracts.map((contract) => (
                <div key={contract._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{contract.title}</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    
                    {contract.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{contract.description}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Type:</span>
                        {getTypeBadge(contract.contractType)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Amount:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {contract.currency} {contract.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Files:</span>
                        <span className="text-sm text-gray-900">{contract.files.length} documents</span>
                      </div>
                      {contract.signedAt && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Signed:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(contract.signedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openContractDetail(contract)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        View Details
                      </button>
                      {contract.files.length > 0 && (
                        <button className="px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium">
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Contracts Found</h3>
            <p className="text-gray-500">You don't have any contracts yet. When TsvWeb creates contracts for your projects, they'll appear here.</p>
          </div>
        )}

        {/* Contract Detail Modal */}
        {showDetailModal && selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedContract.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedContract.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(selectedContract.status)}
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contract Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Type:</span>
                        <div className="mt-1">{getTypeBadge(selectedContract.contractType)}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Amount:</span>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedContract.currency} {selectedContract.amount.toLocaleString()}
                        </p>
                      </div>
                      {selectedContract.duration && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Duration:</span>
                          <p className="text-gray-900">{selectedContract.duration} months</p>
                        </div>
                      )}
                      {selectedContract.startDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Start Date:</span>
                          <p className="text-gray-900">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedContract.endDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">End Date:</span>
                          <p className="text-gray-900">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-500">Created:</span>
                        <p className="text-gray-900">{new Date(selectedContract.createdAt).toLocaleDateString()}</p>
                      </div>
                      {selectedContract.signedAt && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Signed:</span>
                          <p className="text-gray-900">{new Date(selectedContract.signedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents ({selectedContract.files.length})</h3>
                    {selectedContract.files.length > 0 ? (
                      <div className="space-y-3">
                        {selectedContract.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <a
                              href={file.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No documents attached</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Public Notes */}
                {selectedContract.notes && selectedContract.notes.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="space-y-3">
                      {selectedContract.notes.map((note, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                          <p className="text-gray-900">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Close
                  </button>
                  {selectedContract.files.length > 0 && (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium">
                      Download All Documents
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
