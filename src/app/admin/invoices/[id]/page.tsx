"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { isClientAuthenticated } from '@/lib/auth-client'

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  type: 'invoice' | 'quote';
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  status: string;
  dueDate?: string;
  issueDate: string;
  notes?: string;
  terms?: string;
  viewCount: number;
  emailSentAt?: string;
}

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  
  const [formData, setFormData] = useState({
    type: 'invoice' as 'invoice' | 'quote',
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    customerPhone: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[],
    taxRate: 20,
    currency: 'GBP',
    dueDate: '',
    issueDate: '',
    notes: '',
    terms: '',
    status: 'draft'
  })

  // Check authentication
  useEffect(() => {
    const authenticated = isClientAuthenticated()
    if (!authenticated) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  // Fetch invoice data
  useEffect(() => {
    if (!isAuthenticated || !params.id) return

    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/admin/invoices/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setInvoice(data)
          
          // Populate form with existing data
          setFormData({
            type: data.type,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerAddress: data.customerAddress || '',
            customerPhone: data.customerPhone || '',
            items: data.items,
            taxRate: data.taxRate,
            currency: data.currency,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '',
            issueDate: new Date(data.issueDate).toISOString().split('T')[0],
            notes: data.notes || '',
            terms: data.terms || '',
            status: data.status
          })
        } else {
          alert('Invoice not found')
          router.push('/admin/invoices')
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
        alert('Failed to load invoice')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoice()
  }, [isAuthenticated, params.id, router])

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = calculateItemTotal(newItems[index].quantity, newItems[index].unitPrice)
    }
    
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: newItems })
    }
  }

  const markAsPaid = async () => {
    if (!invoice) return
    
    try {
      const response = await fetch(`/api/admin/invoices/${invoice._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'paid',
          paidAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('Invoice marked as paid!')
        router.push('/admin/invoices')
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const sendEmail = async () => {
    if (!invoice) return
    
    try {
      const response = await fetch(`/api/admin/invoices/${invoice._id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customMessage: '' })
      })

      if (response.ok) {
        alert('Email sent successfully!')
        window.location.reload()
      } else {
        alert('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/invoices/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/invoices')
      } else {
        alert('Failed to update ' + formData.type)
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
      alert('Failed to update ' + formData.type)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!invoice) return
    
    if (!confirm(`Are you sure you want to delete this ${invoice.type}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/invoices/${invoice._id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/invoices')
      } else {
        alert('Failed to delete ' + invoice.type)
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Failed to delete ' + invoice.type)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !invoice) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit {invoice.type === 'invoice' ? 'Invoice' : 'Quote'} #{invoice.invoiceNumber}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Status: <span className="font-medium">{invoice.status}</span>
                {invoice.viewCount > 0 && (
                  <span className="ml-4">Views: {invoice.viewCount}</span>
                )}
              </p>
            </div>
            <div className="flex space-x-3">
              <a
                href={`/${invoice.type}/${invoice._id}`}
                target="_blank"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Preview
              </a>
              <button
                onClick={sendEmail}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Send Email
              </button>
              {invoice.type === 'invoice' && invoice.status !== 'paid' && (
                <button
                  onClick={markAsPaid}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Mark as Paid
                </button>
              )}
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {invoice.type === 'invoice' ? 'Invoice' : 'Quote'} Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              {invoice.type === 'invoice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  {invoice.type === 'invoice' && (
                    <>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </>
                  )}
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total
                      </label>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                        {item.total.toFixed(2)}
                      </div>
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="ml-2 text-red-600 hover:text-red-800 p-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.currency} {calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.currency} {calculateTax().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-600 pt-2">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.currency} {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Any additional notes for the customer..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Payment terms, conditions, etc..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : `Update ${invoice.type === 'invoice' ? 'Invoice' : 'Quote'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
