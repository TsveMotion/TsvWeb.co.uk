import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Invoice from '@/models/Invoice';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const invoice = await Invoice.findById(params.id);
    if (!invoice || invoice.type !== 'invoice') {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Track view
    await Invoice.findByIdAndUpdate(params.id, {
      $inc: { viewCount: 1 },
      $set: { 
        viewedAt: new Date(),
        status: invoice.status === 'sent' ? 'viewed' : invoice.status
      }
    });

    return NextResponse.json({
      _id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      customerAddress: invoice.customerAddress,
      customerPhone: invoice.customerPhone,
      items: invoice.items,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      taxRate: invoice.taxRate,
      total: invoice.total,
      currency: invoice.currency,
      status: invoice.status,
      dueDate: invoice.dueDate,
      issueDate: invoice.issueDate,
      notes: invoice.notes,
      terms: invoice.terms,
      type: invoice.type
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
