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
  // Check for custom auth cookie
  const authData = getClientAuthData();
  if (authData) {
    // Check if session is expired
    if (authData.expires && authData.expires < Date.now()) {
      return false;
    }
    
    if (authData.authenticated === true) {
      return true;
    }
  }
  
  // Also check for NextAuth session cookie
  const nextAuthSession = Cookies.get('next-auth.session-token') || Cookies.get('__Secure-next-auth.session-token');
  if (nextAuthSession) {
    return true;
  }
  
  return false;
}

// Clear session cookies (client-side)
export function clearClientSession() {
  Cookies.remove(SESSION_COOKIE, { path: '/' });
  Cookies.remove(ADMIN_AUTH_COOKIE, { path: '/' });
}

// Constants export for client usage
export { ADMIN_AUTH_COOKIE, SESSION_COOKIE, SESSION_EXPIRATION };
