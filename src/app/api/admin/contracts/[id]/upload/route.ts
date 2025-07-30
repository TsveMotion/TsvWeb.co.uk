import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Contract from '@/models/Contract';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST - Upload files to contract
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if contract exists
    const contract = await Contract.findById(params.id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'contracts');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error
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

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${params.id}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(uploadDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Add file info to array
      const fileInfo = {
        filename,
        originalName: file.name,
        path: `/uploads/contracts/${filename}`,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        uploadedBy: currentUser._id.toString()
      };

      uploadedFiles.push(fileInfo);
    }

    // Update contract with new files
    contract.files = [...contract.files, ...uploadedFiles];
    contract.updatedBy = currentUser._id.toString();
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
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }

    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update contract to remove file
    const contract = await Contract.findByIdAndUpdate(
      params.id,
      {
        $pull: { files: { filename } },
        updatedBy: currentUser._id.toString()
      },
      { new: true }
    );

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Optionally delete the physical file
    // const filepath = path.join(process.cwd(), 'public', 'uploads', 'contracts', filename);
    // await unlink(filepath).catch(() => {}); // Ignore errors if file doesn't exist

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
