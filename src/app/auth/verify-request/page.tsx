'use client'

import { BackgroundPattern } from '@/components/ui/background-pattern'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyRequestPage() {
  return (
    <>
      <BackgroundPattern />
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-600">
              We've sent you a magic link to sign in
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Magic link sent!
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              We've sent a secure sign-in link to your email address. 
              Click the link in your email to access your account.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
              </p>
            </div>

            <Link 
              href="/auth/signin"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the email?{' '}
              <a href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">Try again</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}