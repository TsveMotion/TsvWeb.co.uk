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
      // Use the schema from the imported BlogPost model
      BlogPostModel = BlogPost;
    }
  }
  
  return BlogPostModel;
}

// GET handler for fetching all categories with counts
export async function GET(req: NextRequest) {
  try {
    const model = await getModel();
    
    // Use MongoDB aggregation to get categories and counts
    const categoriesAggregation = await model.aggregate([
      // Unwind the tags array to create a document for each tag
      { $unwind: "$tags" },
      // Group by tag and count occurrences
      { 
        $group: { 
          _id: "$tags", 
          count: { $sum: 1 } 
        } 
      },
      // Sort by count in descending order
      { $sort: { count: -1 } },
      // Project to rename fields for the response
      { 
        $project: { 
          _id: 0, 
          name: "$_id", 
          count: 1 
        } 
      }
    ]);
    
    return NextResponse.json({ categories: categoriesAggregation });
  } catch (error: any) {
    console.error('Error fetching blog post categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}
