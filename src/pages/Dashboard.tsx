import React from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  monthlySalesData, registrationsByRegion,
  activityLogs, timeAgo,
  type ActivityLog,
} from '@/data/adminMockData'
import { useDashboardMetrics } from '@/hooks/useSupabaseData'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  MapPin, FileCheck2, TrendingUp, Users, ArrowRight,
  Hexagon, Cpu, ShieldCheck, ArrowUpRight, Clock,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const activityIcon: Record<ActivityLog['type'], React.ReactNode> = {
  registration: <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />,
  transfer: <ArrowRight className="w-3.5 h-3.5 text-amber-400" />,
  approval: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
  rejection: <ShieldCheck className="w-3.5 h-3.5 text-red-400" />,
  login: <Users className="w-3.5 h-3.5 text-white/40" />,
  nft_mint: <Hexagon className="w-3.5 h-3.5 text-purple-400" />,
}

const activityBg: Record<ActivityLog['type'], string> = {
  registration: 'bg-sky-500/10 border-sky-500/20',
  transfer: 'bg-amber-500/10 border-amber-500/20',
  approval: 'bg-emerald-500/10 border-emerald-500/20',
  rejection: 'bg-red-500/10 border-red-500/20',
  login: 'bg-white/5 border-white/10',
  nft_mint: 'bg-purple-500/10 border-purple-500/20',
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  trend: string
  trendUp: boolean
  accent: string
  delay?: string
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, sub, trend, trendUp, accent, delay = '0ms' }) => (
  <Card
    className="relative overflow-hidden group hover:border-white/12 transition-all duration-300 animate-slide-up"
    style={{ animationDelay: delay }}
  >
    {/* Accent glow */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent}`} />
    <CardContent className="p-5 relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.replace('bg-gradient', 'bg').split(' ')[0]}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-semibold flex items-center gap-1 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
          <ArrowUpRight className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
          {trend}
        </span>
      </div>
      <p className="text-white font-bold text-2xl leading-none mb-1">{value}</p>
      <p className="text-white/45 text-xs font-medium">{label}</p>
      <p className="text-white/22 text-[10px] mt-0.5">{sub}</p>
    </CardContent>
  </Card>
)

// ─── Custom chart tooltip ─────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1f35] border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-white/50 mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.name === 'volume' ? `GHS ${(p.value / 1000000).toFixed(1)}M` : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { admin } = useAdminAuth()
  const { data: liveMetrics } = useDashboardMetrics()
  const m = {
    totalLands: liveMetrics?.totalLands ?? 0,
    pendingApprovals: liveMetrics?.pendingApprovals ?? 0,
    totalSalesVolumeGHS: 128_450_000,
    salesThisMonth: liveMetrics?.pendingTransfers ?? 0,
    activeUsers: 2134,
    activeUsersThisWeek: 847,
    landsThisMonth: liveMetrics?.landsThisMonth ?? 0,
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400/60 text-[11px] font-semibold tracking-widest uppercase">Live Overview</span>
        </div>
        <h1 className="text-white font-bold text-2xl">
          {/* Welcome, {admin?.name?.split(' ')[0]} Admin */} Welcome, Admin
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Here's what's happening on Ghana Asaase today.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={<MapPin className="w-5 h-5 text-emerald-400" />}
          label="Total Registered Lands"
          value={m.totalLands.toLocaleString()}
          sub={`+${m.landsThisMonth} this month`}
          trend="+3.1%"
          trendUp
          accent="bg-emerald-500/5 border-emerald-500/15"
          delay="0ms"
        />
        <MetricCard
          icon={<FileCheck2 className="w-5 h-5 text-amber-400" />}
          label="Pending Approvals"
          value={m.pendingApprovals.toString()}
          sub="Requires your attention"
          trend="+8 today"
          trendUp={false}
          accent="bg-amber-500/5 border-amber-500/15"
          delay="80ms"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5 text-sky-400" />}
          label="Total Sales Volume"
          value={`${(m.totalSalesVolumeGHS / 1000000).toFixed(1)}M GHS`}
          sub={`+${m.salesThisMonth} sales this month`}
          trend="+12.4%"
          trendUp
          accent="bg-sky-500/5 border-sky-500/15"
          delay="160ms"
        />
        <MetricCard
          icon={<Users className="w-5 h-5 text-purple-400" />}
          label="Active Users"
          value={m.activeUsers.toLocaleString()}
          sub={`${m.activeUsersThisWeek} active this week`}
          trend="+5.7%"
          trendUp
          accent="bg-purple-500/5 border-purple-500/15"
          delay="240ms"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Volume Area Chart */}
        <Card className="xl:col-span-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Volume</CardTitle>
                <p className="text-white/28 text-[11px] mt-0.5">Monthly GHS transaction value — 2024</p>
              </div>
              <Badge variant="success">+18% YTD</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlySalesData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cntGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="volume" name="volume" stroke="#10b981" strokeWidth={2} fill="url(#volGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie by region */}
        <Card className="animate-slide-up" style={{ animationDelay: '160ms' }}>
          <CardHeader className="pb-2">
            <CardTitle>Registrations by Region</CardTitle>
            <p className="text-white/28 text-[11px] mt-0.5">Distribution across regions</p>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={registrationsByRegion} dataKey="count" nameKey="region" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} strokeWidth={0}>
                  {registrationsByRegion.map((r) => (
                    <Cell key={r.region} fill={r.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div className="bg-[#0d1f35] border border-white/10 rounded-xl p-2.5 text-xs">
                    <p className="text-white font-semibold">{payload[0].name}</p>
                    <p className="text-white/50">{payload[0].value?.toLocaleString()} parcels</p>
                  </div>
                ) : null} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {registrationsByRegion.map((r) => (
                <div key={r.region} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="text-white/45 text-[10px] truncate">{r.region}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: monthly sales bar + activity */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Monthly count bar */}
        <Card className="xl:col-span-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle>Monthly Registrations</CardTitle>
            <p className="text-white/28 text-[11px] mt-0.5">Number of new land parcels registered</p>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlySalesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="registrations" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="xl:col-span-3 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-white/28 text-[11px] mt-0.5">Real-time system & user events</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400/60 text-[10px] font-medium">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[220px] pr-1">
              <div className="space-y-2">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-white/3 ${activityBg[log.type]}`}
                  >
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${activityBg[log.type]}`}>
                      {activityIcon[log.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-xs leading-snug">{log.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/28 text-[10px]">{log.actor}</span>
                        <span className="text-white/15 text-[10px]">•</span>
                        <span className="text-white/28 text-[10px] flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />{timeAgo(log.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Blockchain status banner */}
      <Card className="animate-slide-up border-emerald-500/12 bg-gradient-to-r from-emerald-950/50 to-transparent" style={{ animationDelay: '300ms' }}>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Sonic Network — Connected</p>
                <p className="text-white/35 text-xs">Contract: 0x58053D…928C · Chain ID: 146 (Mainnet)</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'NFTs Minted', value: '4,821' },
                { label: 'Block Height', value: '~9.2M' },
                { label: 'Gas (Gwei)', value: '0.0012' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-emerald-400 font-bold text-base">{stat.value}</p>
                  <p className="text-white/28 text-[10px]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
