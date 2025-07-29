import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

interface Params {
  params: {
    id: string;
  }
}

// Get a single user by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Update a user by ID
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const data = await request.json();
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // If email is being changed, check if it's already in use
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already in use' },
          { status: 400 }
        );
      }
    }
    
    // If password is empty, remove it from the update data
    if (data.password === '' || data.password === undefined) {
      delete data.password;
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');
    
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete a user by ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete user
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
