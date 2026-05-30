import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import {
  LayoutDashboard, FileCheck2, ArrowLeftRight, LogOut,
  Menu, X, Shield, Bell, ChevronRight, ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDashboardMetrics } from '@/hooks/useSupabaseData'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: metrics } = useDashboardMetrics()

  const NAV_ITEMS = [
    { to: '/', end: true,  icon: LayoutDashboard, label: 'Dashboard',     description: 'Overview & metrics',  badge: null },
    { to: '/registrations', end: false, icon: FileCheck2,     label: 'Registrations', description: 'Approval queue',     badge: metrics?.pendingApprovals ?? null },
    { to: '/transfers',     end: false, icon: ArrowLeftRight, label: 'Transfers',      description: 'Transfer processing', badge: metrics?.pendingTransfers ?? null },
  ]

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src="/ghana-logo.png"
              alt="Ghana Asaase"
              className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-emerald-900/30"
            />
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#0d1f35] flex items-center justify-center">
              <Shield className="w-1.5 h-1.5 text-amber-900" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-[12px] leading-tight">Ghana Asaase</p>
            <p className="text-emerald-400/70 text-[9px] font-semibold leading-tight">Land Commission</p>
            <p className="text-emerald-400/40 text-[8px] font-semibold tracking-widest uppercase mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Management</p>
        {NAV_ITEMS.map(({ to, end, icon: Icon, label, description, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/15'
                  : 'text-white/45 hover:text-white/75 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/35 group-hover:bg-white/8 group-hover:text-white/55'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight">{label}</p>
                    <p className={`text-[10px] leading-tight truncate ${isActive ? 'text-emerald-400/45' : 'text-white/22'}`}>
                      {description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-500/25 text-emerald-300' : 'bg-amber-500/18 text-amber-400'
                    }`}>
                      {badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3 h-3 transition-all ${isActive ? 'text-emerald-400' : 'text-white/15 group-hover:text-white/35'}`} />
                </div>
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="px-3 pb-2 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Quick Links</p>
          <a
            href="https://ghana-asaase.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/65 hover:bg-white/5 transition-all border border-transparent"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/8 flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight">Main App</p>
              <p className="text-[10px] text-white/22">ghana-asaase.vercel.app</p>
            </div>
          </a>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-bold shadow flex-shrink-0">
            {admin?.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.name}</p>
            <p className="text-white/28 text-[10px] capitalize truncate">{admin?.role.replace('_', ' ')}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign out"
            className="w-7 h-7 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#060e1a] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#0d1f35] border-r border-white/5 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0d1f35] border-r border-white/5 z-50 lg:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="absolute top-4 right-4 text-white/35 hover:text-white" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#060e1a]/80 backdrop-blur-xl border-b border-white/5 h-14 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden text-white/45 hover:text-white w-9 h-9" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/30">
              <span className="text-emerald-400/60 font-medium">Ghana Asaase Land Commission</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/45">Admin Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-white/35 hover:text-white hover:bg-white/5 w-9 h-9 rounded-xl">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-9 rounded-xl text-white/50 hover:text-white hover:bg-white/5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-[10px] font-bold">
                    {admin?.avatarInitials}
                  </div>
                  <span className="hidden sm:block text-xs font-medium">{admin?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{admin?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                  <LogOut className="w-3.5 h-3.5 mr-2" />Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
