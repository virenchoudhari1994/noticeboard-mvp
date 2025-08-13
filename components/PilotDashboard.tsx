'use client'

import { useState, useEffect } from 'react'

interface PilotFeedback {
  id: string
  user_type: 'candidate' | 'employer'
  rating: number
  feedback: string | null
  submitted_at: string
}

interface PilotSummary {
  total: number
  averageRating: number
  byUserType: {
    candidate: number
    employer: number
  }
  byRating: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export default function PilotDashboard() {
  const [feedback, setFeedback] = useState<PilotFeedback[]>([])
  const [summary, setSummary] = useState<PilotSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPilotData()
  }, [])

  const fetchPilotData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pilot/feedback')
      
      if (response.ok) {
        const data = await response.json()
        setFeedback(data.feedback)
        setSummary(data.summary)
      } else {
        setError('Failed to fetch pilot data')
      }
    } catch (error) {
      setError('Error fetching pilot data')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchPilotData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pilot Dashboard</h2>
        <button
          onClick={fetchPilotData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Feedback */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Feedback</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.total}</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Rating</h3>
            <p className="text-3xl font-bold text-green-600">
              {summary.averageRating.toFixed(1)}/5
            </p>
          </div>

          {/* User Type Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">User Types</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Candidates:</span>
                <span className="font-semibold">{summary.byUserType.candidate}</span>
              </div>
              <div className="flex justify-between">
                <span>Employers:</span>
                <span className="font-semibold">{summary.byUserType.employer}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Rating Distribution</h3>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(rating => (
              <div key={rating} className="text-center">
                <div className="text-2xl mb-1">
                  {rating === 1 && '😞'}
                  {rating === 2 && '😐'}
                  {rating === 3 && '😊'}
                  {rating === 4 && '😄'}
                  {rating === 5 && '🤩'}
                </div>
                <p className="text-sm text-gray-600">{rating} Star</p>
                <p className="text-lg font-bold text-blue-600">
                  {summary.byRating[rating as keyof typeof summary.byRating]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-700">Recent Feedback</h3>
        </div>
        <div className="divide-y">
          {feedback.slice(0, 10).map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.user_type === 'candidate' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.user_type}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= item.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.submitted_at).toLocaleDateString()}
                </span>
              </div>
              {item.feedback && (
                <p className="text-gray-700 text-sm">{item.feedback}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {feedback.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No feedback received yet.</p>
        </div>
      )}
    </div>
  )
}
