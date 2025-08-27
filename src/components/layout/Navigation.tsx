'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Sparkles, Building2, MessageSquare, FileText, Settings, RefreshCw } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Sparkles },
  { name: 'Reviews', href: '/reviews', icon: MessageSquare },
  { name: 'Drafts', href: '/drafts', icon: FileText },
  { name: 'Templates', href: '/templates', icon: Building2 },
  { name: 'Tone Profiles', href: '/tone-profiles', icon: Settings },
  { name: 'Integrations', href: '/integrations', icon: RefreshCw },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Reviews Autopilot
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`h-10 px-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right side - Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 backdrop-blur-md dark:bg-gray-900/95">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
