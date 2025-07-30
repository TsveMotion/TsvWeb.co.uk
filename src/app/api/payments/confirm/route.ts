import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'
import { connectToDatabase } from '@/lib/db'
import Invoice from '@/models/Invoice'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Get Stripe instance and retrieve the checkout session
    const stripe = getServerStripe()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Connect to database
    await connectToDatabase()

    const invoiceId = session.metadata?.invoiceId

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID not found in session' },
        { status: 400 }
      )
    }

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      // Update invoice status to paid
      const invoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        {
          $set: {
            status: 'paid',
            'payment.status': 'completed',
            'payment.stripePaymentIntentId': session.payment_intent,
            'payment.paidAt': new Date(),
            'payment.amount': session.amount_total ? session.amount_total / 100 : 0,
            'payment.currency': session.currency,
          },
        },
        { new: true }
      )

      if (invoice) {
        // Send payment confirmation email
        try {
          await sendEmail({
            to: invoice.customerEmail,
            subject: `Payment Confirmation - ${invoice.invoiceNumber}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Payment Confirmed! 🎉</h2>
                <p>Dear ${invoice.customerName},</p>
                <p>Thank you for your payment! We have successfully received your payment for invoice <strong>${invoice.invoiceNumber}</strong>.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Payment Details:</h3>
                  <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                  <p><strong>Amount Paid:</strong> ${invoice.currency} ${invoice.total.toFixed(2)}</p>
                  <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Status:</strong> Paid ✅</p>
                </div>
                
                <p>You can view your invoice at any time by visiting:</p>
                <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${invoice._id}" style="color: #3b82f6;">View Invoice</a></p>
                
                <p>We will begin work on your project as outlined in the invoice. If you have any questions, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>Your Company Team</p>
              </div>
            `,
          })
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError)
        }

        return NextResponse.json({
          success: true,
          invoice: {
            id: invoice._id,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            total: invoice.total,
            currency: invoice.currency,
          },
        })
      }
    } else {
      return NextResponse.json(
        { error: 'Payment was not successful', paymentStatus: session.payment_status },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Invoice not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
