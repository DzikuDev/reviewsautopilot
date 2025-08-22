'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, MessageSquare, Wand2, Save, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  provider: 'GOOGLE' | 'FACEBOOK'
  rating: number
  text: string
  title?: string | null
  authorName?: string | null
  publishedAt: string
  location: {
    name: string
    address?: string | null
    phone?: string | null
  }
}

interface Template {
  id: string
  name: string
  content: string
  minStars?: number | null
  maxStars?: number | null
}

interface ToneProfile {
  id: string
  name: string
  settings: any
}

interface Draft {
  id: string
  content: string
  status: string
  violations: any
}

export default function ReplyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [toneProfiles, setToneProfiles] = useState<ToneProfile[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none')
  const [selectedTone, setSelectedTone] = useState<string>('none')
  const [customPrompt, setCustomPrompt] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchReview()
    fetchTemplates()
    fetchToneProfiles()
  }, [params.id])

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/reviews/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch review')
      const data = await response.json()
      setReview(data.review)
    } catch (error) {
      console.error('Error fetching review:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const fetchToneProfiles = async () => {
    try {
      const response = await fetch('/api/tone-profiles')
      if (response.ok) {
        const data = await response.json()
        setToneProfiles(data.toneProfiles || [])
      }
    } catch (error) {
      console.error('Error fetching tone profiles:', error)
    }
  }

  const generateDraft = async () => {
    try {
      setGenerating(true)
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: params.id,
          templateId: selectedTemplate !== 'none' ? selectedTemplate : undefined,
          toneProfileId: selectedTone !== 'none' ? selectedTone : undefined,
          customPrompt: customPrompt || undefined
        })
      })

      if (!response.ok) throw new Error('Failed to generate draft')

      const data = await response.json()
      setDraft(data.draft)
    } catch (error) {
      console.error('Error generating draft:', error)
    } finally {
      setGenerating(false)
    }
  }

  const saveDraft = async () => {
    if (!draft) return

    try {
      setSaving(true)
      const response = await fetch(`/api/drafts/${draft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          content: draft.content
        })
      })

      if (!response.ok) throw new Error('Failed to save draft')

      // Redirect to draft management
      router.push(`/drafts/${draft.id}`)
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setSaving(false)
    }
  }

  const approveAndPublish = async () => {
    if (!draft) return

    try {
      setSaving(true)
      const response = await fetch(`/api/drafts/${draft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve'
        })
      })

      if (!response.ok) throw new Error('Failed to publish reply')

      // Redirect back to reviews
      router.push('/reviews')
    } catch (error) {
      console.error('Error publishing reply:', error)
    } finally {
      setSaving(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400'
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getViolationBadges = () => {
    if (!draft?.violations?.violations) return null

    return draft.violations.violations.map((violation: any, index: number) => (
      <Badge 
        key={index} 
        variant={violation.blocked ? "destructive" : "secondary"}
        className="text-xs"
      >
        {violation.type}
      </Badge>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 transition-colors duration-200">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading review...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 transition-colors duration-200">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Review not found</h3>
            <Button asChild className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/reviews">Back to Reviews</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 transition-colors duration-200">
      <Navigation />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-6 h-10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Link href="/reviews">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reviews
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Reply to Review</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Generate and customize your response to this customer review
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review Display */}
            <div className="space-y-6">
              <Card className="glass card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <MessageSquare className="w-5 h-5" />
                    Review Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">
                        {review.authorName || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {review.title && (
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{review.title}</h3>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{review.text}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Star className={`w-5 h-5 ${getRatingColor(review.rating)} fill-current`} />
                        <span className={`text-sm font-semibold ${getRatingColor(review.rating)}`}>
                          {review.rating} / 5
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{review.location.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Options */}
              <Card className="glass card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Wand2 className="w-5 h-5" />
                    Generation Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Template (Optional)
                    </label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="input-focus">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No template</SelectItem>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tone Profile (Optional)
                    </label>
                    <Select value={selectedTone} onValueChange={setSelectedTone}>
                      <SelectTrigger className="input-focus">
                        <SelectValue placeholder="Select tone profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Default tone</SelectItem>
                        {toneProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Custom Instructions (Optional)
                    </label>
                    <Textarea
                      placeholder="Add specific instructions for the AI..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={3}
                      className="input-focus resize-none"
                    />
                  </div>

                  <Button 
                    onClick={generateDraft} 
                    disabled={generating}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    {generating ? 'Generating...' : 'Generate Response'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Draft Editor */}
            <div className="space-y-6">
              <Card className="glass card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <MessageSquare className="w-5 h-5" />
                    Response Draft
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!draft ? (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                      <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Generate a response to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Response Content
                        </label>
                        <Textarea
                          value={draft.content}
                          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                          rows={8}
                          className="input-focus resize-none font-medium"
                        />
                      </div>

                      {/* Policy Violations */}
                      {draft.violations?.violations?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Policy Check Results
                          </label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {getViolationBadges()}
                          </div>
                          {draft.violations.blocked && (
                            <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              This response cannot be published due to policy violations.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={saveDraft} 
                          disabled={saving}
                          variant="outline"
                          className="flex-1 h-12"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                        
                        <Button 
                          onClick={approveAndPublish} 
                          disabled={saving || draft.violations?.blocked}
                          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Publish Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
