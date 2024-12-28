import { faker } from '@faker-js/faker';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  joinedDate: Date;
  location: string;
  specialization: string[];
}

export interface Bid {
  id: string;
  title: string;
  image: string;
  images: string[];
  currentBid: number;
  startingBid: number;
  minimumBid: number;
  lotNumber: string;
  seller: Seller;
  endTime: Date;
  startTime: Date;
  bidders: number;
  totalBids: number;
  category: string;
  subCategory: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  description: string;
  specifications: Record<string, string>;
  shippingInfo: {
    international: boolean;
    domesticCost: number;
    internationalCost: number;
    handlingTime: string;
    restrictions: string[];
  };
  bidHistory: {
    amount: number;
    bidder: string;
    time: Date;
  }[];
  status: 'upcoming' | 'live' | 'ended';
  featured: boolean;
  trending: boolean;
  watchCount: number;
  viewCount: number;
  reservePrice: number;
  incrementAmount: number;
  tags: string[];
}

export const categories = [
  {
    name: 'Art',
    subCategories: ['Paintings', 'Sculptures', 'Prints', 'Photography', 'Digital Art']
  },
  {
    name: 'Collectibles',
    subCategories: ['Sports', 'Trading Cards', 'Coins', 'Stamps', 'Memorabilia']
  },
  {
    name: 'Electronics',
    subCategories: ['Smartphones', 'Laptops', 'Gaming', 'Audio', 'Cameras']
  },
  {
    name: 'Fashion',
    subCategories: ['Luxury', 'Vintage', 'Watches', 'Jewelry', 'Accessories']
  },
  {
    name: 'Real Estate',
    subCategories: ['Residential', 'Commercial', 'Land', 'Industrial', 'Agricultural']
  }
];

export const conditions = ['new', 'like-new', 'good', 'fair', 'poor'] as const;

export const generateSeller = (): Seller => {
  const specializations = faker.helpers.arrayElements(
    categories.map(c => c.name),
    faker.number.int({ min: 1, max: 3 })
  );

  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    avatar: faker.image.avatar(),
    rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
    totalSales: faker.number.int({ min: 10, max: 10000 }),
    verificationStatus: faker.helpers.arrayElement(['verified', 'pending', 'unverified']),
    joinedDate: faker.date.past(),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    specialization: specializations
  };
};

export const sellers: Seller[] = Array.from({ length: 20 }, generateSeller);

export const generateBidHistory = (startTime: Date, endTime: Date, startingBid: number, currentBid: number) => {
  const numBids = faker.number.int({ min: 1, max: 20 });
  const bidHistory = [];
  const bidIncrement = (currentBid - startingBid) / numBids;

  for (let i = 0; i < numBids; i++) {
    bidHistory.push({
      amount: startingBid + (bidIncrement * (i + 1)),
      bidder: faker.internet.userName(),
      time: faker.date.between({ from: startTime, to: endTime })
    });
  }

  return bidHistory.sort((a, b) => b.time.getTime() - a.time.getTime());
};

export const generateRandomBid = (): Bid => {
  const category = faker.helpers.arrayElement(categories);
  const startTime = faker.date.recent();
  const endTime = faker.date.soon({ days: 7 });
  const startingBid = faker.number.int({ min: 100, max: 1000 });
  const currentBid = faker.number.int({ min: startingBid, max: startingBid * 2 });
  const seller = faker.helpers.arrayElement(sellers);

  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    image: `/placeholder.svg?height=400&width=600`,
    images: Array.from({ length: 5 }, () => `/placeholder.svg?height=400&width=600`),
    currentBid,
    startingBid,
    minimumBid: startingBid * 1.1,
    lotNumber: faker.string.alphanumeric(8).toUpperCase(),
    seller,
    endTime,
    startTime,
    bidders: faker.number.int({ min: 1, max: 50 }),
    totalBids: faker.number.int({ min: 1, max: 100 }),
    category: category.name,
    subCategory: faker.helpers.arrayElement(category.subCategories),
    condition: faker.helpers.arrayElement(conditions),
    description: faker.commerce.productDescription(),
    specifications: {
      'Dimensions': `${faker.number.int({ min: 10, max: 100 })}cm x ${faker.number.int({ min: 10, max: 100 })}cm`,
      'Weight': `${faker.number.float({ min: 0.1, max: 10, precision: 0.1 })} kg`,
      'Material': faker.commerce.productMaterial(),
      'Brand': faker.company.name(),
      'Model': faker.string.alphanumeric(6).toUpperCase(),
    },
    shippingInfo: {
      international: faker.datatype.boolean(),
      domesticCost: faker.number.int({ min: 5, max: 50 }),
      internationalCost: faker.number.int({ min: 20, max: 200 }),
      handlingTime: `${faker.number.int({ min: 1, max: 5 })} business days`,
      restrictions: faker.helpers.arrayElements([
        'No PO Boxes',
        'Signature Required',
        'Insurance Required',
        'Adult Signature Required'
      ], faker.number.int({ min: 0, max: 2 }))
    },
    bidHistory: generateBidHistory(startTime, endTime, startingBid, currentBid),
    status: faker.helpers.arrayElement(['upcoming', 'live', 'ended']),
    featured: faker.datatype.boolean(),
    trending: faker.datatype.boolean(),
    watchCount: faker.number.int({ min: 0, max: 1000 }),
    viewCount: faker.number.int({ min: 100, max: 10000 }),
    reservePrice: currentBid * 1.5,
    incrementAmount: faker.number.int({ min: 5, max: 50 }),
    tags: faker.helpers.arrayElements([
      'Rare',
      'Vintage',
      'Limited Edition',
      'Exclusive',
      'Authenticated',
      'Popular',
      'Best Seller',
      'New Arrival'
    ], faker.number.int({ min: 2, max: 4 }))
  };
};

export const generateRandomBids = (count: number): Bid[] => {
  return Array.from({ length: count }, generateRandomBid);
};

// Helper functions for filtering and sorting
export const filterBids = (bids: Bid[], filters: {
  search?: string;
  category?: string;
  subCategory?: string;
  condition?: typeof conditions[number];
  minPrice?: number;
  maxPrice?: number;
  status?: 'upcoming' | 'live' | 'ended';
  seller?: string;
}) => {
  return bids.filter(bid => {
    if (filters.search && !bid.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && bid.category !== filters.category) {
      return false;
    }
    if (filters.subCategory && bid.subCategory !== filters.subCategory) {
      return false;
    }
    if (filters.condition && bid.condition !== filters.condition) {
      return false;
    }
    if (filters.minPrice && bid.currentBid < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && bid.currentBid > filters.maxPrice) {
      return false;
    }
    if (filters.status && bid.status !== filters.status) {
      return false;
    }
    if (filters.seller && bid.seller.id !== filters.seller) {
      return false;
    }
    return true;
  });
};

export const sortBids = (bids: Bid[], sortBy: string) => {
  const sortedBids = [...bids];
  switch (sortBy) {
    case 'price-asc':
      return sortedBids.sort((a, b) => a.currentBid - b.currentBid);
    case 'price-desc':
      return sortedBids.sort((a, b) => b.currentBid - a.currentBid);
    case 'ending-soon':
      return sortedBids.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
    case 'recently-added':
      return sortedBids.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    case 'most-bids':
      return sortedBids.sort((a, b) => b.totalBids - a.totalBids);
    case 'most-watched':
      return sortedBids.sort((a, b) => b.watchCount - a.watchCount);
    default:
      return sortedBids;
  }
};

