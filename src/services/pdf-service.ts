import jsPDF from 'jspdf';

interface ContractData {
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  amount: number;
  currency: string;
  contractType: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  description?: string;
}

export class PDFContractService {
  static generateContract(contractData: ContractData): Uint8Array {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Contract details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Date
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, margin, yPosition);
    yPosition += 15;

    // Parties section
    doc.setFont('helvetica', 'bold');
    doc.text('PARTIES', margin, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Service Provider:', margin, yPosition);
    doc.text('TsvWeb - Professional Web Development', margin + 5, yPosition + 8);
    doc.text('Birmingham, UK', margin + 5, yPosition + 16);
    yPosition += 30;

    doc.text('Client:', margin, yPosition);
    doc.text(`${contractData.clientName}`, margin + 5, yPosition + 8);
    if (contractData.clientCompany) {
      doc.text(`${contractData.clientCompany}`, margin + 5, yPosition + 16);
      yPosition += 8;
    }
    doc.text(`${contractData.clientEmail}`, margin + 5, yPosition + 16);
    yPosition += 35;

    // Services section
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICES', margin, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    const serviceDescription = this.getServiceDescription(contractData.contractType);
    const splitDescription = doc.splitTextToSize(serviceDescription, pageWidth - 2 * margin);
    doc.text(splitDescription, margin, yPosition);
    yPosition += splitDescription.length * 6 + 10;

    // Terms section
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS AND CONDITIONS', margin, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    const terms = [
      `1. Service Fee: ${contractData.amount} ${contractData.currency}`,
      '2. Payment Terms: 50% upfront, 50% upon completion',
      '3. Timeline: As agreed upon in project specifications',
      '4. Intellectual Property: Client owns all deliverables upon full payment',
      '5. Warranty: 30-day bug-fix warranty included',
      '6. Cancellation: Either party may cancel with 7 days written notice'
    ];

    terms.forEach(term => {
      const splitTerm = doc.splitTextToSize(term, pageWidth - 2 * margin);
      doc.text(splitTerm, margin, yPosition);
      yPosition += splitTerm.length * 6 + 5;
    });

    yPosition += 20;

    // Signature section
    doc.setFont('helvetica', 'bold');
    doc.text('SIGNATURES', margin, yPosition);
    yPosition += 20;

    doc.setFont('helvetica', 'normal');
    doc.text('Service Provider:', margin, yPosition);
    doc.text('TsvWeb', margin, yPosition + 20);
    doc.text('Date: _______________', margin, yPosition + 30);

    doc.text('Client:', pageWidth / 2 + 10, yPosition);
    doc.text(`${contractData.clientName}`, pageWidth / 2 + 10, yPosition + 20);
    doc.text('Date: _______________', pageWidth / 2 + 10, yPosition + 30);

    // Add signature lines
    doc.line(margin, yPosition + 15, margin + 80, yPosition + 15);
    doc.line(pageWidth / 2 + 10, yPosition + 15, pageWidth / 2 + 90, yPosition + 15);

    return doc.output('arraybuffer') as Uint8Array;
  }

  private static getServiceDescription(contractType: string): string {
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

  static async generateAndSave(contractData: ContractData, contractId: string): Promise<string> {
    const pdfBuffer = this.generateContract(contractData);
    
    // Create filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `contract-${contractId}-${timestamp}.pdf`;
    
    // In a real implementation, you would save this to your file storage
    // For now, we'll return the filename for the API to handle
    return filename;
  }
}
