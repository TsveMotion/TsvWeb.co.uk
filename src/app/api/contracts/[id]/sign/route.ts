import { NextRequest, NextResponse } from 'next/server';
import Contract from '@/models/Contract';
import { connectToDatabase } from '@/lib/db';

// GET - Load contract for signing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Invalid signature link' }, { status: 400 });
    }

    await connectToDatabase();
    
    const contract = await Contract.findOne({
      _id: params.id,
      signatureRequestId: token
    }).lean();

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found or invalid token' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      contract
    });

  } catch (error) {
    console.error('Error loading contract for signing:', error);
    return NextResponse.json(
      { error: 'Failed to load contract' },
      { status: 500 }
    );
  }
}

// POST - Sign contract
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { token, signature, signedAt } = body;

    if (!token || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    
    const contract = await Contract.findOne({
      _id: params.id,
      signatureRequestId: token
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found or invalid token' }, { status: 404 });
    }

    if (contract.status === 'signed') {
      return NextResponse.json({ error: 'Contract already signed' }, { status: 400 });
    }

    // Update contract with signature
    await Contract.findByIdAndUpdate(params.id, {
      status: 'signed',
      signedAt: new Date(signedAt),
      signedBy: signature,
      signatureUrl: `${process.env.NEXTAUTH_URL}/sign-contract/${params.id}?token=${token}`
    });

    return NextResponse.json({
      success: true,
      message: 'Contract signed successfully'
    });

  } catch (error) {
    console.error('Error signing contract:', error);
    return NextResponse.json(
      { error: 'Failed to sign contract' },
      { status: 500 }
    );
  }
}
