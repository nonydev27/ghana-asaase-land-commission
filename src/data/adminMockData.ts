// ─── Types ────────────────────────────────────────────────────────────────────

export type RegistrationStatus = 'pending' | 'approved' | 'rejected'
export type TransferStatus = 'pending' | 'authorized' | 'cancelled'
export type GhanaCardStatus = 'verified' | 'unverified' | 'pending'

export interface PendingRegistration {
  id: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  ghanaCardId: string
  ghanaCardStatus: GhanaCardStatus
  walletAddress: string
  landTitle: string
  location: string
  region: string
  coordinates: { lat: number; lng: number }[]
  sizeAcres: number
  landUse: 'residential' | 'commercial' | 'agricultural' | 'industrial'
  titleDeedUrl: string
  surveyReportUrl: string
  submittedAt: string
  status: RegistrationStatus
  notes?: string
}

export interface PendingTransfer {
  id: string
  plotId: string
  landTitle: string
  location: string
  tokenId: number
  sellerName: string
  sellerAddress: string
  sellerWallet: string
  isVerifiedOwner: boolean
  buyerName: string
  buyerAddress: string
  buyerWallet: string
  agreedPriceGHS: number
  agreedPriceUSD: number
  initiatedAt: string
  status: TransferStatus
  notes?: string
}

export interface ActivityLog {
  id: string
  type: 'registration' | 'transfer' | 'approval' | 'rejection' | 'login' | 'nft_mint'
  actor: string
  message: string
  timestamp: string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardMetrics = {
  totalLands: 4821,
  pendingApprovals: 37,
  totalSalesVolumeGHS: 128450000,
  activeUsers: 2134,
  landsThisMonth: 142,
  salesThisMonth: 23,
  transfersThisMonth: 18,
  activeUsersThisWeek: 389,
}

export const monthlySalesData = [
  { month: 'Jan', volume: 8200000, count: 12 },
  { month: 'Feb', volume: 11500000, count: 18 },
  { month: 'Mar', volume: 9800000, count: 15 },
  { month: 'Apr', volume: 14200000, count: 22 },
  { month: 'May', volume: 16700000, count: 27 },
  { month: 'Jun', volume: 12300000, count: 19 },
  { month: 'Jul', volume: 18900000, count: 31 },
  { month: 'Aug', volume: 21400000, count: 35 },
  { month: 'Sep', volume: 15450000, count: 24 },
]

export const registrationsByRegion = [
  { region: 'Greater Accra', count: 1842, color: '#10b981' },
  { region: 'Ashanti', count: 987, color: '#f59e0b' },
  { region: 'Western', count: 612, color: '#3b82f6' },
  { region: 'Eastern', count: 543, color: '#8b5cf6' },
  { region: 'Central', count: 421, color: '#ec4899' },
  { region: 'Others', count: 416, color: '#6b7280' },
]

// ─── Registrations ────────────────────────────────────────────────────────────

export const pendingRegistrations: PendingRegistration[] = [
  {
    id: 'REG-2024-001',
    applicantName: 'Kwame Asante',
    applicantEmail: 'kwame.asante@gmail.com',
    applicantPhone: '+233 24 456 7890',
    ghanaCardId: 'GHA-000123456-7',
    ghanaCardStatus: 'verified',
    walletAddress: '0x3fA8b21E4C7d9e2F1a8B3c0D5e6F7a8B9cD0e1F',
    landTitle: 'Asante Family Plot – East Legon',
    location: 'East Legon, Accra',
    region: 'Greater Accra',
    coordinates: [
      { lat: 5.6367, lng: -0.1677 },
      { lat: 5.6370, lng: -0.1671 },
      { lat: 5.6364, lng: -0.1665 },
      { lat: 5.6361, lng: -0.1671 },
    ],
    sizeAcres: 0.75,
    landUse: 'residential',
    titleDeedUrl: '#',
    surveyReportUrl: '#',
    submittedAt: '2024-09-25T08:32:00Z',
    status: 'pending',
  },
  {
    id: 'REG-2024-002',
    applicantName: 'Abena Mensah',
    applicantEmail: 'abena.mensah@yahoo.com',
    applicantPhone: '+233 50 123 9876',
    ghanaCardId: 'GHA-000987654-3',
    ghanaCardStatus: 'verified',
    walletAddress: '0x9dC2f43A8B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5',
    landTitle: 'Mensah Commercial Hub – Kumasi',
    location: 'Adum, Kumasi',
    region: 'Ashanti',
    coordinates: [
      { lat: 6.6884, lng: -1.6248 },
      { lat: 6.6889, lng: -1.6241 },
      { lat: 6.6882, lng: -1.6236 },
      { lat: 6.6877, lng: -1.6243 },
    ],
    sizeAcres: 1.20,
    landUse: 'commercial',
    titleDeedUrl: '#',
    surveyReportUrl: '#',
    submittedAt: '2024-09-24T14:11:00Z',
    status: 'pending',
  },
  {
    id: 'REG-2024-003',
    applicantName: 'Kofi Boateng',
    applicantEmail: 'kofi.boateng@outlook.com',
    applicantPhone: '+233 27 765 4321',
    ghanaCardId: 'GHA-000543210-9',
    ghanaCardStatus: 'pending',
    walletAddress: '0x7bA1c90F2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7',
    landTitle: 'Boateng Farm Estate – Techiman',
    location: 'Techiman, Bono East',
    region: 'Bono East',
    coordinates: [
      { lat: 7.5908, lng: -1.9340 },
      { lat: 7.5918, lng: -1.9324 },
      { lat: 7.5905, lng: -1.9315 },
      { lat: 7.5895, lng: -1.9331 },
    ],
    sizeAcres: 8.50,
    landUse: 'agricultural',
    titleDeedUrl: '#',
    surveyReportUrl: '#',
    submittedAt: '2024-09-23T09:45:00Z',
    status: 'pending',
    notes: 'Awaiting NLC clearance for agricultural zoning.',
  },
  {
    id: 'REG-2024-004',
    applicantName: 'Ama Owusu',
    applicantEmail: 'ama.owusu@ghmail.com',
    applicantPhone: '+233 20 888 1234',
    ghanaCardId: 'GHA-000654321-1',
    ghanaCardStatus: 'verified',
    walletAddress: '0x2eD9a11B3C4D5e6F7a8B9c0D1e2F3a4B5c6D7e8',
    landTitle: 'Owusu Residential Compound – Tema',
    location: 'Tema Community 25',
    region: 'Greater Accra',
    coordinates: [
      { lat: 5.6698, lng: -0.0166 },
      { lat: 5.6703, lng: -0.0158 },
      { lat: 5.6698, lng: -0.0152 },
      { lat: 5.6693, lng: -0.0160 },
    ],
    sizeAcres: 0.50,
    landUse: 'residential',
    titleDeedUrl: '#',
    surveyReportUrl: '#',
    submittedAt: '2024-09-22T16:20:00Z',
    status: 'pending',
  },
  {
    id: 'REG-2024-005',
    applicantName: 'Yaw Darko',
    applicantEmail: 'yaw.darko@businessgh.com',
    applicantPhone: '+233 54 321 9870',
    ghanaCardId: 'GHA-000112233-4',
    ghanaCardStatus: 'unverified',
    walletAddress: '0x5fE3d88C6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1',
    landTitle: 'Darko Industrial Park – Takoradi',
    location: 'Takoradi Port Area',
    region: 'Western',
    coordinates: [
      { lat: 4.8934, lng: -1.7585 },
      { lat: 4.8945, lng: -1.7570 },
      { lat: 4.8938, lng: -1.7558 },
      { lat: 4.8927, lng: -1.7573 },
    ],
    sizeAcres: 3.80,
    landUse: 'industrial',
    titleDeedUrl: '#',
    surveyReportUrl: '#',
    submittedAt: '2024-09-21T11:00:00Z',
    status: 'pending',
    notes: 'Ghana Card ID unverified via NIA API. Manual review required.',
  },
  {
    id: 'REG-2024-006',
    applicantName: 'Efua Adjei',
    applicantEmail: 'efua.adjei@webmail.com',
    applicantPhone: '+233 26 543 2109',
    ghanaCardId: 'GHA-000778899-5',
    ghanaCardStatus: 'verified',
    walletAddress: '0x8cB4e22D1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6',
    landTitle: 'Adjei Heritage Land – Cape Coast',
    location: 'Cape Coast Central',
    region: 'Central',
    coordinates: [
      { lat: 5.1053, lng: -1.2466 },
      { lat: 5.1059, lng: -1.2458 },
      { lat: 5.1053, lng: -1.2451 },
      { lat: 5.1047, lng: -1.2459 },
    ],
    sizeAcres: 1.10,
    landUse: 'residential',
    titleDeedUrl: '#',
    surveyReportUrl: '#',
    submittedAt: '2024-09-20T13:55:00Z',
    status: 'pending',
  },
]

// ─── Transfers ────────────────────────────────────────────────────────────────

export const pendingTransfers: PendingTransfer[] = [
  {
    id: 'TXF-2024-001',
    plotId: 'PLOT-004821',
    landTitle: 'Asante Family Plot – East Legon',
    location: 'East Legon, Accra',
    tokenId: 4821,
    sellerName: 'Kwame Asante',
    sellerAddress: 'East Legon, Accra, GH',
    sellerWallet: '0x3fA8b21E4C7d9e2F1a8B3c0D5e6F7a8B9cD0e1F',
    isVerifiedOwner: true,
    buyerName: 'Nia Quartey',
    buyerAddress: 'Cantonments, Accra, GH',
    buyerWallet: '0x1aB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B',
    agreedPriceGHS: 980000,
    agreedPriceUSD: 65000,
    initiatedAt: '2024-09-25T10:14:00Z',
    status: 'pending',
  },
  {
    id: 'TXF-2024-002',
    plotId: 'PLOT-002345',
    landTitle: 'Mensah Commercial Hub – Kumasi',
    location: 'Adum, Kumasi',
    tokenId: 2345,
    sellerName: 'Abena Mensah',
    sellerAddress: 'Adum, Kumasi, GH',
    sellerWallet: '0x9dC2f43A8B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5',
    isVerifiedOwner: true,
    buyerName: 'Kofi Acheampong',
    buyerAddress: 'Nhyiaeso, Kumasi, GH',
    buyerWallet: '0x6eF7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F',
    agreedPriceGHS: 1450000,
    agreedPriceUSD: 96667,
    initiatedAt: '2024-09-24T15:30:00Z',
    status: 'pending',
  },
  {
    id: 'TXF-2024-003',
    plotId: 'PLOT-001102',
    landTitle: 'Oceanview Residential Estate',
    location: 'Labadi, Accra',
    tokenId: 1102,
    sellerName: 'Emmanuel Tetteh',
    sellerAddress: 'Labadi, Accra, GH',
    sellerWallet: '0x4aB5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B',
    isVerifiedOwner: false,
    buyerName: 'Grace Amponsah',
    buyerAddress: 'Cantonments, Accra, GH',
    buyerWallet: '0x2cD3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D',
    agreedPriceGHS: 2250000,
    agreedPriceUSD: 150000,
    initiatedAt: '2024-09-23T08:45:00Z',
    status: 'pending',
    notes: 'WARNING: Seller wallet does not match the registered NFT owner on-chain. Ownership verification FAILED.',
  },
  {
    id: 'TXF-2024-004',
    plotId: 'PLOT-003677',
    landTitle: 'Adjei Heritage Land – Cape Coast',
    location: 'Cape Coast Central',
    tokenId: 3677,
    sellerName: 'Efua Adjei',
    sellerAddress: 'Cape Coast, GH',
    sellerWallet: '0x8cB4e22D1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6',
    isVerifiedOwner: true,
    buyerName: 'Samuel Andoh',
    buyerAddress: 'Accra, GH',
    buyerWallet: '0x9eF0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F',
    agreedPriceGHS: 620000,
    agreedPriceUSD: 41333,
    initiatedAt: '2024-09-22T12:00:00Z',
    status: 'pending',
  },
]

// ─── Activity Feed ────────────────────────────────────────────────────────────

export const activityLogs: ActivityLog[] = [
  {
    id: 'ACT-001',
    type: 'nft_mint',
    actor: 'System',
    message: 'NFT Token #4821 minted for "Asante Family Plot – East Legon" on Sonic Chain.',
    timestamp: '2024-09-25T09:01:00Z',
  },
  {
    id: 'ACT-002',
    type: 'registration',
    actor: 'Kwame Asante',
    message: 'New registration submitted: "Asante Family Plot – East Legon" (REG-2024-001).',
    timestamp: '2024-09-25T08:32:00Z',
  },
  {
    id: 'ACT-003',
    type: 'approval',
    actor: 'Admin',
    message: 'REG-2024-000 approved. NFT mint triggered for Plot #4820.',
    timestamp: '2024-09-24T17:45:00Z',
  },
  {
    id: 'ACT-004',
    type: 'transfer',
    actor: 'Abena Mensah',
    message: 'Transfer initiated: "Mensah Commercial Hub" → Kofi Acheampong (PLOT-002345).',
    timestamp: '2024-09-24T15:30:00Z',
  },
  {
    id: 'ACT-005',
    type: 'registration',
    actor: 'Ama Owusu',
    message: 'New registration submitted: "Owusu Residential Compound – Tema" (REG-2024-004).',
    timestamp: '2024-09-22T16:20:00Z',
  },
  {
    id: 'ACT-006',
    type: 'rejection',
    actor: 'Admin',
    message: 'REG-2024-999 rejected. Reason: Duplicate title deed detected.',
    timestamp: '2024-09-22T14:10:00Z',
  },
  {
    id: 'ACT-007',
    type: 'login',
    actor: 'admin@ghanaasaase.gov.gh',
    message: 'Admin login from IP 41.200.xxx.xxx (Accra, GH).',
    timestamp: '2024-09-22T09:00:00Z',
  },
  {
    id: 'ACT-008',
    type: 'nft_mint',
    actor: 'System',
    message: 'NFT Token #3677 minted for "Adjei Heritage Land – Cape Coast" on Sonic Chain.',
    timestamp: '2024-09-21T11:30:00Z',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatGHS(amount: number): string {
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function truncateAddress(addr: string): string {
  if (addr.length < 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
