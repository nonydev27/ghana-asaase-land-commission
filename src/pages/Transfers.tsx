import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { formatDate, truncateAddress } from '@/data/adminMockData'
import {
  ArrowLeftRight, Search, ShieldCheck, AlertTriangle,
  CheckCircle2, XCircle, MapPin, ArrowRight, Loader2,
  User, TrendingUp, Clock, RefreshCw,
} from 'lucide-react'
import {
  usePurchaseRequests,
  useApprovePurchaseRequest,
  useRejectPurchaseRequest,
} from '@/hooks/useSupabaseData'

// ─── Types for joined data ────────────────────────────────────────────────────

type PurchaseRequestWithLand = {
  id: string
  land_id: string
  requester_name: string
  requester_email: string
  requester_phone: string | null
  requester_address: string | null
  request_type: string
  message: string | null
  status: string
  created_at: string
  updated_at: string
  lands: {
    id: string
    land_title: string
    location: string
    token_id: number | null
    owner_name: string | null
    owner_address: string
    size_sqm: number
    price: number | null
    currency: string | null
  } | null
}

// ─── Request type badge ───────────────────────────────────────────────────────

const RequestTypeBadge: React.FC<{ type: string }> = ({ type }) =>
  type === 'PURCHASE' ? (
    <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5">
      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
      <span className="text-amber-400 text-[11px] font-bold">Purchase</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-1.5">
      <ArrowLeftRight className="w-3.5 h-3.5 text-sky-400" />
      <span className="text-sky-400 text-[11px] font-bold">Inquiry</span>
    </div>
  )

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { color: string; label: string }> = {
    PENDING: { color: 'text-amber-400', label: 'Pending' },
    APPROVED: { color: 'text-emerald-400', label: 'Approved' },
    REJECTED: { color: 'text-red-400', label: 'Rejected' },
    COMPLETED: { color: 'text-purple-400', label: 'Completed' },
  }
  const s = map[status.toUpperCase()] ?? { color: 'text-white/40', label: status }
  return <span className={`text-[11px] font-semibold ${s.color}`}>{s.label}</span>
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const TransferModal: React.FC<{
  req: PurchaseRequestWithLand
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isProcessing: boolean
}> = ({ req, onClose, onApprove, onReject, isProcessing }) => {
  const land = req.lands
  const isPending = req.status.toUpperCase() === 'PENDING'

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-amber-400" />
          {req.request_type === 'PURCHASE' ? 'Purchase Request' : 'Inquiry'}: {land?.land_title ?? req.land_id}
        </DialogTitle>
        <DialogDescription>
          Request ID: {req.id.slice(0, 8)}…
          {land?.token_id != null ? ` · NFT #${land.token_id}` : ''}
          {' · '}{formatDate(req.created_at)}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {/* Type & status */}
        <div className="flex items-center gap-3 flex-wrap">
          <RequestTypeBadge type={req.request_type} />
          <StatusBadge status={req.status} />
        </div>

        {/* Message */}
        {req.message && (
          <div className="p-3.5 rounded-xl bg-sky-500/6 border border-sky-500/18">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Message from requester</p>
            <p className="text-sky-300/75 text-xs leading-relaxed">{req.message}</p>
          </div>
        )}

        {/* Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Land Owner (Seller) */}
          <div className="space-y-2">
            <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-red-400" />Current Owner
            </p>
            <div className="bg-white/3 rounded-2xl border border-white/6 p-4 space-y-2.5">
              <div>
                <p className="text-white/28 text-[10px] uppercase tracking-wider">Name</p>
                <p className="text-white text-sm font-semibold">{land?.owner_name ?? '—'}</p>
              </div>
              <div>
                <p className="text-white/28 text-[10px] uppercase tracking-wider">Wallet</p>
                <p className="text-emerald-400/70 text-[11px] font-mono break-all">
                  {land?.owner_address ? truncateAddress(land.owner_address) : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Requester (Buyer) */}
          <div className="space-y-2">
            <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />Requester
            </p>
            <div className="bg-white/3 rounded-2xl border border-white/6 p-4 space-y-2.5">
              <div>
                <p className="text-white/28 text-[10px] uppercase tracking-wider">Name</p>
                <p className="text-white text-sm font-semibold">{req.requester_name}</p>
              </div>
              <div>
                <p className="text-white/28 text-[10px] uppercase tracking-wider">Email</p>
                <p className="text-white/65 text-xs">{req.requester_email}</p>
              </div>
              {req.requester_phone && (
                <div>
                  <p className="text-white/28 text-[10px] uppercase tracking-wider">Phone</p>
                  <p className="text-white/65 text-xs">{req.requester_phone}</p>
                </div>
              )}
              {req.requester_address && (
                <div>
                  <p className="text-white/28 text-[10px] uppercase tracking-wider">Wallet</p>
                  <p className="text-sky-400/70 text-[11px] font-mono break-all">{truncateAddress(req.requester_address)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Land Info */}
        {land && (
          <div>
            <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />Land Details
            </p>
            <div className="flex items-center gap-4 bg-amber-500/5 border border-amber-500/14 rounded-2xl p-4">
              <div className="flex-1">
                <p className="text-white text-sm font-semibold mb-0.5">{land.land_title}</p>
                <p className="text-white/40 text-xs">{land.location}</p>
                {land.price && (
                  <p className="text-amber-400 font-bold text-xl mt-2">
                    {land.price.toLocaleString()} {land.currency ?? 'USD'}
                  </p>
                )}
              </div>
              {land.token_id != null && (
                <div className="text-right">
                  <p className="text-white/40 text-[11px] uppercase tracking-wider">NFT Token</p>
                  <p className="text-purple-400/70 text-[11px] font-mono">#{land.token_id}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-white/22 text-[10px] flex items-center gap-1">
          <Clock className="w-3 h-3" />Submitted: {formatDate(req.created_at)}
        </div>
      </div>

      <DialogFooter className="flex-row gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
          Close
        </Button>
        {isPending && (
          <>
            <Button variant="danger" onClick={() => onReject(req.id)} disabled={isProcessing} className="flex-1">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-1.5" />Reject</>}
            </Button>
            <Button variant="emerald" onClick={() => onApprove(req.id)} disabled={isProcessing} className="flex-1">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-1.5" />Approve</>}
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  )
}

// ─── Request card ─────────────────────────────────────────────────────────────

const RequestCard: React.FC<{
  req: PurchaseRequestWithLand
  onSelect: (r: PurchaseRequestWithLand) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  processing: string | null
}> = ({ req, onSelect, onApprove, onReject, processing }) => {
  const isProcessing = processing === req.id
  const land = req.lands
  const isPending = req.status.toUpperCase() === 'PENDING'

  return (
    <div className="group p-5 rounded-2xl bg-[#0d1f35] border border-white/6 hover:border-white/12 transition-all duration-200 animate-fade-in">
      {/* Info header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/8 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4.5 h-4.5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="text-white text-sm font-semibold truncate">{land?.land_title ?? req.land_id}</p>
            {land?.token_id != null && (
              <span className="text-purple-400/70 text-[10px] font-mono bg-purple-500/8 border border-purple-500/14 rounded-md px-1.5 py-0.5">
                NFT #{land.token_id}
              </span>
            )}
          </div>
          <p className="text-white/38 text-xs truncate">{land?.location ?? '—'}</p>
          {land?.price && (
            <p className="text-amber-400 font-bold text-sm mt-0.5">
              {land.price.toLocaleString()} {land.currency ?? 'USD'}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <RequestTypeBadge type={req.request_type} />
          <StatusBadge status={req.status} />
        </div>
      </div>

      {/* Parties */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-white/3 rounded-xl border border-white/6 p-3 min-w-0">
          <p className="text-white/28 text-[9px] uppercase tracking-wider mb-0.5">Current Owner</p>
          <p className="text-white/75 text-xs font-semibold truncate">{land?.owner_name ?? '—'}</p>
          <p className="text-white/28 text-[10px] font-mono truncate">
            {land?.owner_address ? truncateAddress(land.owner_address) : '—'}
          </p>
        </div>
        <div className="flex-shrink-0">
          <ArrowRight className="w-4 h-4 text-white/20" />
        </div>
        <div className="flex-1 bg-white/3 rounded-xl border border-white/6 p-3 min-w-0">
          <p className="text-white/28 text-[9px] uppercase tracking-wider mb-0.5">Requester</p>
          <p className="text-white/75 text-xs font-semibold truncate">{req.requester_name}</p>
          <p className="text-white/28 text-[10px] truncate">{req.requester_email}</p>
        </div>
      </div>

      {req.message && (
        <div className="mb-4 p-3 rounded-xl bg-sky-500/5 border border-sky-500/12">
          <p className="text-sky-300/60 text-xs leading-relaxed line-clamp-2">{req.message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white/22 text-[10px] flex items-center gap-1">
          <Clock className="w-3 h-3" />{formatDate(req.created_at)}
        </span>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => onSelect(req)} className="text-white/40 hover:text-white h-8 text-xs">
          View Details
        </Button>
        {isPending && (
          <>
            <Button variant="danger" size="sm" onClick={() => onReject(req.id)} disabled={isProcessing} className="h-8 text-xs">
              {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><XCircle className="w-3.5 h-3.5 mr-1" />Reject</>}
            </Button>
            <Button variant="emerald" size="sm" onClick={() => onApprove(req.id)} disabled={isProcessing} className="h-8 text-xs">
              {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve</>}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Transfers: React.FC = () => {
  const { data: requests = [], isLoading, refetch } = usePurchaseRequests()
  const approveMutation = useApprovePurchaseRequest()
  const rejectMutation = useRejectPurchaseRequest()

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PurchaseRequestWithLand | null>(null)
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
      showToast('Request approved. Parties have been notified.', 'success')
    } catch {
      showToast('Failed to approve request. Please try again.', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    try {
      await rejectMutation.mutateAsync(id)
      setSelected(null)
      showToast('Request rejected. Parties have been notified.', 'error')
    } catch {
      showToast('Failed to reject request. Please try again.', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const typedRequests = requests as PurchaseRequestWithLand[]

  const filtered = typedRequests.filter(req =>
    !search || [
      req.requester_name, req.requester_email,
      req.lands?.land_title ?? '', req.lands?.location ?? '', req.id,
    ].some(f => f.toLowerCase().includes(search.toLowerCase()))
  )

  const pendingCount = typedRequests.filter(r => r.status.toUpperCase() === 'PENDING').length
  const purchaseCount = typedRequests.filter(r => r.request_type === 'PURCHASE').length
  const inquiryCount = typedRequests.filter(r => r.request_type === 'INQUIRY').length

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
          <ArrowLeftRight className="w-4 h-4 text-sky-400" />
          <span className="text-sky-400/65 text-[11px] font-semibold tracking-widest uppercase">Purchase &amp; Inquiry Requests</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-bold text-2xl">Transfer Requests</h1>
            <p className="text-white/35 text-sm mt-0.5">Live purchase and inquiry requests from the Ghana Asaase platform.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 text-white/40 hover:text-white">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh
            </Button>
            {pendingCount > 0 && <Badge variant="warning">{pendingCount} pending</Badge>}
            <Badge variant="ghost">{typedRequests.length} total</Badge>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/14 animate-fade-in">
        <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-amber-300 text-xs font-semibold mb-0.5">Purchase &amp; Inquiry Review</p>
          <p className="text-amber-300/55 text-xs">
            Review purchase requests and inquiries submitted through the Ghana Asaase marketplace.
            Approve to notify both parties to proceed, or reject to decline the request.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative animate-fade-in">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
        <Input
          placeholder="Search by requester, land title, location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
        {[
          { label: 'Total Requests', val: typedRequests.length, color: 'text-white' },
          { label: 'Pending', val: pendingCount, color: 'text-amber-400' },
          { label: 'Purchase', val: purchaseCount, color: 'text-emerald-400' },
          { label: 'Inquiry', val: inquiryCount, color: 'text-sky-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0d1f35] rounded-xl border border-white/6 p-4 text-center">
            <p className={`font-bold text-xl ${s.color}`}>{s.val}</p>
            <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/25">
            <Loader2 className="w-8 h-8 mb-3 animate-spin opacity-40" />
            <p className="text-sm font-medium">Loading requests from Supabase…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/25">
            <ArrowLeftRight className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No transfer requests found</p>
          </div>
        ) : (
          filtered.map(req => (
            <RequestCard
              key={req.id}
              req={req}
              onSelect={setSelected}
              onApprove={handleApprove}
              onReject={handleReject}
              processing={processing}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <TransferModal
            req={selected}
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

export default Transfers
