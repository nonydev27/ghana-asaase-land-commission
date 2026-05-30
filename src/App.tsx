import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import AdminGuard from '@/components/AdminGuard'
import AdminLayout from '@/components/AdminLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Registrations from '@/pages/Registrations'
import Transfers from '@/pages/Transfers'

const queryClient = new QueryClient()

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected admin routes */}
            <Route
              path="/"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </AdminGuard>
              }
            />
            <Route
              path="/registrations"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <Registrations />
                  </AdminLayout>
                </AdminGuard>
              }
            />
            <Route
              path="/transfers"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <Transfers />
                  </AdminLayout>
                </AdminGuard>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
