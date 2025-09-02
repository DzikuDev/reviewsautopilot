'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Plus, Edit, Trash2, MapPin, Calendar, User } from 'lucide-react'

interface Organization {
  id: string
  name: string
  createdAt: string
  memberships: Array<{
    id: string
    role: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
  locations: Array<{
    id: string
    name: string
    address?: string
  }>
  _count?: {
    memberships: number
    locations: number
    templates: number
    toneProfiles: number
  }
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: ''
  })

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orgs')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(Array.isArray(data.orgs) ? data.orgs : [data.org].filter(Boolean))
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      alert('Organization name is required')
      return
    }

    try {
      const response = await fetch('/api/orgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name })
      })

      if (!response.ok) throw new Error('Failed to create organization')

      // Reset form and close dialog
      setFormData({ name: '' })
      setIsCreateDialogOpen(false)
      
      // Refresh the list
      await fetchOrganizations()
    } catch (error) {
      console.error('Error creating organization:', error)
      alert('Failed to create organization')
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'OWNER': { variant: 'default' as const, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
      'ADMIN': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'MEMBER': { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig['MEMBER']

    return (
      <Badge variant={config.variant} className={`${config.color} border-0`}>
        {role}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 transition-colors duration-200">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Organizations
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Manage your organizations and team members
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Create New Organization
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Organization Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter organization name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="h-12 input-focus"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({ name: '' })
                          setIsCreateDialogOpen(false)
                        }}
                        className="flex-1 h-12"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Create Organization
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Organizations List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading organizations...</p>
            </div>
          ) : organizations.length === 0 ? (
            <Card className="glass card-hover">
              <CardContent className="text-center py-16">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No organizations yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Create your first organization to get started with team management
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Organization
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {organizations.map((org) => (
                <Card key={org.id} className="glass card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {org.name}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created {new Date(org.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {org.memberships.length} member{org.memberships.length !== 1 ? 's' : ''}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {org.locations.length} location{org.locations.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Members */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Team Members</h4>
                        <div className="space-y-2">
                          {org.memberships.map((membership) => (
                            <div key={membership.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {membership.user.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {membership.user.email}
                                  </p>
                                </div>
                              </div>
                              {getRoleBadge(membership.role)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Locations */}
                      {org.locations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Locations</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {org.locations.map((location) => (
                              <div key={location.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {location.name}
                                  </p>
                                  {location.address && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {location.address}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {org.memberships.length}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {org.locations.length}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Locations</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {org._count?.templates || 0}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Templates</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {org._count?.toneProfiles || 0}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tone Profiles</p>
                        </div>
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
