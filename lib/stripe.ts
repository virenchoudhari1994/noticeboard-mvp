import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

// Client-side Stripe instance
export const getStripe = () => {
  return new (require('@stripe/stripe-js')).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Product and price IDs (you'll need to create these in your Stripe dashboard)
export const STRIPE_PRODUCTS = {
  // Subscription tiers
  FREE: {
    name: 'Free Tier',
    priceId: null, // Free tier doesn't have a price
    credits: {
      view: 0,
      message: 0,
      interview_request: 0,
      offer: 0
    }
  },
  BASIC: {
    name: 'Basic Plan',
    priceId: 'price_basic_monthly', // Replace with actual price ID
    credits: {
      view: 10,
      message: 5,
      interview_request: 2,
      offer: 1
    }
  },
  PREMIUM: {
    name: 'Premium Plan',
    priceId: 'price_premium_monthly', // Replace with actual price ID
    credits: {
      view: 50,
      message: 25,
      interview_request: 10,
      offer: 5
    }
  }
}

// Per-contact pricing (one-time purchases)
export const CONTACT_PRICING = {
  view: {
    priceId: 'price_view_contact', // Replace with actual price ID
    amount: 500, // £5.00 in pence
    currency: 'gbp'
  },
  message: {
    priceId: 'price_message_contact', // Replace with actual price ID
    amount: 1000, // £10.00 in pence
    currency: 'gbp'
  },
  interview_request: {
    priceId: 'price_interview_contact', // Replace with actual price ID
    amount: 2500, // £25.00 in pence
    currency: 'gbp'
  },
  offer: {
    priceId: 'price_offer_contact', // Replace with actual price ID
    amount: 5000, // £50.00 in pence
    currency: 'gbp'
  }
}

// Helper function to create Stripe Checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })

  return session
}

// Helper function to create subscription checkout session
export async function createSubscriptionSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })

  return session
}

// Helper function to create or get Stripe customer
export async function getOrCreateCustomer(email: string, userId: string) {
  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  return customer
}
