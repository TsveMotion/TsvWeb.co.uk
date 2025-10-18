import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import { Notification } from '@/models/Notification';

// GET - Fetch notifications for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = { userId: session.user.email };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: session.user.email,
      read: false
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new notification (for testing or system notifications)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();
    const { title, message, type, link, userId } = body;

    const notification = new Notification({
      userId: userId || session.user.email,
      title,
      message,
      type: type || 'info',
      link: link || null
    });

    await notification.save();

    return NextResponse.json({
      success: true,
      notification
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();
    const { notificationIds, markAllAsRead } = body;

    if (markAllAsRead) {
      await Notification.updateMany(
        { userId: session.user.email, read: false },
        { $set: { read: true } }
      );
    } else if (notificationIds && Array.isArray(notificationIds)) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, userId: session.user.email },
        { $set: { read: true } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read'
    });
  } catch (error: any) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications', details: error.message },
      { status: 500 }
    );
  }
}
