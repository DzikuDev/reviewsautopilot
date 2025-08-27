'use client'

import { PostHogProvider as Provider } from 'posthog-js/react'
import posthog, { type PostHog } from 'posthog-js'
import { ReactNode, useEffect } from 'react'

interface PostHogProviderProps {
  children: ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    
    // Only initialize PostHog if we have a valid key and we're not in development
    if (posthogKey && posthogKey.trim() !== '' && process.env.NODE_ENV === 'production') {
      try {
        posthog.init(posthogKey, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
          loaded: (ph: PostHog) => {
            console.log('PostHog initialized successfully')
          },
          capture_pageview: false,
          disable_session_recording: true,
        })
      } catch (error) {
        console.warn('PostHog initialization failed:', error)
      }
    } else {
      console.log('PostHog disabled - no key provided or in development mode')
    }
  }, [])

  // For development or when no PostHog key is provided, just render children
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!posthogKey || posthogKey.trim() === '' || process.env.NODE_ENV === 'development') {
    return <>{children}</>
  }

  return (
    <Provider client={posthog}>
      {children}
    </Provider>
  )
}
