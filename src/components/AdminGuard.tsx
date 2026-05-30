import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Loader2 } from 'lucide-react'

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-900/50 border-t-emerald-500 animate-spin" />
          <p className="text-emerald-400/50 text-xs font-medium tracking-widest uppercase">Authenticating…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AdminGuard
