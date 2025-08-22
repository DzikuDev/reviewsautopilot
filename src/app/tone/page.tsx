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
    page: number
    limit: number
    total: number
    pages: number
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
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          settings,
          isActive: true
        })
      })

      if (!response.ok) throw new Error('Failed to save tone profile')

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        formality: 'friendly',
        emotion: 'positive',
        length: 'medium',
        personality: ''
      })
      setEditingProfile(null)
      setIsCreateDialogOpen(false)
      
      // Refresh the list
      await fetchToneProfiles()
    } catch (error) {
      console.error('Error saving tone profile:', error)
      alert('Failed to save tone profile')
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
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete tone profile')

      await fetchToneProfiles()
    } catch (error) {
      console.error('Error deleting tone profile:', error)
      alert('Failed to delete tone profile')
    }
  }

  const getFormalityColor = (formality: string) => {
    switch (formality) {
      case 'formal': return 'bg-blue-100 text-blue-800'
      case 'casual': return 'bg-green-100 text-green-800'
      case 'friendly': return 'bg-purple-100 text-purple-800'
      case 'professional': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'neutral': return 'bg-yellow-100 text-yellow-800'
      case 'empathetic': return 'bg-pink-100 text-pink-800'
      case 'enthusiastic': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tone Profiles</h1>
                <p className="mt-2 text-gray-600">
                  Manage the tone and personality of your AI-generated review responses
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tone Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProfile ? 'Edit Tone Profile' : 'Create New Tone Profile'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Profile Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Friendly & Professional"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe when to use this tone profile..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="formality">Formality Level</Label>
                        <Select value={formData.formality} onValueChange={(value) => setFormData(prev => ({ ...prev, formality: value as any }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="emotion">Emotional Tone</Label>
                        <Select value={formData.emotion} onValueChange={(value) => setFormData(prev => ({ ...prev, emotion: value as any }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="empathetic">Empathetic</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="length">Response Length</Label>
                        <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value as any }))}>
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
                        onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                        placeholder="e.g., warm, helpful, solution-oriented"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Describe specific personality traits for this tone profile
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingProfile ? 'Update Profile' : 'Create Profile'}
                      </Button>
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
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tone Profiles List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tone profiles...</p>
            </div>
          ) : toneProfiles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tone profiles yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first tone profile to customize how AI generates review responses.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toneProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        {profile.description && (
                          <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(profile)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(profile.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className={getFormalityColor(profile.settings.formality || '')}>
                          {profile.settings.formality || 'friendly'}
                        </Badge>
                        <Badge variant="secondary" className={getEmotionColor(profile.settings.emotion || '')}>
                          {profile.settings.emotion || 'positive'}
                        </Badge>
                        <Badge variant="outline">
                          {profile.settings.length || 'medium'} length
                        </Badge>
                      </div>

                      {profile.settings.personality && (
                        <div className="text-sm text-gray-600">
                          <strong>Personality:</strong> {profile.settings.personality}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created by {profile.createdBy.name || profile.createdBy.email}</span>
                        <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={profile.isActive ? "default" : "secondary"}>
                          {profile.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
