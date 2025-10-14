import { NextRequest, NextResponse } from 'next/server';
import { indexNowService } from '@/services/indexnow-service';

/**
 * GET /api/indexnow
 * Returns the IndexNow key for verification
 * This endpoint serves the key file content that search engines will verify
 */
export async function GET(request: NextRequest) {
  try {
    const key = indexNowService.getKey();
    
    if (!key) {
      return NextResponse.json(
        { success: false, message: 'IndexNow key not configured' },
        { status: 500 }
      );
    }

    // Return the key as plain text
    return new NextResponse(key, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error serving IndexNow key:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to serve IndexNow key' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/indexnow
 * Manually submit URLs to IndexNow (for admin use)
 */
export async function POST(request: NextRequest) {
  try {
    const { url, urls } = await request.json();
    
    let result;
    if (url) {
      // Submit single URL
      result = await indexNowService.submitUrl(url);
    } else if (urls && Array.isArray(urls)) {
      // Submit multiple URLs
      result = await indexNowService.submitUrls(urls);
    } else {
      return NextResponse.json(
        { success: false, message: 'Please provide either "url" or "urls" parameter' },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        statusCode: result.statusCode,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to submit to IndexNow',
        },
        { status: result.statusCode || 500 }
      );
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit to IndexNow' },
      { status: 500 }
    );
  }
}
