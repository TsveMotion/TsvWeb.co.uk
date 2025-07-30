import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { sendNewsletterWelcome } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json({ 
          message: 'You are already subscribed to our newsletter!' 
        }, { status: 200 });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        
        // Send welcome back email
        await sendNewsletterWelcome(email.toLowerCase());
        
        return NextResponse.json({ 
          message: 'Welcome back! Your subscription has been reactivated.' 
        }, { status: 200 });
      }
    }

    // Create new subscription
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    
    const newSubscriber = new Newsletter({
      email: email.toLowerCase(),
      unsubscribeToken
    });

    await newSubscriber.save();

    // Send welcome email
    await sendNewsletterWelcome(email.toLowerCase());

    return NextResponse.json({ 
      message: 'Thank you for subscribing! Check your email for a welcome message.' 
    }, { status: 201 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ 
        message: 'You are already subscribed to our newsletter!' 
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to subscribe. Please try again later.' 
    }, { status: 500 });
  }
}
