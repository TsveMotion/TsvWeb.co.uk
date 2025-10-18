import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Contract from '@/models/Contract';
import { connectToDatabase } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// POST - Generate PDF contract
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const contract = await Contract.findById(params.id).lean();
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Generate PDF content (simplified HTML-to-PDF approach)
    const pdfContent = generateContractHTML(contract as any);
    
    // For now, we'll create a simple HTML-based contract
    // In production, you would use a proper PDF library like puppeteer
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `contract-${params.id}-${timestamp}.pdf`;
    
    // Create the contract file info
    const fileInfo = {
      filename: filename,
      originalName: `${(contract as any).title} - Contract.pdf`,
      path: `/contracts/${params.id}/${filename}`,
      size: pdfContent.length,
      mimeType: 'application/pdf',
      uploadedAt: new Date(),
      uploadedBy: session.user.email
    };

    // Add the generated file to the contract's files array
    await Contract.findByIdAndUpdate(params.id, {
      $push: { files: fileInfo }
    });

    return NextResponse.json({
      success: true,
      message: 'PDF contract generated successfully',
      filename: filename,
      downloadUrl: `/api/admin/contracts/${params.id}/files/${filename}`
    });

  } catch (error) {
    console.error('Error generating PDF contract:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF contract' },
      { status: 500 }
    );
  }
}

function generateContractHTML(contract: any): string {
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Service Agreement</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { width: 45%; }
        .signature-line { border-bottom: 1px solid #000; margin-top: 30px; padding-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">SERVICE AGREEMENT</div>
        <div>Date: ${currentDate}</div>
      </div>

      <div class="section">
        <div class="section-title">PARTIES</div>
        <p><strong>Service Provider:</strong><br>
        TsvWeb - Professional Web Development<br>
        Birmingham, UK</p>
        
        <p><strong>Client:</strong><br>
        ${contract.clientName}<br>
        ${contract.clientEmail}</p>
      </div>

      <div class="section">
        <div class="section-title">SERVICES</div>
        <p>${getServiceDescription(contract.contractType)}</p>
      </div>

      <div class="section">
        <div class="section-title">TERMS AND CONDITIONS</div>
        <ol>
          <li><strong>Service Fee:</strong> ${contract.amount} ${contract.currency}</li>
          <li><strong>Payment Terms:</strong> 50% upfront, 50% upon completion</li>
          <li><strong>Timeline:</strong> As agreed upon in project specifications</li>
          <li><strong>Intellectual Property:</strong> Client owns all deliverables upon full payment</li>
          <li><strong>Warranty:</strong> 30-day bug-fix warranty included</li>
          <li><strong>Cancellation:</strong> Either party may cancel with 7 days written notice</li>
        </ol>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <p><strong>Service Provider:</strong></p>
          <div class="signature-line">TsvWeb</div>
          <p>Date: _______________</p>
        </div>
        <div class="signature-box">
          <p><strong>Client:</strong></p>
          <div class="signature-line">${contract.clientName}</div>
          <p>Date: _______________</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getServiceDescription(contractType: string): string {
  const descriptions = {
    web_development: 'Professional web development services including responsive design, modern frameworks, database integration, and deployment. Includes consultation, development, testing, and launch support.',
    maintenance: 'Ongoing website maintenance services including security updates, content updates, performance optimization, backup management, and technical support.',
    hosting: 'Professional web hosting services with high uptime guarantee, SSL certificates, regular backups, and technical support.',
    consultation: 'Expert web development consultation including technology recommendations, architecture planning, performance audits, and strategic guidance.',
    design: 'Professional web design services including UI/UX design, responsive layouts, brand integration, and user experience optimization.',
    custom: 'Custom web development services tailored to specific client requirements and business needs.'
  };

  return descriptions[contractType as keyof typeof descriptions] || 'Professional web development services as specified in project requirements.';
}
