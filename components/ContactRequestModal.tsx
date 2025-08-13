'use client'

import { useState } from 'react'
import { useAuth } from '../lib/auth'

interface ContactRequestModalProps {
  isOpen: boolean
  onClose: () => void
  candidateId: string
  candidateName: string
}

export default function ContactRequestModal({
  isOpen,
  onClose,
  candidateId,
  candidateName
}: ContactRequestModalProps) {
  const { user } = useAuth()
  const [contactType, setContactType] = useState<'view' | 'message' | 'interview_request' | 'offer'>('message')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const contactTypes = [
    { value: 'view', label: 'View Contact Details', price: 5 },
    { value: 'message', label: 'Send Message', price: 10 },
    { value: 'interview_request', label: 'Request Interview', price: 25 },
    { value: 'offer', label: 'Make Offer', price: 50 }
  ]

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch('/api/contacts/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}` // This should be the actual session token
        },
        body: JSON.stringify({
          candidateId,
          contactType,
          message: contactType === 'message' ? message : null
        })
      })

      const data = await response.json()

      if (response.status === 402) {
        // Payment required
        setShowPayment(true)
        return
      }

      if (response.ok) {
        alert('Contact request sent successfully!')
        onClose()
      } else {
        alert(data.error || 'Failed to send contact request')
      }
    } catch (error) {
      console.error('Error sending contact request:', error)
      alert('Failed to send contact request')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!user) return

    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          contactType,
          userId: user.id,
          email: user.email
        })
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to create checkout session')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Contact {candidateName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {!showPayment ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Type
              </label>
              <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {contactTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} (£{type.price})
                  </option>
                ))}
              </select>
            </div>

            {contactType === 'message' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message to the candidate..."
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Required
              </h3>
              <p className="text-gray-600 mb-4">
                You need to purchase credits to contact this candidate.
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  {contactTypes.find(t => t.value === contactType)?.label}: 
                  <span className="font-semibold"> £{contactTypes.find(t => t.value === contactType)?.price}</span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPayment(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
                             <button
                 onClick={handlePayment}
                 disabled={checkoutLoading}
                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
               >
                 {checkoutLoading ? 'Processing...' : 'Pay with Stripe'}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
