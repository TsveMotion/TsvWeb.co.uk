import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import clientPromise from '@/lib/mongodb';

// Get all inquiries (with pagination and filters)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Build query based on filters
    const query: any = {};
    if (status) query.status = status;
    
    // Get regular inquiries
    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get wizard submissions from MongoDB
    const client = await clientPromise;
    const db = client.db();
    const wizardSubmissions = await db.collection('wizard_submissions')
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();
    
    // Transform wizard submissions to match inquiry format
    const transformedWizardSubmissions = wizardSubmissions.map(submission => ({
      _id: submission._id,
      name: submission.name,
      email: submission.email,
      phone: submission.phone || '',
      company: submission.company || '',
      projectType: submission.projectType,
      budget: submission.budget,
      timeline: submission.timeline,
      goals: submission.goals || [],
      additionalInfo: submission.additionalInfo || '',
      message: `Project Type: ${submission.projectType}\nBudget: ${submission.budget}\nTimeline: ${submission.timeline}\nGoals: ${(submission.goals || []).join(', ')}\n\nAdditional Info: ${submission.additionalInfo || 'None'}`,
      subject: 'Setup Wizard Submission',
      createdAt: submission.submittedAt,
      status: submission.status || 'new',
      type: 'wizard' // Add type to distinguish from regular inquiries
    }));
    
    // Combine inquiries and wizard submissions
    const regularInquiriesWithType = inquiries.map(inquiry => ({
      ...inquiry.toObject(),
      type: 'inquiry'
    }));
    
    const allInquiries = [...regularInquiriesWithType, ...transformedWizardSubmissions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    return NextResponse.json({ 
      success: true, 
      data: allInquiries,
      pagination: {
        total: total + wizardSubmissions.length,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        pageCount: Math.ceil((total + wizardSubmissions.length) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// Create a new inquiry from contact form
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Create new inquiry
    const newInquiry = new Inquiry(data);
    await newInquiry.save();
    
    return NextResponse.json({ 
      success: true, 
      data: newInquiry 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
