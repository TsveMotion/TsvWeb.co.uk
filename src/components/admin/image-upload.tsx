'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({ 
  onUploadComplete, 
  currentImage = '', 
  label = 'Image',
  required = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 5MB.');
      return;
    }

    // Clear previous errors
    setUploadError('');
    
    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Upload file
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
      
      // Call the callback with the uploaded image URL
      onUploadComplete(result.data.url);
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
      // Reset preview if upload failed
      if (currentImage) {
        setPreviewUrl(currentImage);
      } else {
        setPreviewUrl('');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex items-center space-x-4">
        {/* Preview */}
        <div className="relative h-24 w-24 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
          {previewUrl ? (
            <Image 
              src={previewUrl} 
              alt="Image preview" 
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-400">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Upload controls */}
        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Image
              </>
            )}
          </button>
          
          {previewUrl && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl('');
                onUploadComplete('');
              }}
              className="ml-2 inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-red-500 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {uploadError && (
        <p className="text-sm text-red-500">{uploadError}</p>
      )}
      
      {previewUrl && (
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {previewUrl}
        </p>
      )}
    </div>
  );
}
