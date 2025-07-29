// Server-side authentication utilities
import crypto from 'crypto';
import { User } from '@/models/User';
import { connectToDatabase } from '@/lib/db';
import { ADMIN_AUTH_COOKIE, SESSION_COOKIE, SESSION_EXPIRATION } from '@/lib/constants';
import { NextResponse } from 'next/server';

// Secret used for signing cookies - in production, this should be an environment variable
const AUTH_SECRET = process.env.AUTH_SECRET || 'your-secret-key-should-be-long-and-secure';

/**
 * Authenticate a user by email and password
 */
export async function authenticateUser(email: string, password: string) {
  await connectToDatabase();
  
  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // If user found in database
  if (user && user.isActive) {
    // Verify password
    if (user.validatePassword(password)) {
      // Return user data (excluding sensitive information)
      const { name, email, role, _id } = user;
      return { name, email, role, id: _id.toString() };
    }
  }
  
  // Fallback: Check against environment variables for initial admin setup
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Administrator';
  
  if (adminEmail && adminPassword && 
      email.toLowerCase() === adminEmail.toLowerCase() && 
      password === adminPassword) {
    console.log('🔑 Authenticated using environment admin credentials');
    return {
      name: adminName,
      email: adminEmail,
      role: 'admin',
      id: 'env-admin'
    };
  }
  
  return null;
}

/**
 * Create a secure session for authenticated user
 * Note: This function should only be used in API routes
 */
export async function createSession(userData: any, response: NextResponse) {
  // Generate a random session token
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  // Current timestamp
  const now = Date.now();
  
  // Expiration timestamp
  const expires = now + SESSION_EXPIRATION;
  
  // Session data
  const session = {
    token: sessionToken,
    userId: userData.id,
    role: userData.role,
    expires,
    userData: {
      name: userData.name,
      email: userData.email
    }
  };
  
  // Set HTTP-only cookie with session token (not accessible via JavaScript)
  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'strict',
    expires: new Date(expires),
    path: '/'
  });
  
  // Set readable cookie with user data (accessible via JavaScript)
  response.cookies.set(ADMIN_AUTH_COOKIE, JSON.stringify({
    authenticated: true,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    expires
  }), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(expires),
    path: '/'
  });
  
  return session;
}

/**
 * Verify if a session is valid
 * Note: This function should only be used in API routes or Server Components
 */
export async function verifySession(request: Request) {
  // Get cookies from request headers
  const cookieHeader = request.headers.get('cookie') || '';
  
  // Parse cookies manually
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, ...valueParts] = cookie.split('=');
      return [name, valueParts.join('=')];
    })
  );
  
  // Get session token
  const sessionToken = cookies[SESSION_COOKIE];
  
  // Get auth data
  const authCookie = cookies[ADMIN_AUTH_COOKIE];
  
  if (!sessionToken || !authCookie) {
    return null;
  }
  
  try {
    // Parse auth data
    const authData = JSON.parse(decodeURIComponent(authCookie));
    
    // Check if expired
    if (authData.expires < Date.now()) {
      return null;
    }
    
    // In a full implementation, you would verify the session token against a database
    // For this implementation, we'll just check if the cookie exists and is not expired
    
    return authData;
  } catch (error) {
    return null;
  }
}

/**
 * Clear session cookies to log out
 * Note: This function should only be used in API routes
 */
export function clearSession(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(ADMIN_AUTH_COOKIE);
}
