import { ADMIN_AUTH_COOKIE, SESSION_COOKIE, SESSION_EXPIRATION } from '@/lib/constants';
import Cookies from 'js-cookie';

/**
 * Client-side authentication utilities
 */

// Get authentication data from cookies (client-side)
export function getClientAuthData() {
  try {
    const authCookie = Cookies.get(ADMIN_AUTH_COOKIE);
    if (authCookie) {
      return JSON.parse(authCookie);
    }
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
  }
  return null;
}

// Check if user is authenticated (client-side)
export function isClientAuthenticated() {
  const authData = getClientAuthData();
  if (!authData) return false;
  
  // Check if session is expired
  if (authData.expires && authData.expires < Date.now()) {
    return false;
  }
  
  return authData.authenticated === true;
}

// Clear session cookies (client-side)
export function clearClientSession() {
  Cookies.remove(SESSION_COOKIE, { path: '/' });
  Cookies.remove(ADMIN_AUTH_COOKIE, { path: '/' });
}

// Constants export for client usage
export { ADMIN_AUTH_COOKIE, SESSION_COOKIE, SESSION_EXPIRATION };
