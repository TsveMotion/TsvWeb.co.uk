'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure pdf.js worker (required by react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading agreement...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!agreement) return <div className="min-h-screen flex items-center justify-center">Agreement not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-1">{agreement.title}</h1>
        <p className="text-gray-600 mb-4">{agreement.description || 'Please review the agreement below and provide your signature to accept the terms.'}</p>

        {/* PDF Viewer */}
        {agreement.pdfPath ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Page {pageNumber} of {numPages || '?'}</div>
              <div className="space-x-2">
                <button onClick={() => setScale((s) => Math.max(0.6, s - 0.1))} className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">-</button>
                <span className="text-sm">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale((s) => Math.min(2, s + 0.1))} className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">+</button>
                <button onClick={() => setPageNumber((p) => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="ml-4 px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50">Prev</button>
                <button onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))} disabled={!numPages || pageNumber >= numPages} className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50">Next</button>
              </div>
            </div>
            <div className="border rounded flex justify-center bg-gray-50">
              <div className="overflow-auto w-full" style={{ maxHeight: 700 }}>
                <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(e: unknown) => console.error(e)} loading={<div className="p-6">Loading document...</div>}>
                  <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} className="mx-auto" />
                </Document>
              </div>
            </div>
            {/* Fallback open/download */}
            <div className="mt-2 text-right">
              <a href={fileUrl} target="_blank" className="text-sm text-blue-600 hover:text-blue-800">Open original PDF</a>
            </div>
          </div>
        ) : (
          <div className="border rounded p-4 mb-6 text-gray-500">No PDF uploaded for this agreement.</div>
        )}

        {/* Signing form */}
        {submitted || agreement.clientSignedAt ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 font-medium">Thank you. This agreement has been signed.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type your full legal name</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`${agreement.clientName}`}
                required
              />
            </div>
            <div className="flex items-start">
              <input id="accept" type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="accept" className="ml-2 text-sm text-gray-700">
                I agree that typing my name constitutes my electronic signature. I have read and accept the terms of this legally binding agreement and the Terms of Service.
              </label>
            </div>
            <button
              type="submit"
              disabled={!signerName || !accept || submitting}
              className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Signature'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
