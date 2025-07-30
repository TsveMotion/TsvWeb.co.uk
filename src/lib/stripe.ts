import Stripe from 'stripe'
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js'

// Server-side Stripe instance (only used on server)
let serverStripe: Stripe | null = null
export const getServerStripe = () => {
  if (!serverStripe && typeof window === 'undefined') {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (secretKey) {
      serverStripe = new Stripe(secretKey)
    }
  }
  return serverStripe
}

// For backward compatibility
export const stripe = getServerStripe()

// Client-side Stripe instance
let stripePromise: Promise<StripeJS | null> | null = null
export const getStripe = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }
  
  if (!stripePromise) {
    // Use environment variable for publishable key
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    if (!publishableKey) {
      console.error('Stripe publishable key not found in environment variables')
      return Promise.resolve(null)
    }
    
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'],
  mode: 'payment' as const,
  billing_address_collection: 'required' as const,
  shipping_address_collection: {
    allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE'],
  },
  automatic_tax: {
    enabled: false,
  },
}

// Helper function to format amount for Stripe (convert to cents)
export const formatAmountForStripe = (amount: number, currency: string = 'usd'): number => {
  // Stripe expects amounts in the smallest currency unit (cents for USD)
  const zeroDecimalCurrencies = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf']
  
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return Math.round(amount)
  }
  
  return Math.round(amount * 100)
}

// Helper function to format amount from Stripe (convert from cents)
export const formatAmountFromStripe = (amount: number, currency: string = 'usd'): number => {
  const zeroDecimalCurrencies = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf']
  
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return amount
  }
  
  return amount / 100
}
