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

  // Filter portfolio items based on search term and project type filter
  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.clientName && item.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesProjectType = projectTypeFilter === 'all' || item.projectType.toLowerCase() === projectTypeFilter.toLowerCase()
    
    return matchesSearch && matchesProjectType
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
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-royal-blue focus:border-royal-blue block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Search portfolio items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm rounded-md"
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
            >
              <option value="all">All Project Types</option>
              {projectTypes.map((type: string, index: number) => (
                <option key={index} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
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

      {/* Pagination */}
      <nav
        className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg shadow"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredItems.length}</span> of{' '}
            <span className="font-medium">{filteredItems.length}</span> results
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <button
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            disabled
          >
            Previous
          </button>
          <button
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            disabled
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  )
}
