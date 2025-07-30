"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import withAdminAuth from '@/components/admin/with-admin-auth'

interface Contract {
  _id: string
  title: string
  description?: string
  contractType: string
  status: string
  userId: string
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
    uploadedBy: string
  }>
  emailsSent: Array<{
    sentAt: string
    sentBy: string
    recipient: string
    subject: string
    status: string
  }>
  notes: Array<{
    content: string
    createdBy: string
    createdAt: string
    isPrivate: boolean
  }>
  signedAt?: string
  sentAt?: string
  createdAt: string
}

function ContractDetail() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string

  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    includeAttachments: true
  })
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    if (contractId) {
      fetchContract()
    }
  }, [contractId])

  const fetchContract = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/contracts/${contractId}`)
      const data = await response.json()
      
      if (data.success) {
        setContract(data.contract)
        if (!emailData.subject && data.contract) {
          setEmailData(prev => ({
            ...prev,
            subject: `Contract: ${data.contract.title}`,
            message: `Dear ${data.contract.clientName},\n\nPlease find attached the contract for your review and signature.\n\nBest regards,\nTsvWeb Team`
          }))
        }
      } else {
        setError(data.error || 'Contract not found')
      }
    } catch (error) {
      console.error('Error fetching contract:', error)
      setError('Failed to fetch contract')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      Array.from(selectedFiles).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch(`/api/admin/contracts/${contractId}/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`${data.files.length} file(s) uploaded successfully`)
        setSelectedFiles(null)
        fetchContract()
        const fileInput = document.getElementById('fileInput') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      setError('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingEmail(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/contracts/${contractId}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Contract sent successfully')
        setShowEmailModal(false)
        fetchContract()
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setError('Failed to send contract email')
    } finally {
      setSendingEmail(false)
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contract Not Found</h1>
          <button
            onClick={() => router.push('/admin/contracts')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Contracts
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <button
            onClick={() => router.push('/admin/contracts')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Contracts
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{contract.title}</h1>
          <p className="text-gray-600 mt-2">{contract.description}</p>
        </div>
        <div className="flex space-x-3">
          {getStatusBadge(contract.status)}
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Send Email
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contract Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contract Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Contract Type</label>
                <p className="text-gray-900">{contract.contractType.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-900 font-semibold">
                  {contract.currency} {contract.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Client Name</label>
                <p className="text-gray-900">{contract.clientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Client Email</label>
                <p className="text-gray-900">{contract.clientEmail}</p>
              </div>
              {contract.clientCompany && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Company</label>
                  <p className="text-gray-900">{contract.clientCompany}</p>
                </div>
              )}
              {contract.duration && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">{contract.duration} months</p>
                </div>
              )}
            </div>
          </div>

          {/* File Management */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
            
            <form onSubmit={handleFileUpload} className="mb-6">
              <div className="flex items-center space-x-4">
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  type="submit"
                  disabled={!selectedFiles || uploading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium"
                >
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX (Max 10MB each)
              </p>
            </form>

            {contract.files.length > 0 ? (
              <div className="space-y-3">
                {contract.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={file.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Send to Client
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
                Generate E-Signature
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium">
                Download PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email History</h3>
            {contract.emailsSent.length > 0 ? (
              <div className="space-y-3">
                {contract.emailsSent.slice(0, 5).map((email, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{email.subject}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        email.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        email.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {email.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">To: {email.recipient}</p>
                    <p className="text-gray-400 text-xs">{new Date(email.sentAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No emails sent yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Send Contract via Email</h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To: {contract.clientEmail}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={8}
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeAttachments"
                    checked={emailData.includeAttachments}
                    onChange={(e) => setEmailData({ ...emailData, includeAttachments: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeAttachments" className="ml-2 block text-sm text-gray-900">
                    Include attachments ({contract.files.length} files)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium"
                  >
                    {sendingEmail ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default withAdminAuth(ContractDetail)
