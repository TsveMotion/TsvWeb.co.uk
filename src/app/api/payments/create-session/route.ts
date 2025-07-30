import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe, formatAmountForStripe } from '@/lib/stripe'
import { connectToDatabase } from '@/lib/db'
import Invoice from '@/models/Invoice'

export async function POST(request: NextRequest) {
  try {
    console.log('Payment session API called')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { invoiceId, tosAccepted } = body

    // Validate ToS acceptance
    if (!tosAccepted) {
      return NextResponse.json(
        { error: 'Terms of Service must be accepted before payment' },
        { status: 400 }
      )
    }

    // Connect to database and get invoice
    await connectToDatabase()
    const invoice = await Invoice.findById(invoiceId)

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Check if invoice is already paid
    if (invoice.status === 'paid') {
      return NextResponse.json(
        { error: 'Invoice is already paid' },
        { status: 400 }
      )
    }

    // Check if invoice is cancelled
    if (invoice.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Invoice is cancelled and cannot be paid' },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const lineItems = invoice.items.map((item: any) => ({
      price_data: {
        currency: invoice.currency.toLowerCase(),
        product_data: {
          name: item.description,
          description: `Quantity: ${item.quantity}`,
        },
        unit_amount: formatAmountForStripe(item.unitPrice, invoice.currency),
      },
      quantity: item.quantity,
    }))

    // Add tax as a separate line item if applicable
    if (invoice.taxRate > 0) {
      const taxAmount = (invoice.subtotal * invoice.taxRate) / 100
      lineItems.push({
        price_data: {
          currency: invoice.currency.toLowerCase(),
          product_data: {
            name: `Tax (${invoice.taxRate}%)`,
            description: 'Tax amount',
          },
          unit_amount: formatAmountForStripe(taxAmount, invoice.currency),
        },
        quantity: 1,
      })
    }

    // Get Stripe instance and create checkout session
    const stripe = getServerStripe()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${invoiceId}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${invoiceId}?payment=cancelled`,
      metadata: {
        invoiceId: invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        tosAccepted: 'true',
        tosAcceptedAt: new Date().toISOString(),
      },
      customer_email: invoice.customerEmail,
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          invoiceId: invoiceId,
          invoiceNumber: invoice.invoiceNumber,
        },
      },
    })

    // Update invoice with payment session info
    await Invoice.findByIdAndUpdate(invoiceId, {
      $set: {
        'payment.stripeSessionId': session.id,
        'payment.status': 'pending',
        'payment.tosAcceptedAt': new Date(),
        status: 'sent', // Update status to sent when payment is initiated
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('Error creating payment session:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}

// Add GET endpoint for testing
export async function GET() {
  console.log('Payment session API GET called')
  return NextResponse.json({ message: 'Payment API is working' })
}
