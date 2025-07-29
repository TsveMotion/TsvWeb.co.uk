import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

// Get all users (with pagination)
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')
    
    // Build query based on filters
    const query: any = {}
    if (role) query.role = role
    
    // Get total count for pagination
    const total = await db.collection('users').countDocuments(query)
    
    // Get users with pagination (excluding password)
    const users = await db.collection('users')
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Transform users for frontend
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || user.username,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      updatedAt: user.updatedAt
    }))
      
    return NextResponse.json({ 
      success: true, 
      users: transformedUsers,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        pageCount: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const data = await request.json()
    const { name, email, username, role, status, password, websites, company } = data
    
    // Validate required fields
    if (!name || !email || !username || !role || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if user already exists (by email or username)
    const existingUser = await db.collection('users').findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email or username already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hash(password, 12)
    
    // Create user object
    const user = {
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      role,
      status,
      websites: websites || [],
      company: company || '',
      createdAt: new Date(),
      lastLogin: null,
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(user)
    
    if (!result.insertedId) {
      throw new Error('Failed to create user')
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        ...userWithoutPassword
      },
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    )
  }
}
