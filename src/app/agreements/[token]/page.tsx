'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PDF viewer to avoid SSR and webpack issues
const PDFViewer = dynamic(
  () => import('@/components/PDFViewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-4 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
        Loading PDF viewer...
      </div>
    )
  }
);

export default function AgreementSigningPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreement, setAgreement] = useState<any>(null);
  const [signerName, setSignerName] = useState('');
  const [accept, setAccept] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // PDF UI state
  const [pdfLoaded, setPdfLoaded] = useState(false);

  const fileUrl = useMemo(() => agreement?.pdfPath || '', [agreement]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/agreements/${token}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load agreement');
        const data = await res.json();
        setAgreement(data.agreement);
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName || !accept) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/agreements/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerName, accept }),
      });
      if (!res.ok) throw new Error('Failed to sign');
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Failed to sign');
    } finally {
      setSubmitting(false);
    }
  };

  const onDocumentLoadSuccess = () => {
    setPdfLoaded(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading agreement...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!agreement) return <div className="min-h-screen flex items-center justify-center">Agreement not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{agreement.title}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">From {agreement.companyName || 'TsvWeb'}</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-3">{agreement.description || 'Please review the agreement below and provide your signature to accept the terms.'}</p>
            </div>
            <div className="w-full sm:w-auto sm:ml-4 flex sm:block justify-start">
              <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${
                agreement.status === 'signed' ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' :
                agreement.status === 'sent' ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-600/20' :
                'bg-gray-100 text-gray-700'
              }`}>
                {agreement.status === 'signed' && '✓ '}
                {agreement.status}
              </span>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        {agreement.pdfPath ? (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-4 sm:mb-6 border border-gray-100">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Agreement Document</span>
                </div>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  <span className="hidden sm:inline">Open in New Tab</span>
                  <span className="sm:hidden">Open</span>
                </a>
              </div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-4">
              <PDFViewer
                fileUrl={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(e: Error) => {
                  console.error('PDF Load Error:', e);
                  setError('Failed to load PDF. Please try opening it in a new tab.');
                }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-center">
            <svg className="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-yellow-800 font-medium">No PDF uploaded for this agreement</p>
          </div>
        )}

        {/* Signing form */}
        {submitted || agreement.clientSignedAt ? (
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-8 border border-green-200">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Agreement Signed</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">Thank you! This agreement has been successfully signed and all parties have been notified.</p>
              {agreement.clientSignedAt && (
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-700">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="break-words">Signed on {new Date(agreement.clientSignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-8 border border-gray-100">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Sign Agreement</h2>
              <p className="text-xs sm:text-sm text-gray-600">Please review the document above and provide your electronic signature below to proceed.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Legal Name *</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder={`${agreement.clientName}`}
                  required
                />
                <p className="mt-1.5 text-xs text-gray-500">Type your full legal name as it appears on official documents</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <input 
                    id="accept" 
                    type="checkbox" 
                    checked={accept} 
                    onChange={(e) => setAccept(e.target.checked)} 
                    className="mt-0.5 sm:mt-1 h-5 w-5 flex-shrink-0 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 touch-manipulation" 
                  />
                  <label htmlFor="accept" className="text-xs sm:text-sm text-gray-700 leading-relaxed cursor-pointer">
                    I agree that typing my name above constitutes my legally binding electronic signature. I have carefully read and accept all terms of this agreement and acknowledge that this is a legally binding contract.
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center sm:text-left">Your signature will be timestamped and recorded</p>
                <button
                  type="submit"
                  disabled={!signerName || !accept || submitting}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all touch-manipulation w-full sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Submit Signature
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
