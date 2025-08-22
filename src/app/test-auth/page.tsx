'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { Button } from '@/components/ui/button'
import { Bug, TestTube, ArrowRight, CheckCircle, XCircle } from 'lucide-react'

export default function TestAuthPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: false 
      })
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        setError('Sign in successful!')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <BackgroundPattern />
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl mb-6 shadow-lg">
              <Bug className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Auth Test Page
            </h1>
            <p className="text-gray-600">
              Test your OAuth configuration and debug issues
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            {/* Test Button */}
            <div className="mb-8">
              <Button
                onClick={testGoogleSignIn}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <TestTube className="w-5 h-5 mr-2" />
                {loading ? 'Testing...' : 'Test Google Sign In'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Error/Success Display */}
            {error && (
              <div className={`p-4 rounded-lg border mb-6 ${
                error === 'Sign in successful!' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  {error === 'Sign in successful!' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <p className={`text-sm font-medium ${
                    error === 'Sign in successful!' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Environment Check */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-gray-600" />
                Environment Check
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">NEXTAUTH_URL:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    process.env.NEXT_PUBLIC_NEXTAUTH_URL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">GOOGLE_CLIENT_ID:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">NEXTAUTH_SECRET:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ? 'Set' : 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need help?</strong> Check the{' '}
                <a href="/TROUBLESHOOTING.md" className="underline font-medium">troubleshooting guide</a>{' '}
                for common OAuth setup issues.
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <a 
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to sign in
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
