import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import { connectToDatabase } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';
import PortfolioGallery from '@/components/portfolio/portfolio-gallery';

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

// Generate static params for all portfolio items
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const portfolioItems = await Portfolio.find({}).select('slug').lean();
    
    return portfolioItems.map((item: any) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

type Props = {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectToDatabase();
    const item = await Portfolio.findOne({ slug: params.slug }).lean();
    
    if (!item) {
      return {
        title: 'Project Not Found | TsvWeb Portfolio',
        description: 'This portfolio project could not be found.',
        robots: { index: false, follow: true }
      };
    }
    
    const portfolioItem = JSON.parse(JSON.stringify(item));
    const description = portfolioItem.description?.substring(0, 160) || `${portfolioItem.title} - Professional web design and development project by TsvWeb Birmingham.`;
    const keywords = [
      portfolioItem.projectType,
      ...(portfolioItem.technologies || []),
      'web design Birmingham',
      'web development',
      'TsvWeb portfolio'
    ].filter(Boolean).join(', ');
    
    return {
      title: `${portfolioItem.title} | TsvWeb Portfolio`,
      description,
      keywords,
      alternates: {
        canonical: `https://tsvweb.co.uk/portfolio/${params.slug}`,
      },
      openGraph: {
        title: `${portfolioItem.title} | TsvWeb Portfolio`,
        description,
        url: `https://tsvweb.co.uk/portfolio/${params.slug}`,
        type: 'website',
        images: [{
          url: portfolioItem.thumbnailImage || portfolioItem.images?.[0] || 'https://tsvweb.co.uk/TsvWeb_Logo.png',
          width: 1200,
          height: 630,
          alt: `${portfolioItem.title} - Screenshot`
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${portfolioItem.title} | TsvWeb Portfolio`,
        description,
        images: [portfolioItem.thumbnailImage || portfolioItem.images?.[0] || 'https://tsvweb.co.uk/TsvWeb_Logo.png']
      }
    };
  } catch (error) {
    console.error('Error generating portfolio metadata:', error);
    return {
      title: 'Portfolio Project | TsvWeb',
      description: 'View our portfolio of professional web design and development projects.',
      robots: { index: false, follow: true }
    };
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = params;
  
  let portfolioItem: PortfolioItem | null = null;
  
  try {
    await connectToDatabase();
    const item = await Portfolio.findOne({ slug }).lean();
    
    if (!item) {
      notFound();
    }
    
    portfolioItem = JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    notFound();
  }
  
  if (!portfolioItem) {
    notFound();
  }
  
  const activeImage = portfolioItem.thumbnailImage || (portfolioItem.images && portfolioItem.images.length > 0 ? portfolioItem.images[0] : '');
  
  // CreativeWork Schema for portfolio project
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://tsvweb.co.uk/portfolio/${portfolioItem.slug}`,
    "name": portfolioItem.title,
    "description": portfolioItem.description,
    "creator": {
      "@type": "Organization",
      "name": "TsvWeb",
      "@id": "https://tsvweb.co.uk/#organization"
    },
    "dateCreated": portfolioItem.completionDate || portfolioItem.createdAt,
    "image": {
      "@type": "ImageObject",
      "url": portfolioItem.thumbnailImage || portfolioItem.images?.[0] || 'https://tsvweb.co.uk/TsvWeb_Logo.png',
      "width": 1200,
      "height": 630,
      "caption": portfolioItem.title
    },
    "url": portfolioItem.projectUrl || `https://tsvweb.co.uk/portfolio/${portfolioItem.slug}`,
    "keywords": [portfolioItem.projectType, ...(portfolioItem.technologies || [])].filter(Boolean).join(', '),
    "genre": portfolioItem.projectType,
    "about": {
      "@type": "Thing",
      "name": portfolioItem.projectType
    }
  };
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tsvweb.co.uk/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Portfolio",
        "item": "https://tsvweb.co.uk/portfolio"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": portfolioItem.title,
        "item": `https://tsvweb.co.uk/portfolio/${portfolioItem.slug}`
      }
    ]
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 md:py-32">
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

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-royal-blue to-blue-600">
          {portfolioItem.title}
        </h1>
        {portfolioItem.projectType && (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-royal-blue to-blue-600 text-white shadow-lg">
            {portfolioItem.projectType}
          </span>
        )}
      </div>

      {/* Portfolio Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <PortfolioGallery 
          portfolioItem={portfolioItem}
          activeImage={activeImage}
        />

        {/* Project Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-8 h-8 mr-3 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Overview
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            {portfolioItem.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-base md:text-lg">{paragraph}</p>
            ))}
          </div>
          
          <div className="border-t-2 border-gradient-to-r from-royal-blue to-blue-600 pt-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Project Details
            </h3>
            
            {portfolioItem.clientName && (
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <svg className="w-5 h-5 mr-3 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 font-medium mr-3">Client:</span>
                <span className="font-bold text-gray-900 dark:text-white">{portfolioItem.clientName}</span>
              </div>
            )}
            
            {portfolioItem.completionDate && (
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <svg className="w-5 h-5 mr-3 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 font-medium mr-3">Completed:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {format(new Date(portfolioItem.completionDate), 'MMMM yyyy')}
                </span>
              </div>
            )}
            
            {portfolioItem.technologies && portfolioItem.technologies.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-2 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Technologies Used:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolioItem.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gradient-to-r from-royal-blue to-blue-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {portfolioItem.projectUrl && (
              <div className="bg-gradient-to-r from-royal-blue to-blue-600 p-4 rounded-lg">
                <a 
                  href={portfolioItem.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-white hover:text-gray-100 transition-colors group"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="font-bold">Visit Live Website</span>
                  </div>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link 
              href="/portfolio"
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portfolio
            </Link>
            
            {portfolioItem.projectUrl && (
              <a 
                href={portfolioItem.projectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Live Project
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-royal-blue to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
        <p className="text-lg md:text-xl mb-8 text-blue-100">Let's create something amazing together!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-royal-blue font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get In Touch
          </Link>
          <Link 
            href="/portfolio"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-royal-blue transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View More Projects
          </Link>
        </div>
      </div>
    </div>
    <Footer />
  </main>
);
}
