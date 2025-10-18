'use client';

import { useEffect, useState } from 'react';

interface PDFViewerProps {
  fileUrl: string;
  onLoadSuccess?: (data: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
}

export default function PDFViewer({ 
  fileUrl, 
  onLoadSuccess, 
  onLoadError
}: PDFViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && fileUrl) {
      // Simulate load success after a brief delay
      const timer = setTimeout(() => {
        setLoading(false);
        onLoadSuccess?.({ numPages: 1 });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mounted, fileUrl, onLoadSuccess]);

  const handleIframeError = () => {
    setError(true);
    setLoading(false);
    onLoadError?.(new Error('Failed to load PDF'));
  };

  if (!mounted) {
    return (
      <div className="p-4 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
        Loading PDF viewer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 text-center text-red-600 text-sm sm:text-base">
        Failed to load PDF.{' '}
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline text-blue-600"
        >
          Click here to open it directly.
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[60vh] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading document...</p>
          </div>
        </div>
      )}
      <iframe
        src={fileUrl}
        className="w-full h-full min-h-[60vh] border-0 rounded-lg shadow-xl"
        title="PDF Document"
        onLoad={() => setLoading(false)}
        onError={handleIframeError}
      />
    </div>
  );
}
