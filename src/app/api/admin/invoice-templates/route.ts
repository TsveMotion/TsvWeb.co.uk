import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import InvoiceTemplate from '@/models/InvoiceTemplate';
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
    const type = searchParams.get('type'); // 'invoice' or 'quote'

    const query: any = {};
    if (type) query.type = type;

    console.log('Fetching templates with query:', query);
    const templates = await InvoiceTemplate.find(query).sort({ isDefault: -1, name: 1 });
    console.log('Found templates:', templates.length);

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
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

    // If setting as default, unset other defaults of the same type
    if (data.isDefault) {
      await InvoiceTemplate.updateMany(
        { type: data.type, isDefault: true },
        { isDefault: false }
      );
    }

    const template = new InvoiceTemplate(data);
    await template.save();

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
