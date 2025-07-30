"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function TermsOfServicePage() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6 text-gray-700">
              By accessing and using our services, making payments through our platform, or engaging with our invoicing system, 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, 
              please do not use our services or make any payments.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Payment Terms</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Payment Processing:</strong> All payments are processed securely through Stripe, a PCI-compliant payment processor.</p>
              <p><strong>Payment Methods:</strong> We accept major credit cards, debit cards, and other payment methods supported by Stripe.</p>
              <p><strong>Currency:</strong> All payments are processed in the currency specified on your invoice.</p>
              <p><strong>Payment Confirmation:</strong> You will receive email confirmation once your payment is successfully processed.</p>
              <p><strong>Failed Payments:</strong> If a payment fails, you will be notified and given the opportunity to retry with a different payment method.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Delivery</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Service Commencement:</strong> Services will commence according to the timeline specified in your invoice or quote.</p>
              <p><strong>Project Scope:</strong> The scope of work is clearly defined in your invoice/quote and any additional work may incur extra charges.</p>
              <p><strong>Deliverables:</strong> All deliverables will be provided according to the specifications outlined in your agreement.</p>
              <p><strong>Revisions:</strong> A reasonable number of revisions are included as specified in your project agreement.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Policy</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Refund Eligibility:</strong> Refunds may be considered on a case-by-case basis for services not yet delivered.</p>
              <p><strong>Refund Process:</strong> Refund requests must be submitted in writing within 7 days of payment.</p>
              <p><strong>Processing Time:</strong> Approved refunds will be processed within 5-10 business days.</p>
              <p><strong>Partial Refunds:</strong> For partially completed work, refunds will be calculated based on work completed.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Ownership:</strong> Upon full payment, you will own the final deliverables as specified in your agreement.</p>
              <p><strong>Third-Party Assets:</strong> Any third-party assets used will be properly licensed for your use.</p>
              <p><strong>Source Files:</strong> Source files and working materials may be provided as specified in your project agreement.</p>
              <p><strong>Portfolio Usage:</strong> We reserve the right to showcase completed work in our portfolio unless otherwise agreed.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Liability and Warranties</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Service Quality:</strong> We strive to provide high-quality services but cannot guarantee specific outcomes.</p>
              <p><strong>Limitation of Liability:</strong> Our liability is limited to the amount paid for the specific service in question.</p>
              <p><strong>Force Majeure:</strong> We are not liable for delays caused by circumstances beyond our reasonable control.</p>
              <p><strong>Data Security:</strong> While we implement security measures, you are responsible for backing up your own data.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Data Collection:</strong> We collect only the information necessary to provide our services and process payments.</p>
              <p><strong>Data Usage:</strong> Your personal information will not be shared with third parties except as necessary for service delivery.</p>
              <p><strong>Payment Data:</strong> Payment information is processed securely by Stripe and is not stored on our servers.</p>
              <p><strong>Communication:</strong> We may contact you regarding your project, payments, or important service updates.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Dispute Resolution</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Communication First:</strong> We encourage direct communication to resolve any issues or concerns.</p>
              <p><strong>Mediation:</strong> Disputes will first be addressed through good-faith negotiation and mediation if necessary.</p>
              <p><strong>Jurisdiction:</strong> These terms are governed by the laws of the jurisdiction where our business is registered.</p>
              <p><strong>Severability:</strong> If any part of these terms is found unenforceable, the remainder will continue to apply.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p><strong>Updates:</strong> We may update these Terms of Service from time to time to reflect changes in our practices or legal requirements.</p>
              <p><strong>Notification:</strong> Significant changes will be communicated via email or prominent notice on our website.</p>
              <p><strong>Continued Use:</strong> Your continued use of our services after changes constitutes acceptance of the updated terms.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <div className="mb-6 text-gray-700 space-y-3">
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <p><strong>Email:</strong> legal@yourdomain.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
              <p><strong>Phone:</strong> [Your Business Phone]</p>
            </div>

            {/* Agreement Section */}
            <div className="mt-12 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Agreement Acknowledgment
              </h3>
              <p className="text-blue-800 mb-4">
                By proceeding with payment for any invoice or service, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service.
              </p>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-800 font-medium">
                  These terms are legally binding upon payment acceptance
                </span>
              </div>
            </div>

            {/* Print Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => window.print()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium print:hidden"
              >
                Print Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
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
