import { NextRequest, NextResponse } from 'next/server';
import Contract from '@/models/Contract';
import { connectToDatabase } from '@/lib/db';
import { verifyCustomerToken } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

// GET - Fetch contracts for authenticated customer
export async function GET(request: NextRequest) {
  try {
    // Use the same authentication method as the customer dashboard
    const user = await verifyCustomerToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Build filter query - only contracts for this user
    const filter: any = { userId: user.userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    
    const [contracts, total] = await Promise.all([
      Contract.find(filter)
        .select('-notes') // Exclude internal notes from customer view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contract.countDocuments(filter)
    ]);

    // Filter out private notes and sensitive admin data
    const filteredContracts = contracts.map(contract => ({
      ...contract,
      notes: contract.notes?.filter((note: any) => !note.isPrivate) || [],
      emailsSent: contract.emailsSent?.map((email: any) => ({
        sentAt: email.sentAt,
        subject: email.subject,
        status: email.status
      })) || []
    }));

    return NextResponse.json({
      success: true,
      contracts: filteredContracts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching customer contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}
