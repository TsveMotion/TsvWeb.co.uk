import { NextRequest, NextResponse } from 'next/server';
import Contract from '@/models/Contract';
import { connectToDatabase } from '@/lib/db';
import { put, del } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST - Upload files to contract
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

    // Check if contract exists
    const contract = await Contract.findById(params.id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const formData = await request.formData();
    let files = formData.getAll('files') as File[];
    if ((!files || files.length === 0) && formData.get('file')) {
      files = [formData.get('file') as unknown as File];
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];
    
    for (const file of files) {
      // Validate file type (allow PDF, DOC, DOCX)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({
          error: `File type ${file.type} not allowed. Only PDF, DOC, and DOCX files are accepted.`
        }, { status: 400 });
      }

      // Generate unique filename for blob storage
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const blobPath = `contracts/${params.id}/${timestamp}_${safeName}`;

      // Upload to Vercel Blob
      const blob = await put(blobPath, file, {
        access: 'public',
        addRandomSuffix: false
      });

      // Add file info to array
      const fileInfo = {
        filename: blob.pathname,
        originalName: file.name,
        path: blob.url,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        uploadedBy: session.user.email || 'admin'
      };

      uploadedFiles.push(fileInfo);
    }

    // Update contract with new files
    contract.files = [...contract.files, ...uploadedFiles];
    contract.updatedBy = session.user.email || 'admin';
    await contract.save();

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
      contract
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// DELETE - Remove file from contract
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }

    // Find the contract and file
    const contract = await Contract.findById(params.id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Find the file to get its blob URL
    const fileToDelete = contract.files.find((f: any) => f.filename === filename);
    
    // Delete from Vercel Blob if it's a blob URL
    if (fileToDelete?.path && fileToDelete.path.includes('vercel-storage.com')) {
      try {
        await del(fileToDelete.path);
      } catch (error) {
        console.error('Error deleting from blob:', error);
      }
    }

    // Update contract to remove file
    contract.files = contract.files.filter((f: any) => f.filename !== filename);
    contract.updatedBy = session.user.email || 'admin';
    await contract.save();

    return NextResponse.json({
      success: true,
      message: 'File removed successfully',
      contract
    });

  } catch (error) {
    console.error('Error removing file:', error);
    return NextResponse.json(
      { error: 'Failed to remove file' },
      { status: 500 }
    );
  }
}
