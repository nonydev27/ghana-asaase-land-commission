import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatDate, truncateAddress } from '@/data/adminMockData'
import {
  FileCheck2, Search, MapPin, Phone, Mail, ExternalLink,
  CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ShieldX, Clock,
  User, FileText, Map, Loader2, ChevronDown, RefreshCw,
} from 'lucide-react'
import {
  useAllLands,
  useApproveLand,
  useRejectLand,
  parseCoordinates,
  sqmToAcres,
  type LandRow,
} from '@/hooks/useSupabaseData'

// ─── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string | null }> = ({ status }) => {
  const s = (status ?? 'REGISTERED').toUpperCase()
  if (s === 'PENDING') return (
    <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5">
      <Clock className="w-3.5 h-3.5 text-amber-400" />
      <span className="text-amber-400 text-[11px] font-semibold">Pending Review</span>
    </div>
  )
  if (s === 'REGISTERED') return (
    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-emerald-400 text-[11px] font-semibold">Registered</span>
    </div>
  )
  if (s === 'REJECTED') return (
    <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1.5">
      <ShieldX className="w-3.5 h-3.5 text-red-400" />
      <span className="text-red-400 text-[11px] font-semibold">Rejected</span>
    </div>
  )
  return (
    <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg px-2.5 py-1.5">
      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
      <span className="text-sky-400 text-[11px] font-semibold">{status}</span>
    </div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const RegistrationModal: React.FC<{
  land: LandRow
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isProcessing: boolean
}> = ({ land, onClose, onApprove, onReject, isProcessing }) => {
  const coords = parseCoordinates(land.coordinates)
  const acres = sqmToAcres(land.size_sqm)
  const isPending = (land.status ?? '').toUpperCase() === 'PENDING'

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          {land.land_title}
        </DialogTitle>
        <DialogDescription>
          Land ID: {land.id.slice(0, 8)}… · Token #{land.token_id ?? 'Unassigned'} · Submitted {formatDate(land.created_at)}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {/* Status */}
        <div className="flex items-center gap-3">
          <StatusBadge status={land.status} />
          {land.land_use && (
            <Badge variant="info" className="capitalize">{land.land_use}</Badge>
          )}
        </div>

        {/* Description */}
        {land.description && (
          <div className="p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/18">
            <p className="text-amber-300/75 text-xs">{land.description}</p>
          </div>
        )}

        {/* Applicant */}
        <div>
          <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />Applicant Information
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Full Name', value: land.owner_name ?? '—' },
              { label: 'Email', value: land.owner_email ?? '—' },
              { label: 'Phone', value: land.owner_phone ?? '—' },
              { label: 'Wallet / Address', value: truncateAddress(land.owner_address) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/3 rounded-xl p-3 border border-white/6">
                <p className="text-white/35 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-white text-xs font-medium break-all">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Land details */}
        <div>
          <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />Land Details
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Location', value: land.location },
              { label: 'Land Use', value: land.land_use ?? '—' },
              { label: 'Size (sqm)', value: `${land.size_sqm.toLocaleString()} m²` },
              { label: 'Size (Acres)', value: `${acres} ac` },
              { label: 'Price', value: land.price ? `${land.price.toLocaleString()} ${land.currency ?? 'USD'}` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/3 rounded-xl p-3 border border-white/6">
                <p className="text-white/35 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-white text-xs font-medium capitalize">{value}</p>
              </div>
            ))}
          </div>
          {coords.length > 0 && (
            <div className="mt-3 bg-white/3 rounded-xl p-3 border border-white/6">
              <p className="text-white/35 text-[10px] uppercase tracking-wider mb-1">Survey Coordinates (Polygon)</p>
              <div className="flex flex-wrap gap-1.5">
                {coords.map((c, i) => (
                  <span key={i} className="text-emerald-400/70 text-[10px] font-mono bg-emerald-500/8 border border-emerald-500/14 rounded-md px-2 py-0.5">
                    {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Images */}
        {land.images && land.images.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />Uploaded Images
              </p>
              <div className="grid grid-cols-3 gap-2">
                {land.images.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/8 hover:border-white/18 transition-all group relative">
                    <img src={url} alt={`Land image ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <DialogFooter className="flex-row gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
          Close
        </Button>
        {isPending && (
          <>
            <Button
              variant="danger"
              onClick={() => onReject(land.id)}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-1.5" />Reject</>}
            </Button>
            <Button
              variant="emerald"
              onClick={() => onApprove(land.id)}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-1.5" />Verify & Approve</>}
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  )
}

// ─── Row Card ─────────────────────────────────────────────────────────────────

const RegistrationRow: React.FC<{
  land: LandRow
  onSelect: (l: LandRow) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  processing: string | null
}> = ({ land, onSelect, onApprove, onReject, processing }) => {
  const isProcessing = processing === land.id
  const acres = sqmToAcres(land.size_sqm)
  const isPending = (land.status ?? '').toUpperCase() === 'PENDING'

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-[#0d1f35] border border-white/6 hover:border-white/12 transition-all duration-200 animate-fade-in">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4.5 h-4.5 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="text-white text-sm font-semibold truncate">{land.land_title}</p>
            {land.land_use && <Badge variant="info" className="capitalize text-[10px]">{land.land_use}</Badge>}
          </div>
          <p className="text-white/40 text-xs truncate mb-1">
            <span className="text-white/55">{land.owner_name ?? truncateAddress(land.owner_address)}</span>
            {' · '}{land.location}{' · '}{acres} ac
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/25 text-[10px] font-mono">{land.id.slice(0, 8)}…</span>
            <span className="text-white/15 text-[10px]">·</span>
            <span className="text-white/25 text-[10px]">{formatDate(land.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
        <StatusBadge status={land.status} />
        <Button variant="ghost" size="sm" onClick={() => onSelect(land)} className="text-white/45 hover:text-white text-xs h-8">
          Details <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
        {isPending && (
          <>
            <Button variant="danger" size="sm" onClick={() => onReject(land.id)} disabled={isProcessing} className="h-8 text-xs">
              {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><XCircle className="w-3.5 h-3.5 mr-1" />Reject</>}
            </Button>
            <Button variant="emerald" size="sm" onClick={() => onApprove(land.id)} disabled={isProcessing} className="h-8 text-xs">
              {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve</>}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Registrations: React.FC = () => {
  const { data: lands = [], isLoading, refetch } = useAllLands()
  const approveMutation = useApproveLand()
  const rejectMutation = useRejectLand()

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterUse, setFilterUse] = useState('all')
  const [selected, setSelected] = useState<LandRow | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleApprove = async (id: string) => {
    setProcessing(id)
    try {
      await approveMutation.mutateAsync(id)
      setSelected(null)
      showToast('Land registration approved and set to REGISTERED.', 'success')
    } catch {
      showToast('Failed to approve registration. Please try again.', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    try {
      await rejectMutation.mutateAsync(id)
      setSelected(null)
      showToast('Registration rejected. Applicant will be notified.', 'error')
    } catch {
      showToast('Failed to reject registration. Please try again.', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const filtered = lands.filter(land => {
    const matchSearch = !search || [land.land_title, land.owner_name ?? '', land.location, land.id]
      .some(f => f.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = filterStatus === 'all' || (land.status ?? 'REGISTERED').toUpperCase() === filterStatus
    const matchUse = filterUse === 'all' || land.land_use === filterUse
    return matchSearch && matchStatus && matchUse
  })

  const pendingCount = lands.filter(l => (l.status ?? '').toUpperCase() === 'PENDING').length
  const registeredCount = lands.filter(l => (l.status ?? 'REGISTERED').toUpperCase() === 'REGISTERED').length
  const rejectedCount = lands.filter(l => (l.status ?? '').toUpperCase() === 'REJECTED').length

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl animate-slide-up ${
          toastMsg.type === 'success' ? 'bg-emerald-950 border-emerald-500/25 text-emerald-300' : 'bg-red-950 border-red-500/25 text-red-300'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span className="text-sm">{toastMsg.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <FileCheck2 className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400/65 text-[11px] font-semibold tracking-widest uppercase">Land Registry</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-bold text-2xl">Land Registrations</h1>
            <p className="text-white/35 text-sm mt-0.5">Live data from Supabase — all registrations on the Ghana Asaase platform.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 text-white/40 hover:text-white">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh
            </Button>
            {pendingCount > 0 && <Badge variant="warning" className="text-sm px-3 py-1.5">{pendingCount} pending</Badge>}
            <Badge variant="ghost" className="text-sm px-3 py-1.5">{lands.length} total</Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 animate-fade-in">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input
            placeholder="Search by name, title, location, ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px] h-10"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REGISTERED">Registered</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterUse} onValueChange={setFilterUse}>
          <SelectTrigger className="w-[150px] h-10"><SelectValue placeholder="Land Use" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Use Types</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="agricultural">Agricultural</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
        {[
          { label: 'Total Lands', val: lands.length, color: 'text-white' },
          { label: 'Registered', val: registeredCount, color: 'text-emerald-400' },
          { label: 'Pending Review', val: pendingCount, color: 'text-amber-400' },
          { label: 'Rejected', val: rejectedCount, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0d1f35] rounded-xl border border-white/6 p-4 text-center">
            <p className={`font-bold text-xl ${s.color}`}>{s.val}</p>
            <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/25">
            <Loader2 className="w-8 h-8 mb-3 animate-spin opacity-40" />
            <p className="text-sm font-medium">Loading registrations from Supabase…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/25">
            <FileCheck2 className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No registrations match your filters</p>
            <p className="text-xs mt-0.5">Try adjusting the search or filter criteria</p>
          </div>
        ) : (
          filtered.map(land => (
            <RegistrationRow
              key={land.id}
              land={land}
              onSelect={setSelected}
              onApprove={handleApprove}
              onReject={handleReject}
              processing={processing}
            />
          ))
        )}
      </div>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <RegistrationModal
            land={selected}
            onClose={() => setSelected(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            isProcessing={processing === selected.id}
          />
        )}
      </Dialog>
    </div>
  )
}

export default Registrations
