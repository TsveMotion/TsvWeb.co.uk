"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CustomerHeader from '@/components/customer/customer-header'

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
  signedBy?: string
  sentAt?: string
  signatureDetails?: {
    signerName?: string
    signedAt?: string
    ip?: string
    userAgent?: string
  }
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
  const [customer, setCustomer] = useState<{ name: string } | null>(null)
  const router = useRouter()

  // Calculate total monthly amount from all signed contracts
  const totalMonthlyAmount = contracts
    .filter(contract => contract.status === 'signed')
    .reduce((sum, contract) => sum + contract.amount, 0)

  useEffect(() => {
    fetchCustomer()
    fetchContracts()
  }, [currentPage, statusFilter])
  
  const fetchCustomer = async () => {
    try {
      const response = await fetch('/api/customer/auth/me')
      if (response.ok) {
        const data = await response.json()
        setCustomer(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error)
    }
  }

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
    <>
      <CustomerHeader customerName={customer?.name} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Contracts & Documents</h1>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">View and download your contracts, signed documents, and invoices</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/customer/dashboard')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-colors shadow-sm w-full md:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Monthly Payment Summary */}
        {totalMonthlyAmount > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-blue-100 text-xs md:text-sm font-medium mb-1">Total Monthly Payment</p>
                <p className="text-3xl md:text-4xl font-bold">GBP {totalMonthlyAmount.toLocaleString()}<span className="text-lg md:text-xl font-normal text-blue-100">/month</span></p>
              </div>
              <div className="md:text-right">
                <div className="flex items-center gap-2 md:justify-end mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-blue-100 text-xs md:text-sm font-medium">Payment Due</p>
                </div>
                <p className="text-xl md:text-2xl font-bold">1st of every month</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <div className="flex-1 sm:flex-initial">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm md:text-base sm:min-w-[180px]"
                >
                  <option value="">All Contracts</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="signed">Signed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              {statusFilter && (
                <button
                  onClick={() => {
                    setStatusFilter('')
                    setCurrentPage(1)
                  }}
                  className="sm:mt-7 px-4 py-2 md:py-2.5 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="text-left md:text-right">
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">{contracts.length}</span> contract{contracts.length !== 1 ? 's' : ''} found
              </div>
              {totalMonthlyAmount > 0 && (
                <div className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                  Total: GBP {totalMonthlyAmount.toLocaleString()}/month
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contracts Grid */}
        {contracts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contracts.map((contract) => (
                <div key={contract._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{contract.title}</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    
                    {contract.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{contract.description}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                        {getTypeBadge(contract.contractType)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {contract.currency} {contract.amount.toLocaleString()}/month
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Files:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{contract.files.length} documents</span>
                      </div>
                      {contract.signedAt && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Signed:</span>
                          <span className="text-sm text-gray-900 dark:text-white">
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
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm md:text-base rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm md:text-base rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm md:text-base rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Contracts Yet</h2>
            <p className="text-gray-600 dark:text-gray-400">Your contracts and documents will appear here once they are available.</p>
          </div>
        )}

        {/* Contract Detail Modal */}
        {showDetailModal && selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 my-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedContract.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedContract.description}</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type:</span>
                        <div className="mt-1">{getTypeBadge(selectedContract.contractType)}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount:</span>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedContract.currency} {selectedContract.amount.toLocaleString()}/month
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Due:</span>
                        <p className="text-gray-900 dark:text-white">1st of every month</p>
                      </div>
                      {selectedContract.duration && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration:</span>
                          <p className="text-gray-900 dark:text-white">{selectedContract.duration} months</p>
                        </div>
                      )}
                      {selectedContract.startDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date:</span>
                          <p className="text-gray-900 dark:text-white">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedContract.endDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date:</span>
                          <p className="text-gray-900 dark:text-white">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created:</span>
                        <p className="text-gray-900 dark:text-white">{new Date(selectedContract.createdAt).toLocaleDateString()}</p>
                      </div>
                      {selectedContract.signedAt && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Signed:</span>
                          <p className="text-gray-900 dark:text-white">{new Date(selectedContract.signedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      )}
                      {selectedContract.signedBy && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Signed By:</span>
                          <p className="text-gray-900 dark:text-white">{selectedContract.signedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents ({selectedContract.files.length})</h3>
                    {selectedContract.files.length > 0 ? (
                      <div className="space-y-3">
                        {selectedContract.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.originalName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <a
                              href={file.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No documents attached</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature Authentication Details */}
                {selectedContract.status === 'signed' && selectedContract.signatureDetails && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Signature Authentication
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase">Signer Name</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{selectedContract.signatureDetails.signerName || selectedContract.signedBy || 'Unknown'}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase">Date & Time</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedContract.signatureDetails.signedAt 
                              ? new Date(selectedContract.signatureDetails.signedAt).toLocaleString('en-GB', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })
                              : new Date(selectedContract.signedAt!).toLocaleString('en-GB', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                          </p>
                        </div>
                        {selectedContract.signatureDetails.ip && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase">IP Address</span>
                            </div>
                            <p className="text-sm font-mono font-semibold text-gray-900">{selectedContract.signatureDetails.ip}</p>
                          </div>
                        )}
                        {selectedContract.signatureDetails.userAgent && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase">Device / Browser</span>
                            </div>
                            <p className="text-xs text-gray-700 break-all">{selectedContract.signatureDetails.userAgent}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-xs text-green-800 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          This signature is legally binding and has been recorded for verification purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
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
    </>
  )
}
