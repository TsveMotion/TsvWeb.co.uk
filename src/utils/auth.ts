/**
 * Auth utilities for the admin section
 */

import { cookies } from 'next/headers'

/**
 * Check if the user is authenticated server-side
 * This function can be called from server components or route handlers
 */
export function isAuthenticated(): boolean {
  const cookieStore = cookies()
  const authToken = cookieStore.get('tsvweb-admin-token')
  
  if (!authToken) {
    return false
  }
  
  try {
    // In a real app, you would verify the JWT token here
    // For now, we just check if it exists
    const tokenData = JSON.parse(authToken.value)
    return !!tokenData.email && !!tokenData.role
  } catch (error) {
    return false
  }
}

/**
 * Get the current user data from cookies (server-side)
 */
export function getCurrentUser() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('tsvweb-admin-token')
  
  if (!authToken) {
    return null
  }
  
  try {
    return JSON.parse(authToken.value)
  } catch (error) {
    return null
  }
}
