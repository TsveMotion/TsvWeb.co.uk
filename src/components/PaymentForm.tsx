"use client"

import { useState } from 'react'
import { getStripe } from '@/lib/stripe'
import Link from 'next/link'

interface PaymentFormProps {
  invoiceId: string
  invoiceNumber: string
  total: number
  currency: string
  status: string
}

export default function PaymentForm({ invoiceId, invoiceNumber, total, currency, status }: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [error, setError] = useState('')

  // Don't render anything if invoiceId is not available
  if (!invoiceId) {
    return null
  }

  // Don't show payment form if already paid or cancelled
  if (status === 'paid') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Payment Completed</h3>
            <p className="text-green-700">This invoice has been paid in full.</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Invoice Cancelled</h3>
            <p className="text-red-700">This invoice has been cancelled and cannot be paid.</p>
          </div>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    if (!tosAccepted) {
      setError('You must accept the Terms of Service before proceeding with payment.')
      return
    }

    if (!invoiceId) {
      setError('Invoice data is not available. Please refresh the page and try again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check if Stripe is properly configured
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Payment system is not properly configured. Please contact support.')
      }

      // Create payment session
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId,
          tosAccepted: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        throw new Error(error.message)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        💳 Pay Invoice
      </h3>
      
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Invoice Number:</span>
          <span className="font-medium">{invoiceNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900">£{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Terms of Service Section */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Terms of Service</h4>
          <p className="text-blue-800 text-sm mb-3">
            Before proceeding with payment, you must read and accept our Terms of Service. 
            These terms outline important information about our services, payment policies, 
            refund procedures, and your rights as a customer.
          </p>
          <Link
            href="/terms&service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            📖 Read Terms of Service
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        {/* Terms Acceptance Checkbox */}
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              id="tos-acceptance"
              type="checkbox"
              checked={tosAccepted}
              onChange={(e) => setTosAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
          </div>
          <div className="text-sm">
            <label htmlFor="tos-acceptance" className="text-gray-700">
              <span className="text-red-500">*</span> I have read, understood, and agree to the{' '}
              <Link
                href="/terms&service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Terms of Service
              </Link>
              . I understand that by proceeding with payment, I am legally bound by these terms.
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading || !tosAccepted}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
          loading || !tosAccepted
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Pay Securely with Stripe
          </div>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <svg className="h-4 w-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure payment powered by Stripe
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      {/* Accepted Payment Methods */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 mb-2">Accepted payment methods:</p>
        <div className="flex justify-center space-x-2">
          <div className="text-xs bg-gray-100 px-2 py-1 rounded">💳 Visa</div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded">💳 Mastercard</div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded">💳 American Express</div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded">💳 Discover</div>
        </div>
      </div>
    </div>
  )
}
