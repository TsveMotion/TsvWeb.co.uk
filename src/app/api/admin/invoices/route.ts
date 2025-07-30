import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Invoice from '@/models/Invoice';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authData = await verifySession(request);
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type'); // 'invoice' or 'quote'
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments(query)
    ]);

    return NextResponse.json({
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authData = await verifySession(request);
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const data = await request.json();

    // Calculate totals
    const subtotal = data.items.reduce((sum: number, item: any) => {
      const itemTotal = item.quantity * item.unitPrice;
      item.total = itemTotal;
      return sum + itemTotal;
    }, 0);

    const tax = subtotal * (data.taxRate / 100);
    const total = subtotal + tax;

    const invoiceData = {
      ...data,
      subtotal,
      tax,
      total,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    };

    console.log('Creating invoice with data:', invoiceData);
    const invoice = new Invoice(invoiceData);
    
    // Ensure invoice number is generated if not provided
    if (!invoice.invoiceNumber) {
      const prefix = invoice.type === 'invoice' ? 'INV' : 'QUO';
      const count = await Invoice.countDocuments({ type: invoice.type });
      invoice.invoiceNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
      console.log('Generated invoice number:', invoice.invoiceNumber);
    }
    
    await invoice.save();
    console.log('Invoice saved successfully:', invoice._id);

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
