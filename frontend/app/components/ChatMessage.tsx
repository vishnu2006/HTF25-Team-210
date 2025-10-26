'use client'

import { useState } from 'react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [showSources, setShowSources] = useState(false)

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${message.type === 'user' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'} rounded-lg p-4 shadow-sm`}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowSources(!showSources)}
              className={`text-sm ${message.type === 'user' ? 'text-primary-100 hover:text-white' : 'text-primary-600 hover:text-primary-700'} underline`}
            >
              {showSources ? 'Hide Sources' : `Show Sources (${message.sources.length})`}
            </button>
            
            {showSources && (
              <div className="mt-2 space-y-2">
                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className={`text-xs p-2 rounded ${message.type === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <div className="font-medium mb-1">Source {index + 1}:</div>
                    <div className="whitespace-pre-wrap">{source}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
