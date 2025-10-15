import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface Params {
  params: {
    id: string;
  }
}

// Helper function to check admin authentication
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return { authenticated: false, error: 'Unauthorized' }
  }
  
  // Check if user is admin
  const userRole = (session.user as any).role
  if (userRole !== 'admin' && userRole !== 'editor') {
    return { authenticated: false, error: 'Forbidden: Admin access required' }
  }
  
  return { authenticated: true }
}

// Get a single user by ID
export async function GET(request: NextRequest, { params }: Params) {
  // Check authentication
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }
  
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      )
    }
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    const userResponse = {
      id: user._id.toString(),
      name: user.name || user.username,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      updatedAt: user.updatedAt
    }
    
    return NextResponse.json({ success: true, user: userResponse })
  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// Update a user by ID
export async function PUT(request: NextRequest, { params }: Params) {
  // Check authentication
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }
  
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { id } = params;
    const { name, email, username, role, status, password, websites, company } = await request.json();
    
    // Check if user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (name) updateData.name = name
    if (email) updateData.email = email.toLowerCase()
    if (username) updateData.username = username.toLowerCase()
    if (role) updateData.role = role
    if (status) updateData.status = status
    if (websites !== undefined) updateData.websites = websites || []
    if (company !== undefined) updateData.company = company || ''
    
    // Hash password if provided
    if (password) {
      updateData.password = await hash(password, 12)
    }
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    // Get updated user without password
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    )
    
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
  // Check authentication
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }
  
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { id } = params;
    
    // Check if user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    
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
