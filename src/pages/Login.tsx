import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Eye, EyeOff, Loader2, Hexagon, MapPin, Lock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── Carousel slides ──────────────────────────────────────────────────────────

const SLIDES = [
  {
    bg: 'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.18) 0%, transparent 65%), linear-gradient(135deg, #022c17 0%, #0a2e1a 50%, #071a10 100%)',
    tag: 'Greater Accra',
    icon: '🌿',
    title: "Ghana's Land, On-Chain",
    body: 'Every square metre of Ghanaian soil secured on the Sonic blockchain — transparent, tamper-proof, permanent.',
    stat: '4,821 Parcels Registered',
    dotColor: '#10b981',
  },
  {
    bg: 'radial-gradient(ellipse at 70% 40%, rgba(245,158,11,0.18) 0%, transparent 65%), linear-gradient(135deg, #1a0e05 0%, #2a1500 50%, #0f0a00 100%)',
    tag: 'Accra Metro',
    icon: '🏙️',
    title: 'Accra Rising',
    body: "Modern Accra's growth demands verified, blockchain-backed land ownership records across every district.",
    stat: '1,842 Parcels in Greater Accra',
    dotColor: '#f59e0b',
  },
  {
    bg: 'radial-gradient(ellipse at 50% 60%, rgba(14,165,233,0.14) 0%, transparent 65%), linear-gradient(135deg, #0a1a2e 0%, #071220 50%, #040a14 100%)',
    tag: 'Sonic Network',
    icon: '⛓️',
    title: 'NFT Land Deeds',
    body: 'Each approved land parcel is minted as an ERC-721 NFT — owned, traded, and verified entirely on-chain.',
    stat: '128.45M GHS Total Volume',
    dotColor: '#38bdf8',
  },
  {
    bg: 'radial-gradient(ellipse at 20% 70%, rgba(168,85,247,0.14) 0%, transparent 65%), linear-gradient(135deg, #130a1a 0%, #1a0d22 50%, #0a0510 100%)',
    tag: 'NLC Integrated',
    icon: '🔐',
    title: 'Transparent Governance',
    body: 'Every registration, approval, and transfer logged immutably — giving citizens and government full accountability.',
    stat: '2,134 Active Users',
    dotColor: '#a78bfa',
  },
]

// ─── Decorative svg grid ──────────────────────────────────────────────────────

const GridOverlay = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" />
    <polygon points="100,100 200,80 220,180 120,200" fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.5" />
    <polygon points="260,130 390,110 400,230 270,250" fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.4" />
    <polygon points="450,160 570,140 580,265 460,280" fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.45" />
    <polygon points="160,310 290,290 305,390 170,410" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.35" />
    <polygon points="360,330 480,310 490,425 370,445" fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.4" />
    <circle cx="160" cy="150" r="4" fill="#10b981" opacity="0.6" />
    <circle cx="325" cy="170" r="3" fill="#f59e0b" opacity="0.5" />
    <circle cx="515" cy="202" r="4" fill="#10b981" opacity="0.55" />
    <circle cx="228" cy="350" r="3" fill="#38bdf8" opacity="0.45" />
    <circle cx="425" cy="378" r="4" fill="#f59e0b" opacity="0.5" />
  </svg>
)

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

// ─── Component ────────────────────────────────────────────────────────────────

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoginError(null)
    const res = await login(data.email, data.password)
    if (!res.success) setLoginError(res.error || 'Login failed')
  }

  const s = SLIDES[slide]

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left: carousel ── */}
      <div
        className="hidden lg:flex lg:w-[58%] relative flex-col transition-all duration-1000 ease-in-out"
        style={{ background: s.bg }}
      >
        <GridOverlay />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base">Ghana Asaase</p>
              <p className="text-white/35 text-[10px] tracking-widest uppercase">Land Registry Platform</p>
            </div>
          </div>

          {/* Slide content */}
          <div className="my-auto max-w-md" key={slide}>
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold tracking-wider uppercase">{s.tag}</span>
            </div>
            <div className="text-5xl mb-5 animate-float">{s.icon}</div>
            <h1 className="text-white font-extrabold text-[2.4rem] leading-[1.1] mb-4 animate-fade-in">{s.title}</h1>
            <p className="text-white/48 text-base leading-relaxed mb-8 animate-fade-in">{s.body}</p>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm animate-scale-in">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: s.dotColor }} />
              <span className="text-white/65 text-sm font-medium">{s.stat}</span>
            </div>
          </div>

          {/* Carousel dots + arrows */}
          <div className="flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`h-1 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/18 hover:bg-white/35'}`} />
            ))}
            <div className="ml-auto flex gap-2">
              <button onClick={() => setSlide(p => (p - 1 + SLIDES.length) % SLIDES.length)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setSlide(p => (p + 1) % SLIDES.length)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 bg-[#060e1a] flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Ghana Asaase</p>
              <p className="text-white/35 text-[10px] tracking-widest uppercase">Admin Portal</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/18 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-emerald-400 text-[11px] font-semibold tracking-widest uppercase">Secure Admin Access</span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-white/38 text-sm leading-relaxed">Sign in to manage land registrations and ownership transfers.</p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/14">
            <p className="text-amber-400/65 text-[11px] font-semibold mb-1.5 uppercase tracking-wider">Demo Credentials</p>
            <p className="text-amber-300/55 text-[11px] font-mono">admin@ghanaasaase.gov.gh</p>
            <p className="text-amber-300/55 text-[11px] font-mono">Admin@2024!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Official Email</Label>
              <Input id="email" type="email" placeholder="admin@ghanaasaase.gov.gh" {...register('email')} className="h-11" />
              {errors.email && <p className="text-red-400 text-[11px] flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••••" {...register('password')} className="h-11 pr-11" />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/28 hover:text-white/55 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[11px] flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>}
            </div>

            {loginError && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/8 border border-red-500/18 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-xs">{loginError}</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} variant="emerald" className="w-full h-11 mt-2">
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Authenticating…</>
                : <><Lock className="w-4 h-4 mr-2" />Sign In to Admin</>
              }
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/18 text-xs">Ghana Asaase Security Protocol v2.4</p>
            <p className="text-white/12 text-[10px] mt-0.5">All sessions are logged and monitored.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
