'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface Document {
  id: string
  name: string
  uploadDate: string
  domain: string
  summary?: string
}

interface DocumentHistoryProps {
  domain: string
}

export default function DocumentHistory({ domain }: DocumentHistoryProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchDocuments = async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/documents?userId=${user.uid}&domain=${domain}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDocument = async (documentId: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/documents?documentId=${documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid })
      })
      
      if (response.ok) {
        // Refresh the document list
        fetchDocuments()
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [domain, user])

  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {documents.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No documents uploaded yet</p>
          <p className="text-sm">Upload documents to start chatting</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                  {doc.summary && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {doc.summary}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => deleteDocument(doc.id)}
                  className="ml-2 text-gray-400 hover:text-red-600"
                  title="Delete document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
