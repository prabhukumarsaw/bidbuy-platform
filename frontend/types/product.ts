export interface Seller {
    id: number;
    name: string;
    rating: number;
    avatar: string;
  }
  
  export interface Product {
    id: number;
    title: string;
    image: string;
    currentBid: number;
    lotNumber: string;
    seller: Seller;
    endTime: string;
    bidders: number;
    category: string;
    description: string;
    condition: string;
  }
  
  export interface FilterState {
    categories: string[];
    conditions: string[];
    sellers: number[];
    priceRange: [number, number];
  }
  
  