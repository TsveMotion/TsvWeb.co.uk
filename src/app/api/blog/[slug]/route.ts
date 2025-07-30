import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { BlogPost } from '@/models/BlogPost';

// Helper function to initialize model
async function getModel() {
  await connectToDatabase();
  return BlogPost;
}

// GET handler for fetching a single blog post by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const model = await getModel();
    const slug = params.slug;
    
    // Find blog post by slug instead of ID
    const post = await model.findOne({ slug: slug }).lean();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Convert MongoDB ObjectId to string for JSON serialization
    const serializedPost = {
      ...post,
      _id: (post as any)._id.toString(),
      id: (post as any)._id.toString(),
      createdAt: (post as any).createdAt?.toISOString(),
      updatedAt: (post as any).updatedAt?.toISOString(),
      publishedAt: (post as any).publishedAt?.toISOString()
    };
    
    // Return in the format expected by the blog service
    return NextResponse.json({
      success: true,
      data: serializedPost
    });
  } catch (error: any) {
    console.error(`Error fetching blog post with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post', details: error.message },
      { status: 500 }
    );
  }
}
