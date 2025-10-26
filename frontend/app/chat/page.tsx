'use client'

import { useSearchParams } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import ChatInterface from '../components/ChatInterface'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const domain = searchParams.get('domain') || 'general'
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to access the chat interface.</p>
        </div>
      </div>
    )
  }

  return <ChatInterface domain={domain} />
}
