"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface PortfolioItem {
  _id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  clientName?: string
  projectType: string
  technologies: string[]
  images: string[]
  thumbnailImage: string
  projectUrl?: string
  featured: boolean
  completionDate?: string
  createdAt: string
  updatedAt: string
}

export default function AdminPortfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch('/api/admin/portfolio')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio items: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setPortfolioItems(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch portfolio items')
        }
      } catch (error: any) {
        console.error('Error fetching portfolio items:', error)
        setError(error.message || 'Failed to load portfolio items. Please try again later.')
        setPortfolioItems([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPortfolioItems()
  }, [])

  // Extract unique project types for filtering
  const projectTypes = useMemo(() => {
    const typeSet = new Set<string>()
    portfolioItems.forEach(item => typeSet.add(item.projectType))
    return Array.from(typeSet)
  }, [portfolioItems])

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter portfolio items based on search term, project type, and featured status
  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.clientName && item.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesProjectType = projectTypeFilter === 'all' || item.projectType.toLowerCase() === projectTypeFilter.toLowerCase()
    
    const matchesFeatured = featuredFilter === 'all' || 
      (featuredFilter === 'featured' && item.featured) ||
      (featuredFilter === 'not-featured' && !item.featured)
    
    return matchesSearch && matchesProjectType && matchesFeatured
  })

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      // Optimistically update the UI
      setPortfolioItems(portfolioItems.map(item => 
        item._id === id ? { ...item, featured: !featured } : item
      ))
      
      // Make the actual API call
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !featured }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update portfolio item: ${response.status}`)
      }
      
      // No need to update state again as we already did it optimistically
    } catch (error: any) {
      console.error('Error updating portfolio item:', error)
      // Revert the optimistic update on error
      setPortfolioItems(portfolioItems.map(item => 
        item._id === id ? { ...item, featured: featured } : item
      ))
      setError(`Failed to update item: ${error.message}`)
      setTimeout(() => setError(''), 3000) // Clear error after 3 seconds
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        // Optimistically update the UI
        const originalItems = [...portfolioItems]
        setPortfolioItems(portfolioItems.filter(item => item._id !== id))
        
        // Make the actual API call
        const response = await fetch(`/api/admin/portfolio/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error(`Failed to delete portfolio item: ${response.status}`)
        }
        
        // No need to update state again as we already did it optimistically
      } catch (error: any) {
        console.error('Error deleting portfolio item:', error)
        // Revert the optimistic update on error
        setPortfolioItems([...portfolioItems]) // Force a refresh
        setError(`Failed to delete item: ${error.message}`)
        setTimeout(() => setError(''), 3000) // Clear error after 3 seconds
      }
    }
  }

  return (
    <>
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Portfolio Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your portfolio projects and showcase your work
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Portfolio Item
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Projects</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{portfolioItems.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Featured</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {portfolioItems.filter(item => item.featured).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Categories</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{projectTypes.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Filtered Results</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{filteredItems.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-5 sm:p-6 mb-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Projects
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Search by title, client, tech..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {projectTypes.map((type: string, index: number) => (
                <option key={index} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="featured" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Status
            </label>
            <select
              id="featured"
              name="featured"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-64"></div>
        ) : error ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error</h3>
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setError('');
                  const fetchPortfolioItems = async () => {
                    setIsLoading(true);
                    setError('');
                    try {
                      const response = await fetch('/api/admin/portfolio');
                      
                      if (!response.ok) {
                        throw new Error(`Failed to fetch portfolio items: ${response.status}`);
                      }
                      
                      const data = await response.json();
                      
                      if (data.success && data.data) {
                        setPortfolioItems(data.data);
                      } else {
                        throw new Error(data.message || 'Failed to fetch portfolio items');
                      }
                    } catch (error: any) {
                      console.error('Error fetching portfolio items:', error);
                      setError(error.message || 'Failed to load portfolio items. Please try again later.');
                      setPortfolioItems([]);
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  fetchPortfolioItems();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No portfolio items found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || projectTypeFilter !== 'all' ? 'Try adjusting your search or filter' : 'Get started by creating a new portfolio item'}
            </p>
            {!searchTerm && projectTypeFilter === 'all' && (
              <div className="mt-6">
                <Link
                  href="/admin/portfolio/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-royal-blue hover:bg-royal-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Portfolio Item
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={item.thumbnailImage || '/images/placeholder.jpg'} 
                            alt={item.title} 
                          />
                        </div>
                        <div className="ml-4 max-w-md">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{item.projectType}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.technologies.slice(0, 2).join(', ')}
                        {item.technologies.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.clientName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(item._id, item.featured)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue ${
                          item.featured ? 'bg-royal-blue' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className="sr-only">Toggle featured</span>
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            item.featured ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3 justify-end">
                        <Link href={`/admin/portfolio/${item._id}`} className="text-royal-blue hover:text-royal-blue-dark">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                        {item.projectUrl && (
                          <a 
                            href={item.projectUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
