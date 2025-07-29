"use client"

import { useState, useEffect } from 'react'
import withAdminAuth from '@/components/admin/with-admin-auth'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'pending'
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
    role: 'user',
    password: '',
    confirmPassword: '',
    status: 'active'
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
        role: user.role,
        password: '',
        confirmPassword: '',
        status: user.status
      })
    } else {
      setCurrentUser(null)
      setFormData({
        name: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: '',
        status: 'active'
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
    if (!formData.name || !formData.email || !formData.role) {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <button
                type="button"
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add User
              </button>
            </div>
            
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
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <li key={user.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-royal-blue flex items-center justify-center">
                                <span className="text-white font-medium">
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
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : user.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {user.role}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenModal(user)}
                                className="text-royal-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
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
                    <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No users found. Click "Add User" to create one.
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
    </div>
  )
}

export default withAdminAuth(UserAdmin)
