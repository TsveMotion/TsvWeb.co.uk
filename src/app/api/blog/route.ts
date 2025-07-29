import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { BlogPost } from '@/models/BlogPost';

// Initialize models after connection
let BlogPostModel: mongoose.Model<any>;

// GET handler for fetching all blog posts
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Initialize model if not already done
    if (!BlogPostModel) {
      if (mongoose.models.BlogPost) {
        BlogPostModel = mongoose.models.BlogPost;
      } else {
        BlogPostModel = mongoose.model('BlogPost', BlogPost);
      }
    }
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }
    
    // Execute query
    const posts = await BlogPostModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await BlogPostModel.countDocuments(query);
    
    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', details: error.message },
      { status: 500 }
    );
  }
}

// POST handler for creating a new blog post
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Initialize model if not already done
    if (!BlogPostModel) {
      if (mongoose.models.BlogPost) {
        BlogPostModel = mongoose.models.BlogPost;
      } else {
        BlogPostModel = mongoose.model('BlogPost', BlogPost);
      }
    }
    
    const data = await req.json();
    
    // Create new blog post
    const post = new BlogPostModel(data);
    await post.save();
    
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post', details: error.message },
      { status: 500 }
    );
  }
}
