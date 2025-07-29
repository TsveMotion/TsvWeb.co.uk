import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { BlogPost } from '@/models/BlogPost';

interface Params {
  params: {
    id: string;
  }
}

// Get a single blog post by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error(`Error fetching blog post ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// Update a blog post by ID
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const data = await request.json();
    
    // Check if post exists
    const post = await BlogPost.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // If updating status to published and it wasn't published before, set publishedAt date
    if (data.status === 'published' && post.status !== 'published') {
      data.publishedAt = new Date();
    }
    
    // Update post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error(`Error updating blog post ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// Delete a blog post by ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Check if post exists
    const post = await BlogPost.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Delete post
    await BlogPost.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting blog post ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
