'use client'

import { PostHogProvider as Provider } from 'posthog-js/react'
import posthog, { type PostHog } from 'posthog-js'
import { ReactNode, useEffect } from 'react'

interface PostHogProviderProps {
  children: ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (ph: PostHog) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  return (
    <Provider client={posthog}>
      {children}
    </Provider>
  )
}
