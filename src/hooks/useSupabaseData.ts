import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type LandRow = Tables<'lands'>
export type PurchaseRequestRow = Tables<'purchase_requests'>

// ─── Parse helpers ────────────────────────────────────────────────────────────

function parseCoordinates(raw: string): { lat: number; lng: number }[] {
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as { lat: number; lng: number }[]
  } catch { /* fall through */ }
  return []
}

function sqmToAcres(sqm: number): number {
  return Math.round(sqm * 0.000247105 * 100) / 100
}

// ─── Dashboard metrics ────────────────────────────────────────────────────────

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const [
        { count: totalLands },
        { count: pendingApprovals },
        { count: pendingTransfers },
        { data: recentLands },
      ] = await Promise.all([
        supabase.from('lands').select('*', { count: 'exact', head: true }),
        supabase.from('lands').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabase.from('purchase_requests').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabase.from('lands').select('created_at').order('created_at', { ascending: false }).limit(100),
      ])

      const now = new Date()
      const thisMonth = recentLands?.filter(l => {
        const d = new Date(l.created_at)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length ?? 0

      return {
        totalLands: totalLands ?? 0,
        pendingApprovals: pendingApprovals ?? 0,
        pendingTransfers: pendingTransfers ?? 0,
        landsThisMonth: thisMonth,
      }
    },
    refetchInterval: 30_000,
  })
}

// ─── Lands (registrations) ────────────────────────────────────────────────────

export function useLands(statusFilter?: string) {
  return useQuery({
    queryKey: ['lands', statusFilter],
    queryFn: async () => {
      let q = supabase.from('lands').select('*').order('created_at', { ascending: false })
      if (statusFilter) q = q.eq('status', statusFilter)
      const { data, error } = await q
      if (error) throw error
      return data ?? []
    },
    refetchInterval: 15_000,
  })
}

export function useAllLands() {
  return useQuery({
    queryKey: ['lands', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lands')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    refetchInterval: 15_000,
  })
}

// ─── Approve / Reject a land registration ─────────────────────────────────────

export function useApproveLand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lands')
        .update({ status: 'REGISTERED' })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lands'] })
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] })
    },
  })
}

export function useRejectLand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lands')
        .update({ status: 'REJECTED' })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lands'] })
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] })
    },
  })
}

// ─── Purchase requests (transfers) ────────────────────────────────────────────

export function usePurchaseRequests(statusFilter?: string) {
  return useQuery({
    queryKey: ['purchase-requests', statusFilter],
    queryFn: async () => {
      let q = supabase
        .from('purchase_requests')
        .select(`
          *,
          lands (
            id, land_title, location, token_id,
            owner_name, owner_address, size_sqm, price, currency
          )
        `)
        .order('created_at', { ascending: false })
      if (statusFilter) q = q.eq('status', statusFilter)
      const { data, error } = await q
      if (error) throw error
      return data ?? []
    },
    refetchInterval: 15_000,
  })
}

export function useApprovePurchaseRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('purchase_requests')
        .update({ status: 'APPROVED' })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-requests'] })
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] })
    },
  })
}

export function useRejectPurchaseRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('purchase_requests')
        .update({ status: 'REJECTED' })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-requests'] })
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] })
    },
  })
}

// ─── Re-export helpers ────────────────────────────────────────────────────────

export { parseCoordinates, sqmToAcres }
