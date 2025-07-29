import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { BlogPost } from '@/models/BlogPost';

// Initialize models after connection
let BlogPostModel: mongoose.Model<any>;

// Helper function to initialize model
async function getModel() {
  await connectToDatabase();
  
  if (!BlogPostModel) {
    if (mongoose.models.BlogPost) {
      BlogPostModel = mongoose.models.BlogPost;
    } else {
      BlogPostModel = mongoose.model('BlogPost', BlogPost);
    }
  }
  
  return BlogPostModel;
}

// GET handler for fetching a single blog post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const model = await getModel();
    const id = params.id;
    
    const post = await model.findById(id).lean();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error: any) {
    console.error(`Error fetching blog post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post', details: error.message },
      { status: 500 }
    );
  }
}

// PUT handler for updating a blog post
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const model = await getModel();
    const id = params.id;
    const data = await req.json();
    
    const post = await model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error: any) {
    console.error(`Error updating blog post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update blog post', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const model = await getModel();
    const id = params.id;
    
    const post = await model.findByIdAndDelete(id).lean();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, deletedPost: post });
  } catch (error: any) {
    console.error(`Error deleting blog post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete blog post', details: error.message },
      { status: 500 }
    );
  }
}
