'use client'

import { useAuth } from './contexts/AuthContext'
import LoginForm from './components/LoginForm'
import DomainSelection from './components/DomainSelection'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <DomainSelection />
}
