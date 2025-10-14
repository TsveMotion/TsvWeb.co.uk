"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'

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
      <Navbar />
      
      {/* Portfolio Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
                🎨 Our Work
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Birmingham <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Portfolio</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Stunning websites that drive real results for Birmingham businesses. <br className="hidden md:block" />
              From WordPress to custom development, see what we've built.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg px-10 py-4 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
                onClick={() => {
                  document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Projects →
              </button>
              <Link href="/contact" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 font-black text-lg px-10 py-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Start Your Project
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">8+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
              </div>
            </motion.div>
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
