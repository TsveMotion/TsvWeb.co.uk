import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Invoice from '@/models/Invoice';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const quote = await Invoice.findById(params.id);
    if (!quote || quote.type !== 'quote') {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Track view
    await Invoice.findByIdAndUpdate(params.id, {
      $inc: { viewCount: 1 },
      $set: { 
        viewedAt: new Date(),
        status: quote.status === 'sent' ? 'viewed' : quote.status
      }
    });

    return NextResponse.json({
      invoiceNumber: quote.invoiceNumber,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerAddress: quote.customerAddress,
      customerPhone: quote.customerPhone,
      items: quote.items,
      subtotal: quote.subtotal,
      tax: quote.tax,
      taxRate: quote.taxRate,
      total: quote.total,
      currency: quote.currency,
      status: quote.status,
      dueDate: quote.dueDate,
      issueDate: quote.issueDate,
      notes: quote.notes,
      terms: quote.terms,
      type: quote.type
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
