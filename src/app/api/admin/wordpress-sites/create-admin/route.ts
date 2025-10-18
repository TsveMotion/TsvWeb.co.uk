import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// API Keys Schema
const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true },
  hashedKey: { type: String, required: true },
  siteUrl: { type: String, required: true },
  siteName: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  lastUsed: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { siteId, siteUrl, email, username, password } = body;

    console.log('Received create-admin request:', { siteId, siteUrl, email, username, hasPassword: !!password });

    // Validate inputs
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required', received: { email: !!email, username: !!username, password: !!password } },
        { status: 400 }
      );
    }
    
    if (!siteUrl) {
      return NextResponse.json(
        { error: 'Site URL is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('Create admin request for site:', siteUrl);
    console.log('Email:', email, 'Username:', username);

    // Connect to database
    await connectToDatabase();
    
    // Find active API key for this site
    let apiKey = 'test-key-12345'; // Default to test key
    
    try {
      const apiKeyDoc = await ApiKey.findOne({ siteUrl, isActive: true });
      if (apiKeyDoc && apiKeyDoc.key) {
        // Use test key for now since we store partial keys
        apiKey = 'test-key-12345';
      }
    } catch (dbError) {
      console.log('Could not fetch API key, using test key:', dbError);
    }
    
    // Call WordPress REST API to create admin
    const wpApiUrl = `${siteUrl}/wp-json/tsvweb/v1/create-admin`;
    
    console.log('Calling WordPress API:', wpApiUrl);
    
    try {
      console.log('Sending request to WordPress with API key:', apiKey.substring(0, 10) + '...');
      
      const wpResponse = await fetch(wpApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });
      
      console.log('WordPress response status:', wpResponse.status);
      
      // Get response text first
      const responseText = await wpResponse.text();
      console.log('Response text (first 200 chars):', responseText.substring(0, 200));
      
      // Try to parse as JSON
      let wpData;
      try {
        wpData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse WordPress response as JSON:', parseError);
        
        // Check if it's HTML (plugin not installed or REST API not working)
        if (responseText.trim().startsWith('<!') || responseText.trim().startsWith('<html')) {
          return NextResponse.json(
            { 
              error: 'WordPress REST API endpoint not found. Please ensure the TsvWeb Monitor plugin is installed and activated.',
              details: 'The WordPress site returned HTML instead of JSON. This usually means the REST API endpoint does not exist.'
            },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { 
            error: 'Invalid response from WordPress site', 
            responseText: responseText.substring(0, 200) 
          },
          { status: 500 }
        );
      }
      
      console.log('WordPress API response:', wpData);
      
      if (!wpResponse.ok) {
        return NextResponse.json(
          { error: wpData.message || 'Failed to create administrator', details: wpData },
          { status: wpResponse.status }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Administrator created successfully',
        data: wpData
      });
      
    } catch (error: any) {
      console.error('Error calling WordPress API:', error);
      return NextResponse.json(
        { error: 'Failed to connect to WordPress site', details: error.message },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error creating administrator:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
