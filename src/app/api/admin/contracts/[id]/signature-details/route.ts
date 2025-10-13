import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Contract from '@/models/Contract';
import Agreement from '@/models/Agreement';
import { verifySession } from '@/lib/auth';

// GET signature details from linked agreement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifySession(request as any);
    if (!session?.authenticated || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const contract = await Contract.findById(params.id).lean();
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Find the most recent signed agreement for this contract
    const agreement = await Agreement.findOne({
      userId: (contract as any).userId,
      clientEmail: (contract as any).clientEmail,
      status: 'signed',
      clientSignedAt: { $exists: true }
    }).sort({ clientSignedAt: -1 }).lean() as any;

    if (!agreement) {
      return NextResponse.json({ error: 'No signed agreement found' }, { status: 404 });
    }

    // Update contract with signature details
    await Contract.findByIdAndUpdate(params.id, {
      status: 'signed',
      signedAt: agreement.clientSignedAt,
      signedBy: agreement.clientSignatureName || agreement.clientName,
      signatureDetails: {
        signerName: agreement.clientSignatureName,
        signedAt: agreement.clientSignedAt,
        ip: agreement.clientSignatureIp,
        userAgent: agreement.clientSignatureUserAgent
      }
    });

    return NextResponse.json({
      success: true,
      signatureDetails: {
        signerName: agreement.clientSignatureName,
        signedAt: agreement.clientSignedAt,
        ip: agreement.clientSignatureIp,
        userAgent: agreement.clientSignatureUserAgent
      }
    });
  } catch (error) {
    console.error('Error fetching signature details:', error);
    return NextResponse.json({ error: 'Failed to fetch signature details' }, { status: 500 });
  }
}
