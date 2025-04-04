export interface BidHistory {
  bidTime: string;
  previousPrice: number;
}

export interface Bidder {
  id: string;
  name: string;
  email: string;
}

export interface AuctionUpdate {
  auctionId: string;
  currentPrice: number;
  timeRemaining: number;
  timestamp: string;
}

export interface OutbidNotification {
  auctionId: string;
  newBidAmount: number;
  message: string;
  timestamp: string;
}

export interface Bid {
  id: string;
  amount: number;
  auctionId: string;
  auction: AuctionItem;
  bidderId: string;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
  bidHistory?: BidHistory;
  bidder: {
    id: string;
    name: string;
    email: string;
  };
  
}

export enum BidStatus {
  PLACED = 'PLACED',
  OUTBID = 'OUTBID',
  WINNING = 'WINNING',
  WON = 'WON',
  LOST = 'LOST',
}

export interface BidsResponse {
  success: boolean;
  data: {
    bids: Bid[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
  message: string;
}

export interface TopBidder {
  rank: number;
  name: string;
  bid: number;
  time: string;
}

export interface AuctionFilters {
  status?: string | string[];
  categoryId?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  startTime?: string;
  endTime?: string;
  sellerName?: string;
  sellerId?: string;
}

export interface AuctionItem {
  id: number;
  title: string;
  description?: string;
  startingPrice: number;
  currentPrice: number;
  minBidIncrement: number;
  reservePrice?: number;
  startTime: string;
  endTime: string;
  creatorId: string;
  category: Category;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED' | 'SOLD';
  auctionState: 'RUNNING' | 'PAUSED' | 'RESUMED' | 'STOPPED';
  categoryId: string;
  featuredImage?: string;
  images: string[];
  tags: string[];
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  winnerId?: string;
  views: number;
  seller: Seller;
  totalBids: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface AutoBidConfig {
  maxAmount: number;
  incrementAmount: number;
  enabled: boolean;
}

export interface AuctionStats {
  total: number;
  active: number;
  ended: number;
  totalBids: number;
  totalViews: number;
  totalRevenue: number;
  totalAuctions: number;
  activeAuctions: number;
  completedAuctions: number;
}

export interface AuctionAnalytics {
  dailyViews: { date: string; count: number }[];
  dailyBids: { date: string; count: number }[];
  topAuctions: AuctionItem[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
  emailVerified: boolean;
  mobile?: string;
  address?: string;
  bio?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  parentId?: string | null;
  parent?: Category | null; // Parent category reference
  children: Category[]; // Array of subcategories
  isActive: boolean;
}

export enum SellerStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: SellerStatus;
  verified: boolean;
  verifiedAt?: string;
  suspended: boolean;
  suspendedAt?: string;
  suspensionReason?: string;
  gstNumber: string;
  gstDocument: string;
  aadhaarNumber: string;
  aadhaarDocument: string;
  panNumber: string;
  panDocument: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
    image: string | null;
  };
}

export type SortOrder = 'asc' | 'desc';

export interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
  sortable?: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface SortingState {
  sortBy: string;
  sortOrder: SortOrder;
  onSort: (sortBy: string, sortOrder: SortOrder) => void;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface InboxMessage {
  id: string;
  content: string;
  read: boolean;
  createdAt: Date;
}