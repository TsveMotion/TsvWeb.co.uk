import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

// Get all users (with pagination)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Build query based on filters
    const query: any = {};
    if (role) query.role = role;
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    // Get users with pagination (excluding password)
    const users = await User.find(query, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    return NextResponse.json({ 
      success: true, 
      data: users,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        pageCount: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create new user
    const newUser = new User(data);
    await newUser.save();
    
    // Return user without password
    const userData = newUser.toObject();
    delete userData.password;
    
    return NextResponse.json({ 
      success: true, 
      data: userData 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
