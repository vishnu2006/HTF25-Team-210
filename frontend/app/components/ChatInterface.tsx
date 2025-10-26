'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import DocumentUpload from './DocumentUpload'
import ChatMessage from './ChatMessage'
import DocumentHistory from './DocumentHistory'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp: Date
}

interface ChatInterfaceProps {
  domain: string
}

export default function ChatInterface({ domain }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          domain,
          userId: user?.uid
        })
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    router.push('/')
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    // Refresh the page to show new documents
    window.location.reload()
  }

  const domainNames: { [key: string]: string } = {
    educational: 'Educational',
    legal: 'Legal',
    healthcare: 'Healthcare',
    business: 'Business',
    general: 'General'
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`w-80 bg-white border-r border-gray-200 flex flex-col ${showHistory ? 'block' : 'hidden lg:block'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Document History</h2>
          <p className="text-sm text-gray-600">Domain: {domainNames[domain]}</p>
        </div>
        <DocumentHistory domain={domain} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {domainNames[domain]} Assistant
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary text-sm"
            >
              Upload Document
            </button>
            <button
              onClick={handleNewChat}
              className="btn-secondary text-sm"
            >
              New Chat
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to your {domainNames[domain]} Assistant
              </h3>
              <p className="text-gray-600 mb-6">
                Upload documents and start asking questions about their content.
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary"
              >
                Upload Your First Document
              </button>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showUpload && (
        <DocumentUpload
          domain={domain}
          onClose={() => setShowUpload(false)}
          onUpload={handleUploadSuccess}
        />
      )}
    </div>
  )
}
