'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import PageSEO from '@/components/seo/page-seo';

// Define the Portfolio item type
interface PortfolioItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  clientName?: string;
  projectType: string;
  technologies: string[];
  images: string[];
  thumbnailImage: string;
  projectUrl?: string;
  featured: boolean;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/portfolio/${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio item: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setPortfolioItem(data.data);
          setActiveImage(data.data.thumbnailImage || (data.data.images && data.data.images.length > 0 ? data.data.images[0] : ''));
        } else {
          throw new Error(data.message || 'Failed to fetch portfolio item');
        }
      } catch (error: any) {
        console.error('Error fetching portfolio item:', error);
        setError(error.message || 'Failed to load portfolio item. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPortfolioItem();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
          <div className="mt-6">
            <Link href="/portfolio" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue">
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioItem) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Portfolio Item Found</h3>
          <p className="mt-1 text-sm text-gray-500">The portfolio item you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <Link href="/portfolio" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue">
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title={`${portfolioItem.title} - Portfolio | TsvWeb`}
        description={portfolioItem.description.substring(0, 160)}
        canonical={`https://tsvweb.com/portfolio/${portfolioItem.slug}`}
        structuredData={{
          type: 'WebSite',
          data: {
            name: portfolioItem.title,
            description: portfolioItem.description.substring(0, 160),
            url: `https://tsvweb.com/portfolio/${portfolioItem.slug}`,
          }
        }}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-32">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-royal-blue">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link href="/portfolio" className="ml-1 text-sm font-medium text-gray-700 hover:text-royal-blue md:ml-2">Portfolio</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{portfolioItem.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Portfolio Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-md">
            {activeImage ? (
              <Image 
                src={activeImage} 
                alt={portfolioItem.title} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-royal-blue-light to-royal-blue flex items-center justify-center text-white text-lg font-medium">
                {portfolioItem.title}
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Always include thumbnail image in the gallery if it exists */}
            {portfolioItem.thumbnailImage && (
              <button 
                onClick={() => setActiveImage(portfolioItem.thumbnailImage)}
                className={`relative h-20 w-20 overflow-hidden rounded-md transition-all ${activeImage === portfolioItem.thumbnailImage ? 'ring-2 ring-royal-blue scale-105' : 'hover:scale-105'}`}
              >
                <Image 
                  src={portfolioItem.thumbnailImage} 
                  alt={`${portfolioItem.title} - Thumbnail`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            )}
            
            {/* Show all other project images */}
            {portfolioItem.images && portfolioItem.images.length > 0 && 
              portfolioItem.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`relative h-20 w-20 overflow-hidden rounded-md transition-all ${activeImage === image ? 'ring-2 ring-royal-blue scale-105' : 'hover:scale-105'}`}
                >
                  <Image 
                    src={image} 
                    alt={`${portfolioItem.title} - Image ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))
            }
          </div>
        </div>

        {/* Project Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{portfolioItem.title}</h1>
          
          {portfolioItem.projectType && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-royal-blue-light text-royal-blue dark:bg-blue-900 dark:text-blue-100">
                {portfolioItem.projectType}
              </span>
            </div>
          )}
          
          <div className="prose prose-lg max-w-none mb-8 text-gray-700 dark:text-gray-300">
            {portfolioItem.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            {portfolioItem.clientName && (
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Client:</span>
                <span className="font-medium text-gray-900 dark:text-white">{portfolioItem.clientName}</span>
              </div>
            )}
            
            {portfolioItem.completionDate && (
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Completed:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(portfolioItem.completionDate), 'MMMM yyyy')}
                </span>
              </div>
            )}
            
            {portfolioItem.technologies && portfolioItem.technologies.length > 0 && (
              <div className="flex items-start">
                <span className="text-gray-500 dark:text-gray-400 w-32 pt-1 font-medium">Technologies:</span>
                <div className="flex flex-wrap gap-2">
                  {portfolioItem.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {portfolioItem.projectUrl && (
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Project URL:</span>
                <a 
                  href={portfolioItem.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-royal-blue hover:underline flex items-center"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <Link 
              href="/portfolio"
              className="inline-flex items-center text-royal-blue hover:text-royal-blue-dark transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portfolio
            </Link>
            
            {portfolioItem.projectUrl && (
              <a 
                href={portfolioItem.projectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue transition-colors"
              >
                View Live Project
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
);
}
