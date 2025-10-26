'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

const domains = [
  {
    id: 'educational',
    name: 'Educational',
    icon: '📘',
    description: 'Simplify explanations and define terms clearly',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: '⚖️',
    description: 'Strictly base on document text, avoid assumptions',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🩺',
    description: 'Provide informational insights only, with disclaimer',
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Extract insights, key trends, and summaries',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  {
    id: 'general',
    name: 'General Usage',
    icon: '🌐',
    description: 'Default conversational mode',
    color: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  }
]

export default function DomainSelection() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId)
    // Navigate to chat interface with selected domain
    router.push(`/chat?domain=${domainId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Document QA System</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Use Case</h2>
          <p className="text-xl text-gray-600">
            Select a domain to customize the AI assistant for your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => handleDomainSelect(domain.id)}
              className={`${domain.color} border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{domain.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {domain.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {domain.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by Gemini API and Vector Intelligence
          </p>
        </div>
      </main>
    </div>
  )
}
