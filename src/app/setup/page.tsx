'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

export default function SetupPage() {
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/orgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName.trim() })
      })

      if (!response.ok) throw new Error('Failed to create organization')

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      console.error('Error creating organization:', error)
      alert('Failed to create organization. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <BackgroundPattern />
        <div className="min-h-screen flex items-center justify-center p-6 relative">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Organization created!
            </h1>
            <p className="text-gray-600 mb-6">
              Redirecting you to your dashboard...
            </p>
            <div className="inline-flex items-center justify-center w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <BackgroundPattern />
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Reviews Autopilot
            </h1>
            <p className="text-gray-600">
              Let's get your organization set up to start managing reviews
            </p>
          </div>

          {/* Setup Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="orgName" className="text-base font-medium text-gray-700 mb-2 block">
                  Organization Name
                </Label>
                <Input
                  id="orgName"
                  type="text"
                  placeholder="Enter your organization name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  This will be the name of your business or organization
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !orgName.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  <>
                    Create Organization
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Features Preview */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                What you'll get:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  AI-powered review response generation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Google Business Profile integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Response templates and tone profiles
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automated review management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
