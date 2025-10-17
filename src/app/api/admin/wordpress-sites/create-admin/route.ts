import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

    // Get API key for this site
    const { connectToDatabase } = await import('@/lib/db');
    const mongoose = await import('mongoose');
    
    const ApiKeySchema = new mongoose.Schema({
      key: String,
      hashedKey: String,
      siteUrl: String,
      siteName: String,
      createdBy: String,
      createdAt: Date,
      lastUsed: Date,
      isActive: Boolean,
    });
    
    const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema);
    
    await connectToDatabase();
    
    // Find active API key for this site
    const apiKeyDoc = await ApiKey.findOne({ siteUrl, isActive: true });
    
    if (!apiKeyDoc) {
      return NextResponse.json(
        { error: 'No active API key found for this site' },
        { status: 400 }
      );
    }
    
    // Extract the actual API key from the stored partial key
    // For now, we'll use the test key or stored key
    const apiKey = apiKeyDoc.key.includes('...') ? 'test-key-12345' : apiKeyDoc.key;
    
    // Call WordPress REST API to create admin
    const wpApiUrl = `${siteUrl}/wp-json/tsvweb/v1/create-admin`;
    
    console.log('Calling WordPress API:', wpApiUrl);
    
    try {
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
      
      const wpData = await wpResponse.json();
      
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
      
    } catch (error) {
      console.error('Error calling WordPress API:', error);
      return NextResponse.json(
        { error: 'Failed to connect to WordPress site' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error creating administrator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
