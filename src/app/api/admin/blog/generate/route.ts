import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/services/ai-service';
import { BlogGenerationRequest } from '@/types/blog';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: BlogGenerationRequest = await request.json();
    
    // Validate required fields
    if (!body.topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Generate blog content using the AI service (server-side)
    const generatedBlog = await AIService.generateBlogContent(body);
    
    // Return the generated blog content
    return NextResponse.json(generatedBlog);
    
  } catch (error) {
    console.error('Error in blog generation API:', error);
    
    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to generate blog content: ${errorMessage}` },
      { status: 500 }
    );
  }
}
