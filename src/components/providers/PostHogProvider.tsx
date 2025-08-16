'use client'

import { PostHogProvider as Provider } from 'posthog-js/react'
import { ReactNode } from 'react'

interface PostHogProviderProps {
  children: ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  if (typeof window !== 'undefined') {
    const posthog = require('posthog-js')
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog: any) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
    })
  }

  return (
    <Provider client={typeof window !== 'undefined' ? require('posthog-js') : undefined}>
      {children}
    </Provider>
  )
}
