import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectToDatabase } from '@/lib/db'
import Invoice from '@/models/Invoice'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event

  if (!stripe) {
    console.error('Stripe not initialized')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    )
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    await connectToDatabase()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const invoiceId = session.metadata?.invoiceId

        if (invoiceId) {
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
                    <h2 style="color: #10b981;">Payment Confirmed!</h2>
                    <p>Dear ${invoice.customerName},</p>
                    <p>Thank you for your payment! We have successfully received your payment for invoice <strong>${invoice.invoiceNumber}</strong>.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="margin-top: 0;">Payment Details:</h3>
                      <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                      <p><strong>Amount Paid:</strong> ${invoice.currency} ${invoice.total.toFixed(2)}</p>
                      <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
                      <p><strong>Status:</strong> Paid</p>
                    </div>
                    
                    <p>You can view your invoice at any time by visiting:</p>
                    <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${invoice._id}" style="color: #3b82f6;">View Invoice</a></p>
                    
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    
                    <p>Best regards,<br>Your Company Team</p>
                  </div>
                `,
              })
            } catch (emailError) {
              console.error('Failed to send payment confirmation email:', emailError)
            }
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const invoiceId = paymentIntent.metadata?.invoiceId

        if (invoiceId) {
          // Update invoice payment status to failed
          await Invoice.findByIdAndUpdate(invoiceId, {
            $set: {
              'payment.status': 'failed',
              'payment.failedAt': new Date(),
            },
          })
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const invoiceId = session.metadata?.invoiceId

        if (invoiceId) {
          // Update invoice payment status to expired
          await Invoice.findByIdAndUpdate(invoiceId, {
            $set: {
              'payment.status': 'expired',
              'payment.expiredAt': new Date(),
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
