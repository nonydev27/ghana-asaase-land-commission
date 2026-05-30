import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AdminUser {
  email: string
  name: string
  role: 'super_admin' | 'moderator'
  avatarInitials: string
}

interface AdminAuthContextType {
  admin: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

// Demo credentials — swap for real auth in production
const ADMIN_CREDENTIALS: Record<string, { password: string; name: string; role: AdminUser['role'] }> = {
  'admin@ghanaasaase.gov.gh': { password: 'Admin@2024!', name: 'Super Admin', role: 'super_admin' },
  'moderator@ghanaasaase.gov.gh': { password: 'Mod@2024!', name: 'Land Moderator', role: 'moderator' },
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ghana_admin_session')
    if (stored) {
      try { setAdmin(JSON.parse(stored)) } catch { localStorage.removeItem('ghana_admin_session') }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1200))
    const creds = ADMIN_CREDENTIALS[email]
    if (creds && creds.password === password) {
      const user: AdminUser = { email, name: creds.name, role: creds.role, avatarInitials: getInitials(creds.name) }
      setAdmin(user)
      localStorage.setItem('ghana_admin_session', JSON.stringify(user))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password. Please try again.' }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('ghana_admin_session')
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
