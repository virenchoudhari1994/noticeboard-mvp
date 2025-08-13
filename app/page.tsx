'use client'

import { useAuth } from '../lib/auth'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Noticeboard MVP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect talented candidates with great opportunities. Whether you're looking for your next role or seeking exceptional talent, we've got you covered.
          </p>
        </div>

        {!user ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Candidates</h2>
              <p className="text-gray-600 mb-6">
                Create your profile, upload your resume, and let employers find you. Set your notice period and salary expectations to match with the right opportunities.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Upload resume and set skills
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Set notice period and availability
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Control your profile visibility
                </li>
              </ul>
              <Link
                href="/auth/signin"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Get Started as Candidate
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Employers</h2>
              <p className="text-gray-600 mb-6">
                Find talented candidates who are actively looking for new opportunities. Filter by skills, notice period, and salary expectations.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Search by skills and requirements
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Filter by notice period and salary
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Contact candidates directly
                </li>
              </ul>
              <Link
                href="/auth/signin"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Start Hiring
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Manage Your Profile</h2>
              <p className="text-gray-600 mb-6">
                Update your candidate profile, skills, and availability. Keep your information current to attract the best opportunities.
              </p>
              <Link
                href="/candidate/profile"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Profile
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Search Candidates</h2>
              <p className="text-gray-600 mb-6">
                Find talented candidates who match your requirements. Use advanced filters to narrow down your search.
              </p>
              <Link
                href="/employer/search"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Search Candidates
              </Link>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Profile</h4>
              <p className="text-gray-600">Candidates create detailed profiles with skills, experience, and availability.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Search & Filter</h4>
              <p className="text-gray-600">Employers search and filter candidates based on their specific requirements.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Connect</h4>
              <p className="text-gray-600">Employers contact candidates through our secure messaging system.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
