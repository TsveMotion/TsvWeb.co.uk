import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function GET(request: NextRequest) {
  try {
    // Create a zip archive in memory
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Create a buffer to store the zip
    const chunks: Buffer[] = [];
    
    archive.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    // Add files to the archive
    const pluginPath = join(process.cwd(), 'wordpress-plugin', 'tsvweb-monitor');
    
    // Add main plugin file
    archive.file(join(pluginPath, 'tsvweb-monitor.php'), { name: 'tsvweb-monitor/tsvweb-monitor.php' });
    
    // Add README
    archive.file(join(pluginPath, 'README.md'), { name: 'tsvweb-monitor/README.md' });

    // Finalize the archive
    await archive.finalize();

    // Wait for all chunks to be collected
    await new Promise((resolve) => {
      archive.on('end', resolve);
    });

    // Combine all chunks into a single buffer
    const zipBuffer = Buffer.concat(chunks);

    // Return the zip file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="tsvweb-monitor.zip"',
        'Content-Length': zipBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error creating plugin zip:', error);
    return NextResponse.json(
      { error: 'Failed to create plugin download' },
      { status: 500 }
    );
  }
}
