import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { userType, rating, feedback, timestamp } = await request.json()

    // Validate input
    if (!userType || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    // Store feedback in database
    const { error } = await supabase
      .from('pilot_feedback')
      .insert({
        user_type: userType,
        rating,
        feedback: feedback || null,
        submitted_at: timestamp || new Date().toISOString()
      })

    if (error) {
      console.error('Error storing pilot feedback:', error)
      return NextResponse.json(
        { error: 'Failed to store feedback' },
        { status: 500 }
      )
    }

    // Also log to console for immediate visibility during pilot
    console.log('📊 Pilot Feedback Received:', {
      userType,
      rating,
      feedback: feedback?.substring(0, 100) + (feedback?.length > 100 ? '...' : ''),
      timestamp
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully'
    })

  } catch (error) {
    console.error('Error processing pilot feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get feedback summary for admin dashboard
    const { data: feedback, error } = await supabase
      .from('pilot_feedback')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error fetching pilot feedback:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      )
    }

    // Calculate summary statistics
    const summary = {
      total: feedback.length,
      averageRating: feedback.length > 0 
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
        : 0,
      byUserType: {
        candidate: feedback.filter(f => f.user_type === 'candidate').length,
        employer: feedback.filter(f => f.user_type === 'employer').length
      },
      byRating: {
        1: feedback.filter(f => f.rating === 1).length,
        2: feedback.filter(f => f.rating === 2).length,
        3: feedback.filter(f => f.rating === 3).length,
        4: feedback.filter(f => f.rating === 4).length,
        5: feedback.filter(f => f.rating === 5).length
      }
    }

    return NextResponse.json({
      feedback,
      summary
    })

  } catch (error) {
    console.error('Error processing feedback request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
