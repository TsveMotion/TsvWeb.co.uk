import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { BlogPost, IBlogPost } from '@/models/BlogPost';

// Get all blog posts (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Build query based on provided filters
    const query: any = {};
    if (status) query.status = status;
    
    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    
    // Get blog posts with pagination
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    return NextResponse.json({ 
      success: true, 
      data: posts,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        pageCount: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// Create a new blog post
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Create new blog post with default author if not provided
    const newPost = new BlogPost({
      ...data,
      // Set default author if not provided
      author: data.author || 'Admin',
      // Set publish date if status is published
      publishedAt: data.status === 'published' ? new Date() : null
    });
    
    await newPost.save();
    
    return NextResponse.json({ 
      success: true, 
      data: newPost 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
