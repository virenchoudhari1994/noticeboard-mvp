'use client'

import { useAuth } from '../lib/auth'
import Link from 'next/link'

export default function Navigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Noticeboard MVP
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/candidate/profile"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Candidate Profile
                </Link>
                                 <Link
                   href="/employer/search"
                   className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                 >
                   Search Candidates
                 </Link>
                 <Link
                   href="/employer/billing"
                   className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                 >
                   Billing
                 </Link>
                 <Link
                   href="/verification/request"
                   className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                 >
                   Get Verified
                 </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
