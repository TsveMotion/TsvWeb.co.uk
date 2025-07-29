import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Create unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Ensure directory exists
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'uploads', 'portfolio');
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file to disk
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return the path to the file (relative to public directory)
    const fileUrl = `/uploads/portfolio/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        url: fileUrl,
        fileName: fileName,
        originalName: file.name
      } 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
