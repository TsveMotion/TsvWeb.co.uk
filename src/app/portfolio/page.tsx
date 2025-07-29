"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'

interface PortfolioItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  projectType: string;
  technologies: string[];
  thumbnailImage: string;
  images: string[];
  clientName?: string;
  projectUrl?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

export default function PortfolioPage() {
  const [selectedProjectType, setSelectedProjectType] = useState('All');
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [allProjects, setAllProjects] = useState<PortfolioItem[]>([]);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/portfolio');
        
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        
        const result = await response.json();
        if (result.success && result.data) {
          setAllProjects(result.data);
          setProjects(result.data);
          
          // Extract unique project types
          const types = Array.from(new Set(result.data.map((item: PortfolioItem) => item.projectType))) as string[];
          setProjectTypes(types);
        } else {
          throw new Error(result.message || 'Failed to fetch portfolio data');
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolio();
  }, []);
  
  // Filter projects by project type
  const filterProjects = (projectType: string) => {
    setSelectedProjectType(projectType);
    if (projectType === 'All') {
      setProjects(allProjects);
    } else {
      setProjects(allProjects.filter((project: PortfolioItem) => project.projectType === projectType));
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title="Portfolio - Web Design & Development Projects | TsvWeb"
        description="Explore our portfolio of web design and development projects. See how we've helped businesses across various industries establish a strong online presence."
        canonical="https://tsvweb.com/portfolio"
        structuredData={{
          type: 'WebSite',
          data: {
            name: 'TsvWeb Portfolio',
            description: 'Web design and development portfolio showcasing our best work',
            url: 'https://tsvweb.com/portfolio',
            publisher: {
              '@type': 'Organization',
              name: 'TsvWeb',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tsvweb.com/images/logo.png'
              }
            }
          }
        }}
      />
      <Navbar />
      
      {/* Portfolio Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-1 text-gray-900 dark:text-white mb-6">
              Our <span className="text-royal-blue">Portfolio</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Explore our latest web design and development projects. 
              We've helped businesses across various industries establish a strong online presence.
            </p>
          </div>
        </div>
      </section>
      
      {/* Portfolio Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          {/* Project Type Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => filterProjects('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedProjectType === 'All' 
                  ? 'bg-royal-blue text-white' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {projectTypes.map((projectType: string, index: number) => (
              <button 
                key={index}
                onClick={() => filterProjects(projectType)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedProjectType === projectType 
                    ? 'bg-royal-blue text-white' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {projectType}
              </button>
            ))}
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
            </div>
          )}
          
          {/* Error State */}
          {!isLoading && error && (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">No portfolio items found. Check back soon!</p>
            </div>
          )}
          
          {/* Portfolio Grid */}
          {!isLoading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: PortfolioItem) => (
                <div key={project._id} className="group bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                {/* Project Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  {project.thumbnailImage ? (
                    <div className="relative h-full w-full">
                      <Image 
                        src={project.thumbnailImage} 
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-royal-blue-light to-royal-blue flex items-center justify-center text-white text-lg font-medium">
                      {project.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link 
                      href={`/portfolio/${project.slug}`}
                      className="bg-royal-blue text-white py-2 px-4 rounded-md hover:bg-royal-blue-dark transition-colors duration-300"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-royal-blue">{project.projectType}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {project.completionDate ? 
                        new Date(project.completionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
                        'Date not specified'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Client: {project.clientName}</span>
                    <Link 
                      href={`/portfolio/${project.slug}`}
                      className="text-royal-blue hover:text-royal-blue-dark font-medium text-sm flex items-center"
                    >
                      Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-royal-blue">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-2 text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
              Contact us today to discuss your project and find out how we can help your business succeed online.
            </p>
            <Link href="/contact" className="bg-white text-royal-blue font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors duration-300">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
