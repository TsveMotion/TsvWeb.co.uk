'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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

interface PortfolioGalleryProps {
  portfolioItem: PortfolioItem;
  activeImage: string;
}

export default function PortfolioGallery({ portfolioItem, activeImage: initialActiveImage }: PortfolioGalleryProps) {
  const [activeImage, setActiveImage] = useState(initialActiveImage);

  return (
    <div className="space-y-6">
      <div className="relative h-[450px] md:h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 transform hover:scale-[1.02] transition-transform duration-300">
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
          <div className="absolute inset-0 bg-gradient-to-br from-royal-blue via-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold p-8 text-center">
            {portfolioItem.title}
          </div>
        )}
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {/* Always include thumbnail image in the gallery if it exists */}
        {portfolioItem.thumbnailImage && (
          <button 
            onClick={() => setActiveImage(portfolioItem.thumbnailImage)}
            className={`relative h-24 w-24 overflow-hidden rounded-xl transition-all duration-300 ${
              activeImage === portfolioItem.thumbnailImage 
                ? 'ring-4 ring-royal-blue scale-110 shadow-xl' 
                : 'hover:scale-105 hover:shadow-lg ring-2 ring-gray-200 dark:ring-gray-700'
            }`}
          >
            <Image 
              src={portfolioItem.thumbnailImage} 
              alt={`${portfolioItem.title} - Thumbnail`}
              fill
              sizes="96px"
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
              className={`relative h-24 w-24 overflow-hidden rounded-xl transition-all duration-300 ${
                activeImage === image 
                  ? 'ring-4 ring-royal-blue scale-110 shadow-xl' 
                  : 'hover:scale-105 hover:shadow-lg ring-2 ring-gray-200 dark:ring-gray-700'
              }`}
            >
              <Image 
                src={image} 
                alt={`${portfolioItem.title} - Image ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))
        }
      </div>
    </div>
  );
}
