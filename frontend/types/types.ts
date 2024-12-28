export interface Bid {
  amount: number;
  timestamp: Date;
  userId: string;
  userName: string;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  minBidIncrement: number;
  endTime: Date;
  images: string[];
  specifications: Record<string, string>;
  dimensions: Record<string, string>;
  tags: string[];
}

export interface AutoBidConfig {
  maxAmount: number;
  incrementAmount: number;
  enabled: boolean;
}