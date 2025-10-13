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
        title="WordPress Portfolio Birmingham | Custom WordPress Websites & Small Business Web Design"
        description="View our WordPress portfolio showcasing affordable WordPress web design projects in Birmingham. See how our WordPress developer creates custom WordPress websites and small business web design solutions for local Birmingham businesses."
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
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 opacity-90"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 dark:opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-blue/30 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 dark:opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-blue/30 to-transparent"></div>
          </div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-royal-blue/10 dark:bg-royal-blue/20 text-royal-blue dark:text-royal-blue-light rounded-full text-sm font-medium mb-6">Our Work</span>
            <h1 className="heading-1 text-gray-900 dark:text-white mb-6">
              WordPress <span className="text-royal-blue">Portfolio Birmingham</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Explore our collection of successful WordPress web design projects for Birmingham businesses. 
              Each project showcases our WordPress developer expertise in creating affordable, beautiful, and functional custom WordPress websites that drive results for local businesses.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                className="btn-primary" 
                onClick={() => {
                  document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Projects
              </button>
              <Link href="/contact" className="btn-outline">
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Portfolio Content */}
      <section id="portfolio-grid" className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Featured WordPress Web Design Birmingham Projects</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse through our diverse portfolio of web projects, from stunning business websites to complex e-commerce platforms.
            </p>
          </div>
          
          {/* Project Type Filter */}
          <div className="mb-12 flex justify-center">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl inline-flex flex-wrap justify-center gap-1">
              <button 
                onClick={() => filterProjects('All')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedProjectType === 'All' 
                    ? 'bg-royal-blue text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All Projects
              </button>
              {projectTypes.map((projectType: string, index: number) => (
                <button 
                  key={index}
                  onClick={() => filterProjects(projectType)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedProjectType === projectType 
                      ? 'bg-royal-blue text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {projectType}
                </button>
              ))}
            </div>
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
                <div key={project._id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                {/* Project Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  {project.thumbnailImage ? (
                    <div className="relative h-full w-full">
                      <Image 
                        src={project.thumbnailImage} 
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-royal-blue-light to-royal-blue flex items-center justify-center text-white text-lg font-medium">
                      {project.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Link 
                        href={`/portfolio/${project.slug}`}
                        className="bg-white text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium text-sm inline-flex items-center"
                      >
                        <span>View Project</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-royal-blue/10 dark:bg-royal-blue/20 text-royal-blue dark:text-royal-blue-light rounded-full text-xs font-medium">
                      {project.projectType}
                    </span>
                    {project.featured && (
                      <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-royal-blue dark:group-hover:text-royal-blue-light transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {project.clientName || 'Confidential'}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {project.completionDate ? 
                        new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 
                        'Recent'}
                    </div>
                  </div>
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-royal-blue relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-white/10 text-blue-100 rounded-full text-sm font-medium mb-6">Ready to Get Started?</span>
            <h2 className="heading-1 text-white mb-6">
              Let's Build Something <span className="text-blue-200">Amazing</span> Together
            </h2>
            <p className="text-lg text-blue-100 mb-10 leading-relaxed">
              Inspired by our work? We'd love to help bring your vision to life. From concept to launch, 
              we'll work closely with you to create a website that not only looks stunning but drives real results for your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="bg-white text-royal-blue font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Your Project
              </Link>
              <Link 
                href="/services" 
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-royal-blue transition-all duration-300 hover:scale-105"
              >
                View Our Services
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-200 text-sm">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-blue-200 text-sm">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
