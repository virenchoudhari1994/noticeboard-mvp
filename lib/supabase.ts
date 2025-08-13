import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Candidate {
  id: string
  email: string
  full_name: string | null
  skills: string[] | null
  salary_min: number | null
  salary_max: number | null
  notice_end_date: string | null
  resume_path: string | null
  is_verified: boolean
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  verification_notes: string | null
  visibility: 'private' | 'public'
  created_at: string
  updated_at: string
}

export interface Employer {
  id: string
  email: string
  company_name: string
  full_name: string | null
  phone: string | null
  website: string | null
  is_verified: boolean
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  verification_notes: string | null
  subscription_tier: 'free' | 'basic' | 'premium'
  created_at: string
  updated_at: string
}

export interface ResumeMetadata {
  id: string
  candidate_id: string
  file_name: string
  file_size: number | null
  file_type: string | null
  upload_date: string
  storage_path: string
  is_active: boolean
}

export interface Contact {
  id: string
  candidate_id: string
  employer_id: string
  contact_type: 'view' | 'message' | 'interview_request' | 'offer'
  message: string | null
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  created_at: string
  updated_at: string
}

export interface Credit {
  id: string
  employer_id: string
  credit_type: 'view' | 'message' | 'interview_request'
  amount: number
  used: number
  expires_at: string | null
  created_at: string
}

export interface JobPosting {
  id: string
  employer_id: string
  title: string
  description: string | null
  requirements: string[] | null
  salary_min: number | null
  salary_max: number | null
  location: string | null
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance' | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VerificationRequest {
  id: string
  user_id: string
  user_type: 'candidate' | 'employer'
  verification_type: 'email' | 'document' | 'manual'
  status: 'pending' | 'approved' | 'rejected'
  document_path: string | null
  document_type: string | null
  email_domain: string | null
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  role: 'admin' | 'super_admin'
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface VerificationLog {
  id: string
  verification_request_id: string
  action: string
  performed_by: string
  performed_by_type: 'user' | 'admin' | 'system'
  details: any
  created_at: string
}
