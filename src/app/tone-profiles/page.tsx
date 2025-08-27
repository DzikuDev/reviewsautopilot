'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Settings, Star } from 'lucide-react'
import Link from 'next/link'

interface ToneProfile {
  id: string
  name: string
  description?: string | null
  settings: {
    formality?: 'formal' | 'casual' | 'friendly' | 'professional'
    emotion?: 'positive' | 'neutral' | 'empathetic' | 'enthusiastic'
    length?: 'short' | 'medium' | 'long'
    personality?: string
  }
  isActive: boolean
  createdAt: string
  createdBy: {
    name?: string | null
    email?: string | null
  }
}

interface ToneProfilesResponse {
  toneProfiles: ToneProfile[]
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
}

export default function ToneProfilesPage() {
  const [toneProfiles, setToneProfiles] = useState<ToneProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<ToneProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    formality: 'friendly',
    emotion: 'positive',
    length: 'medium',
    personality: ''
  })

  useEffect(() => {
    fetchToneProfiles()
  }, [])

  const fetchToneProfiles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tone-profiles')
      if (!response.ok) throw new Error('Failed to fetch tone profiles')

      const data: ToneProfilesResponse = await response.json()
      setToneProfiles(data.toneProfiles)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching tone profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const settings = {
      formality: formData.formality,
      emotion: formData.emotion,
      length: formData.length,
      personality: formData.personality
    }

    try {
      const url = editingProfile 
        ? `/api/tone-profiles/${editingProfile.id}`
        : '/api/tone-profiles'
      
      const method = editingProfile ? 'PUT' : 'POST'
      
      console.log('Submitting tone profile:', { url, method, data: { name: formData.name, description: formData.description, settings } })
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          settings
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`Failed to save tone profile: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      console.log('Success response:', responseData)

      await fetchToneProfiles()
      setIsCreateDialogOpen(false)
      setEditingProfile(null)
      setFormData({
        name: '',
        description: '',
        formality: 'friendly',
        emotion: 'positive',
        length: 'medium',
        personality: ''
      })
    } catch (error) {
      console.error('Error saving tone profile:', error)
      // Show user-friendly error message in the UI instead of alert
      // You can add a toast notification or error state here
    }
  }

  const handleEdit = (profile: ToneProfile) => {
    setEditingProfile(profile)
    setFormData({
      name: profile.name,
      description: profile.description || '',
      formality: profile.settings.formality || 'friendly',
      emotion: profile.settings.emotion || 'positive',
      length: profile.settings.length || 'medium',
      personality: profile.settings.personality || ''
    })
    setIsCreateDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tone profile?')) return

    try {
      const response = await fetch(`/api/tone-profiles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete tone profile')

      await fetchToneProfiles()
    } catch (error) {
      console.error('Error deleting tone profile:', error)
    }
  }

  const getFormalityColor = (formality: string) => {
    switch (formality) {
      case 'formal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'casual': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'friendly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'professional': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'neutral': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'empathetic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'enthusiastic': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getLengthColor = (length: string) => {
    switch (length) {
      case 'short': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'long': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Tone Profiles
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create and manage AI response tone profiles for consistent brand voice
            </p>
          </div>

          {/* Create Button */}
          <div className="mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tone Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProfile ? 'Edit Tone Profile' : 'Create New Tone Profile'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Professional & Friendly"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe when to use this tone profile"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="formality">Formality</Label>
                      <Select value={formData.formality} onValueChange={(value) => setFormData({ ...formData, formality: value as any })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="emotion">Emotion</Label>
                      <Select value={formData.emotion} onValueChange={(value) => setFormData({ ...formData, emotion: value as any })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="empathetic">Empathetic</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="length">Length</Label>
                      <Select value={formData.length} onValueChange={(value) => setFormData({ ...formData, length: value as any })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="personality">Personality Traits</Label>
                    <Input
                      id="personality"
                      value={formData.personality}
                      onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                      placeholder="e.g., helpful, knowledgeable, approachable"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false)
                        setEditingProfile(null)
                        setFormData({
                          name: '',
                          description: '',
                          formality: 'friendly',
                          emotion: 'positive',
                          length: 'medium',
                          personality: ''
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProfile ? 'Update Profile' : 'Create Profile'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tone Profiles Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tone profiles...</p>
            </div>
          ) : toneProfiles.length === 0 ? (
            <Card className="glass card-hover">
              <CardContent className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No tone profiles yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first tone profile to define how AI should respond to reviews
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toneProfiles.map((profile) => (
                <Card key={profile.id} className="glass card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {profile.name}
                        </CardTitle>
                        {profile.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {profile.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(profile)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(profile.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={getFormalityColor(profile.settings.formality || '')}>
                          {profile.settings.formality}
                        </Badge>
                        <Badge className={getEmotionColor(profile.settings.emotion || '')}>
                          {profile.settings.emotion}
                        </Badge>
                        <Badge className={getLengthColor(profile.settings.length || '')}>
                          {profile.settings.length}
                        </Badge>
                      </div>
                      
                      {profile.settings.personality && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Personality:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {profile.settings.personality}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Created by {profile.createdBy.name || profile.createdBy.email}</span>
                          <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => fetchToneProfiles()}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchToneProfiles()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
