"use client"

import React, { useState } from 'react';
import { AIService, EnhancedBlogGenerationRequest } from '@/services/ai-service';
import { BlogGenerationResponse } from '@/types/blog';

interface EnhancedAIBlogGeneratorProps {
  onBlogGenerated: (blog: BlogGenerationResponse) => void;
  onClose?: () => void;
}

export default function EnhancedAIBlogGenerator({ onBlogGenerated, onClose }: EnhancedAIBlogGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationRequest, setGenerationRequest] = useState<EnhancedBlogGenerationRequest>({
    topic: '',
    tone: 'professional',
    targetAudience: 'business owners',
    keyPoints: [],
    desiredLength: 'medium',

    outputFormat: 'html',
    customSpecs: {
      includeTableOfContents: true,
      includeCallToAction: true,
      includeAuthorBio: false,
      htmlStructure: 'article',
      includeCodeExamples: false,
      includeImages: true,
      seoOptimized: true
    }
  });
  const [keyPointInput, setKeyPointInput] = useState('');
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGenerationRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setGenerationRequest(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleCustomSpecChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setGenerationRequest(prev => ({
      ...prev,
      customSpecs: {
        ...prev.customSpecs,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const addKeyPoint = () => {
    if (keyPointInput.trim()) {
      setGenerationRequest(prev => ({
        ...prev,
        keyPoints: [...(prev.keyPoints || []), keyPointInput.trim()]
      }));
      setKeyPointInput('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setGenerationRequest(prev => ({
      ...prev,
      keyPoints: prev.keyPoints?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!generationRequest.topic.trim()) {
      setError('Please enter a topic for your blog post');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    try {
      // Make HTTP request to the blog generation API route
      const response = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generationRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const generatedBlog = await response.json();
      onBlogGenerated(generatedBlog);
    } catch (err) {
      console.error('Error generating blog:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate blog content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Blog Generator</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Generate professional HTML blog content with custom specifications
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Settings */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Settings</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Blog Topic *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    id="topic"
                    value={generationRequest.topic}
                    onChange={handleChange}
                    placeholder="e.g., Responsive Web Design Trends for 2025"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tone
                  </label>
                  <select
                    id="tone"
                    name="tone"
                    value={generationRequest.tone}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="technical">Technical</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="desiredLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Length
                  </label>
                  <select
                    id="desiredLength"
                    name="desiredLength"
                    value={generationRequest.desiredLength}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                  >
                    <option value="short">Short (300-500 words)</option>
                    <option value="medium">Medium (800-1200 words)</option>
                    <option value="long">Long (1500+ words)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    name="targetAudience"
                    id="targetAudience"
                    value={generationRequest.targetAudience}
                    onChange={handleChange}
                    placeholder="e.g., Small business owners, Web developers"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Points to Include
                  </label>
                  <div className="mt-1 flex">
                    <input
                      type="text"
                      value={keyPointInput}
                      onChange={(e) => setKeyPointInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyPoint())}
                      placeholder="Add a key point and press Enter"
                      className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={addKeyPoint}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-royal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
                    >
                      Add
                    </button>
                  </div>
                  
                  {generationRequest.keyPoints && generationRequest.keyPoints.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {generationRequest.keyPoints.map((point, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {point}
                          <button
                            type="button"
                            onClick={() => removeKeyPoint(index)}
                            className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 dark:hover:bg-blue-800"
                          >
                            <span className="sr-only">Remove key point</span>
                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Output Format & Basic Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Output Options</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Output Format
                  </label>
                  <select
                    id="outputFormat"
                    name="outputFormat"
                    value={generationRequest.outputFormat}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                  >
                    <option value="html">HTML (Recommended)</option>
                    <option value="markdown">Markdown</option>
                  </select>
                </div>


              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm font-medium text-royal-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg
                  className={`w-4 h-4 mr-2 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Advanced HTML Customization
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="htmlStructure" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        HTML Structure
                      </label>
                      <select
                        id="htmlStructure"
                        name="htmlStructure"
                        value={generationRequest.customSpecs?.htmlStructure}
                        onChange={handleCustomSpecChange}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue sm:text-sm"
                      >
                        <option value="article">Article</option>
                        <option value="blog">Blog Post</option>
                        <option value="guide">Guide</option>
                        <option value="tutorial">Tutorial</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="includeTableOfContents"
                          name="includeTableOfContents"
                          type="checkbox"
                          checked={generationRequest.customSpecs?.includeTableOfContents}
                          onChange={handleCustomSpecChange}
                          className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="includeTableOfContents" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Include Table of Contents
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="includeCallToAction"
                          name="includeCallToAction"
                          type="checkbox"
                          checked={generationRequest.customSpecs?.includeCallToAction}
                          onChange={handleCustomSpecChange}
                          className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="includeCallToAction" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Include Call-to-Action
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="includeAuthorBio"
                          name="includeAuthorBio"
                          type="checkbox"
                          checked={generationRequest.customSpecs?.includeAuthorBio}
                          onChange={handleCustomSpecChange}
                          className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="includeAuthorBio" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Include Author Bio
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="includeCodeExamples"
                          name="includeCodeExamples"
                          type="checkbox"
                          checked={generationRequest.customSpecs?.includeCodeExamples}
                          onChange={handleCustomSpecChange}
                          className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="includeCodeExamples" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Include Code Examples
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="seoOptimized"
                          name="seoOptimized"
                          type="checkbox"
                          checked={generationRequest.customSpecs?.seoOptimized}
                          onChange={handleCustomSpecChange}
                          className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="seoOptimized" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          SEO Optimized
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-royal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating HTML Blog...
                </>
              ) : (
                'Generate HTML Blog Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
