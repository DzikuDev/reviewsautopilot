'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Star, FileText } from 'lucide-react'

interface Template {
  id: string
  name: string
  content: string
  description?: string | null
  minStars?: number | null
  maxStars?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: {
    name: string
    email: string
  }
}

interface TemplatesResponse {
  templates: Template[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    description: '',
    minStars: 'any',
    maxStars: 'any',
    isActive: true
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data: TemplatesResponse = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.content) {
      alert('Name and content are required')
      return
    }

    try {
      const url = editingTemplate 
        ? `/api/templates/${editingTemplate.id}`
        : '/api/templates'
      
      const method = editingTemplate ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          content: formData.content,
          description: formData.description || null,
          minStars: formData.minStars !== 'any' ? parseInt(formData.minStars) : null,
          maxStars: formData.maxStars !== 'any' ? parseInt(formData.maxStars) : null,
          isActive: formData.isActive
        })
      })

      if (!response.ok) throw new Error('Failed to save template')

      // Reset form and close dialog
      setFormData({
        name: '',
        content: '',
        description: '',
        minStars: 'any',
        maxStars: 'any',
        isActive: true
      })
      setEditingTemplate(null)
      setIsCreateDialogOpen(false)
      
      // Refresh the list
      await fetchTemplates()
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template')
    }
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      content: template.content,
      description: template.description || '',
      minStars: template.minStars?.toString() || 'any',
      maxStars: template.maxStars?.toString() || 'any',
      isActive: template.isActive
    })
    setIsCreateDialogOpen(true)
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete template')

      // Refresh the list
      await fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  const getRatingRange = (minStars?: number | null, maxStars?: number | null) => {
    if (!minStars && !maxStars) return 'Any rating'
    if (minStars && maxStars) return `${minStars}-${maxStars} stars`
    if (minStars) return `${minStars}+ stars`
    if (maxStars) return `Up to ${maxStars} stars`
    return 'Any rating'
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
                  Response Templates
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Create and manage AI response templates for different review scenarios
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editingTemplate ? 'Edit Template' : 'Create New Template'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Template Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Thank You for Positive Review"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="h-12 input-focus"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Description (Optional)
                      </Label>
                      <Input
                        id="description"
                        type="text"
                        placeholder="Brief description of when to use this template"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="h-12 input-focus"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minStars">Minimum Rating</Label>
                        <Select value={formData.minStars} onValueChange={(value) => setFormData(prev => ({ ...prev, minStars: value }))}>
                          <SelectTrigger className="input-focus">
                            <SelectValue placeholder="Any rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any rating</SelectItem>
                            <SelectItem value="1">1+ stars</SelectItem>
                            <SelectItem value="2">2+ stars</SelectItem>
                            <SelectItem value="3">3+ stars</SelectItem>
                            <SelectItem value="4">4+ stars</SelectItem>
                            <SelectItem value="5">5 stars only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="maxStars">Maximum Rating</Label>
                        <Select value={formData.maxStars} onValueChange={(value) => setFormData(prev => ({ ...prev, maxStars: value }))}>
                          <SelectTrigger className="input-focus">
                            <SelectValue placeholder="Any rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any rating</SelectItem>
                            <SelectItem value="1">1 star only</SelectItem>
                            <SelectItem value="2">Up to 2 stars</SelectItem>
                            <SelectItem value="3">Up to 3 stars</SelectItem>
                            <SelectItem value="4">Up to 4 stars</SelectItem>
                            <SelectItem value="5">Up to 5 stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Template Content
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="Write your template content here. Use {customerName} for dynamic customer names."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        className="input-focus resize-none"
                        required
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Use {'{customerName}'} to dynamically insert the customer's name
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingTemplate(null)
                          setFormData({
                            name: '',
                            content: '',
                            description: '',
                            minStars: 'any',
                            maxStars: 'any',
                            isActive: true
                          })
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
                        {editingTemplate ? 'Update Template' : 'Create Template'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Templates List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <Card className="glass card-hover">
              <CardContent className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No templates yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Create your first response template to get started with AI-powered review responses
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="glass card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {template.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {template.description || 'No description provided'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                            <Star className="w-3 h-3 mr-1" />
                            {getRatingRange(template.minStars, template.maxStars)}
                          </Badge>
                          <Badge variant={template.isActive ? "default" : "secondary"}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {template.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Created by {template.createdBy.name}</span>
                        <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(template)}
                          className="flex-1 h-9"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
