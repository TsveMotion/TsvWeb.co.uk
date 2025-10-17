"use client"

import { useState, useEffect } from 'react'
import withAdminAuth from '@/components/admin/with-admin-auth'

interface User {
  id: string
  name: string
  email: string
  username: string
  phone?: string
  role: string
  createdAt: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'pending'
  websites?: string[]
  company?: string
}

function UserAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    role: 'customer',
    password: '',
    confirmPassword: '',
    status: 'active',
    websites: '',
    company: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success && data.users) {
        setUsers(data.users)
      } else {
        setError('Failed to load users. Please try again.')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('An error occurred while loading users.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setCurrentUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username || '',
        phone: user.phone || '',
        role: user.role,
        password: '',
        confirmPassword: '',
        status: user.status,
        websites: user.websites ? user.websites.join(', ') : '',
        company: user.company || ''
      })
    } else {
      setCurrentUser(null)
      setFormData({
        name: '',
        email: '',
        username: '',
        phone: '',
        role: 'customer',
        password: '',
        confirmPassword: '',
        status: 'active',
        websites: '',
        company: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentUser(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email || !formData.username || !formData.role) {
      setError('Please fill in all required fields')
      return
    }
    
    if (!currentUser && (!formData.password || formData.password.length < 8)) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    if (!currentUser && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setError('')
    
    try {
      const url = currentUser 
        ? `/api/admin/users/${currentUser.id}` 
        : '/api/admin/users'
      
      const method = currentUser ? 'PUT' : 'POST'
      
      // Create a new object without confirmPassword
      const { confirmPassword, ...payloadData } = formData;
      
      const payload = {
        ...payloadData,
        websites: formData.websites ? formData.websites.split(',').map(w => w.trim()).filter(w => w) : [],
        company: formData.company || '',
        // Only include password if it's provided or if creating a new user
        ...(formData.password || !currentUser ? { password: formData.password } : {})
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess(currentUser ? 'User updated successfully!' : 'User created successfully!')
        handleCloseModal()
        fetchUsers() // Refresh the user list
      } else {
        setError(data.message || 'Failed to save user. Please try again.')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      setError('An error occurred while saving user.')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('User deleted successfully!')
        fetchUsers() // Refresh the user list
      } else {
        setError(data.message || 'Failed to delete user. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('An error occurred while deleting user.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h1 className="text-3xl font-bold">User Management</h1>
                </div>
                <p className="text-purple-100 text-lg">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30 font-medium"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add User
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 dark:bg-green-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                  </div>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden rounded-xl">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <li key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <div className="px-6 py-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                (user.status || 'inactive') === 'active' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : (user.status || 'inactive') === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {(user.status || 'inactive').charAt(0).toUpperCase() + (user.status || 'inactive').slice(1)}
                              </span>
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {user.role || 'user'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenModal(user)}
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-xs font-medium"
                                title="Edit user"
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                <span className="ml-1">Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs font-medium"
                                title="Delete user"
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-1">Delete</span>
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>Created {new Date(user.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {user.lastLogin && (
                              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>Last login {new Date(user.lastLogin).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-6 py-12 text-center">
                      <div className="p-6 bg-purple-100 dark:bg-purple-900/20 rounded-full inline-block mb-4">
                        <svg className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users found</p>
                      <p className="text-gray-500 dark:text-gray-400">Click "Add User" to create your first user</p>
                    </li>
                  )}
                </ul>
              </div>
            )}
        </div>
          
        {/* User Modal */}
        {isModalOpen && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"></div>
                </div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            {currentUser ? 'Edit User' : 'Add New User'}
                          </h3>
                          <div className="mt-4 space-y-4">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username *
                              </label>
                              <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="Enter username for login"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="+44 7444 358808"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Role *
                              </label>
                              <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="user">User</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status *
                              </label>
                              <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Company Name
                              </label>
                              <input
                                type="text"
                                name="company"
                                id="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="e.g., MuscleMatrix"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="websites" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tracked Websites
                              </label>
                              <input
                                type="text"
                                name="websites"
                                id="websites"
                                value={formData.websites}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="e.g., MuscleMatrix.uk, example.com (comma-separated)"
                              />
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Enter website URLs that this customer can monitor. Separate multiple websites with commas.
                              </p>
                            </div>
                            
                            <div>
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {currentUser ? 'Password (leave blank to keep current)' : 'Password *'}
                              </label>
                              <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!currentUser}
                                autoComplete="new-password"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {currentUser ? 'Confirm Password (leave blank to keep current)' : 'Confirm Password *'}
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required={!currentUser}
                                autoComplete="new-password"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-royal-blue focus:border-royal-blue sm:text-sm dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-royal-blue text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        {currentUser ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default withAdminAuth(UserAdmin)
