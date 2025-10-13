"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PaymentForm from '@/components/PaymentForm'
import Image from 'next/image'

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  type: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerPhone?: string;
  issueDate: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
}

export default function InvoiceViewPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoice/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setInvoice(data)
        } else {
          setError('Invoice not found')
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
        setError('Failed to load invoice')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInvoice()
    }
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'viewed': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading invoice...</div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600">{error || 'The requested invoice could not be found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Actions */}
        <div className="flex justify-end mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Print Invoice
          </button>
        </div>

        {/* Invoice */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <Image 
                  src="/TsvWeb_Logo.png" 
                  alt="TsvWeb Logo" 
                  width={180} 
                  height={60}
                  className="mb-4"
                  priority
                />
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600 mt-1">#{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status.toUpperCase()}
                </span>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">TsvWeb Ltd</p>
                  <p>United Kingdom</p>
                  <p>hello@tsvweb.com</p>
                  <p>www.tsvweb.com</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">{invoice.customerName}</p>
                  <p>{invoice.customerEmail}</p>
                  {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
                  {invoice.customerAddress && (
                    <div className="mt-2 whitespace-pre-line">{invoice.customerAddress}</div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Details:</h3>
                <div className="text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Issue Date:</span>
                    <span>{new Date(invoice.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>{new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span>GBP (£)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          £{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          £{item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">£{invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT ({invoice.taxRate}%):</span>
                    <span className="text-gray-900">£{invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">£{invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {invoice.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                      <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
                    </div>
                  )}
                  {invoice.terms && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                      <p className="text-gray-600 whitespace-pre-line">{invoice.terms}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Section */}
            {invoice && (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <PaymentForm
                  invoiceId={invoice._id}
                  invoiceNumber={invoice.invoiceNumber}
                  total={invoice.total}
                  currency={invoice.currency}
                  status={invoice.status}
                />
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">
                  Thank you for your business!
                </p>
                <p className="text-gray-400 text-xs">
                  TsvWeb Ltd • United Kingdom • Registered in England and Wales
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  For any queries, please contact us at hello@tsvweb.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
