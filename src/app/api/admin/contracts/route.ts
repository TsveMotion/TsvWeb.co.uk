import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import Contract from '@/models/Contract';
import { connectToDatabase } from '@/lib/db';
import clientPromise from '@/lib/mongodb';

// GET - Fetch all contracts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const contractType = searchParams.get('contractType');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');

    // Build filter query
    const filter: any = {};
    if (status) filter.status = status;
    if (contractType) filter.contractType = contractType;
    if (userId) filter.userId = userId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { clientCompany: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [contracts, total] = await Promise.all([
      Contract.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contract.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      contracts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

// POST - Create new contract
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      title,
      description,
      contractType,
      userId,
      clientName,
      clientEmail,
      clientCompany,
      amount,
      currency = 'GBP',
      startDate,
      endDate,
      duration
    } = body;

    // Validate required fields
    if (!title || !contractType || !userId || !clientName || !clientEmail || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Verify the client user exists in the same collection used by admin users API
    const client = await clientPromise;
    const db = client.db();
    const clientUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!clientUser) {
      return NextResponse.json({ error: 'Client user not found' }, { status: 404 });
    }

    // Create new contract
    const contract = new Contract({
      title,
      description,
      contractType,
      userId,
      clientName,
      clientEmail,
      clientCompany,
      amount,
      currency,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      duration,
      files: [],
      emailsSent: [],
      notes: [],
      createdBy: 'admin', // TODO: Replace with actual admin user ID when auth is implemented
      updatedBy: 'admin'  // TODO: Replace with actual admin user ID when auth is implemented
    });

    await contract.save();

    return NextResponse.json({
      success: true,
      contract,
      message: 'Contract created successfully'
    });

  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}
