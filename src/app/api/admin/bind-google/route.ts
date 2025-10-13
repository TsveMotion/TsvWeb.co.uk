import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { verifySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request as any);
    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { googleId, googleEmail } = await request.json();

    if (!googleId || !googleEmail) {
      return NextResponse.json({ error: 'Google ID and email required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find user by session email
    const user = await User.findOne({ email: session.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if Google account is already linked to another user
    const existingUser = await User.findOne({ googleId, _id: { $ne: user._id } });
    if (existingUser) {
      return NextResponse.json({ 
        error: 'This Google account is already linked to another user' 
      }, { status: 400 });
    }

    // Update user with Google info
    user.googleId = googleId;
    user.googleEmail = googleEmail;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Google account linked successfully',
      user: {
        email: user.email,
        googleEmail: user.googleEmail
      }
    });

  } catch (error) {
    console.error('Error binding Google account:', error);
    return NextResponse.json(
      { error: 'Failed to bind Google account' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySession(request as any);
    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find user by session email
    const user = await User.findOne({ email: session.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove Google binding
    user.googleId = undefined;
    user.googleEmail = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Google account unlinked successfully'
    });

  } catch (error) {
    console.error('Error unbinding Google account:', error);
    return NextResponse.json(
      { error: 'Failed to unbind Google account' },
      { status: 500 }
    );
  }
}
