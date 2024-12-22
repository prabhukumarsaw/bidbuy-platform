// eslint-disable-next-line
// @ts-nocheck

import { Suspense } from "react"
import Image from "next/image"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Search, MapPin, Phone, Mail, Clock, Tag, Share2, Heart, Eye, BarChart2, ArrowLeft, Info } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import ProductGallery from "./product-gallery"
import CountdownTimer from "./countdown-timer"
import BiddingForm from "./bidding-form"
import BidHistory from "./bid-history"
import RelatedItems from "./related-items"
import AuctioneerNotes from "./auctioneer-notes"
import ShareModal from "./share-modal"
// import BidGraph from "./bid-graph"

export const metadata: Metadata = {
  title: "Auction Detail",
  description: "Premium auction product detail page",
}

interface AuctionDetailProps {
  params: {
    id: string
  }
}

async function getAuctionDetail(id: string) {
  // This would be an API call in a real application
  return {
    id: "ICNB-34",
    lotNumber: "137684",
    title: "Vintage Aladdin's Lamp: A Gilded Journey Through Time",
    description: "Embark on a magical journey with this exquisite Vintage Aladdin's Lamp. Crafted with meticulous attention to detail, this piece embodies the allure of ancient Arabian nights and the refinement of Victorian craftsmanship. Its golden hues and intricate engravings tell a story of opulence and mystery, making it a true collector's gem.",
    currentBid: 2898.00,
    nextMinBid: 2973.00,
    startingBid: 1000.00,
    condition: "Excellent",
    endDate: "2025-12-20T00:00:00Z",
    timezone: "UTC 0",
    images: [
      "/feature/cyber-1.jpg?height=800&width=600",
      "/feature/cyber-2.jpg?height=800&width=600",
      "/feature/cyber-3.jpg?height=800&width=600",
      "/feature/cyber-4.jpg?height=800&width=600",
  
    ],
    categories: ["Antiques", "Decorative Arts"],
    tags: ["Victorian", "Middle Eastern", "Gold-plated", "Collectible"],
    specifications: [
      { label: "Material", value: "Gold-plated brass" },
      { label: "Era", value: "Late Victorian (circa 1890)" },
      { label: "Condition", value: "Excellent" },
      { label: "Dimensions", value: "H: 12 inches, W: 8 inches, D: 5 inches" },
      { label: "Weight", value: "2.5 lbs" },
      { label: "Provenance", value: "Private collection, London" },
      { label: "Maker", value: "Unknown, possibly European" },
      { label: "Inscriptions", value: "None visible" },
    ],
    seller: {
      name: "Vintage Treasures Ltd",
      address: "123 Antique Row, Historic District, London, UK",
      phone: "+44 20 1234 5678",
      email: "contact@vintagetreasures.com",
      rating: 4.8,
      totalSales: 1289,
    },
    auctioneerNotes: "This Vintage Aladdin's Lamp is a remarkable find that beautifully marries Middle Eastern mystique with Victorian craftsmanship. The lamp's body showcases intricate arabesque patterns and mythical creature motifs, all expertly rendered in gold-plated brass. Its condition is exceptional, with only minor signs of age that add to its authentic charm. The hinged lid and ornate handle are fully functional, and the interior shows no signs of modern alterations, suggesting it has been carefully preserved over the decades. This piece would be a crowning jewel in any collection of 19th-century decorative arts or exotic antiques.",
    bidHistory: [
      { bidder: "A***r", amount: 2898.00, date: "2023-12-08T14:35:00Z" },
      { bidder: "J***n", amount: 2750.00, date: "2023-12-08T12:20:00Z" },
      { bidder: "S***a", amount: 2500.00, date: "2023-12-07T18:45:00Z" },
      { bidder: "M***k", amount: 2350.00, date: "2023-12-07T10:15:00Z" },
      { bidder: "L***a", amount: 2100.00, date: "2023-12-06T22:30:00Z" },
      { bidder: "D***d", amount: 1800.00, date: "2023-12-06T09:45:00Z" },
      { bidder: "R***t", amount: 1500.00, date: "2023-12-05T16:20:00Z" },
      { bidder: "E***h", amount: 1250.00, date: "2023-12-05T08:10:00Z" },
      { bidder: "T***s", amount: 1100.00, date: "2023-12-04T19:55:00Z" },
      { bidder: "B***y", amount: 1000.00, date: "2023-12-04T11:30:00Z" },
    ],
    relatedItems: [
      { id: "ICNB-35", title: "Antique Persian Oil Lamp", image: "/placeholder.svg?height=200&width=200", currentBid: 1500.00 },
      { id: "ICNB-36", title: "Victorian Era Pocket Watch", image: "/placeholder.svg?height=200&width=200", currentBid: 800.00 },
      { id: "ICNB-37", title: "Ornate Gold Mirror", image: "/placeholder.svg?height=200&width=200", currentBid: 2200.00 },
      { id: "ICNB-38", title: "Antique Brass Telescope", image: "/placeholder.svg?height=200&width=200", currentBid: 1800.00 },
    ],
    shippingInfo: {
      methods: ["Standard", "Express", "International"],
      estimatedDelivery: "7-10 business days",
      returns: "Returns accepted within 14 days of delivery",
    },
    auctionTerms: "By placing a bid, you agree to our terms and conditions. All sales are final. Buyer is responsible for shipping costs.",
  }
}

export default async function AuctionDetail({ params }: AuctionDetailProps) {
  const auction = await getAuctionDetail(params.id)
  
  if (!auction) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="p-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative">
            <Suspense fallback={<div className="h-[600px] bg-muted animate-pulse rounded-lg" />}>
              <ProductGallery images={auction.images} />
            </Suspense>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">Lot # {auction.lotNumber}</Badge>
              <div className="flex space-x-2">
                <ShareModal />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to Watchlist</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{auction.title}</h1>
            <p className="text-muted-foreground">{auction.description}</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Current bid:</div>
                <div className="text-4xl font-bold">${auction.currentBid.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Starting bid:</div>
                <div className="text-xl">${auction.startingBid.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="text-sm">
                ITEM CONDITION: <Badge variant="outline">{auction.condition}</Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>234 watchers</span>
              </div>
            </div>
              
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Time left:</div>
              <CountdownTimer endDate={auction.endDate} />
              <div className="text-sm text-muted-foreground">
                <Clock className="inline-block w-4 h-4 mr-1" />
                Auction ends: {new Date(auction.endDate).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Timezone: {auction.timezone}
              </div>
            </div>

            <Separator />

            <BiddingForm currentBid={auction.currentBid} nextMinBid={auction.nextMinBid} />

            {/* <BidGraph bidHistory={auction.bidHistory} /> */}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-medium">SKU:</span> {auction.id}
            </div>
            <div>
              <span className="text-sm font-medium">Categories:</span>{" "}
              {auction.categories.map((category, index) => (
                <Badge key={category} variant="secondary" className="mr-2 mb-2">
                  {category}
                </Badge>
              ))}
            </div>
            <div>
              <span className="text-sm font-medium">Tags:</span>{" "}
              {auction.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="mr-2 mb-2">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="specifications" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="seller">Seller Information</TabsTrigger>
              <TabsTrigger value="bidHistory">Bid History</TabsTrigger>
              <TabsTrigger value="auctioneerNotes">Auctioneer Notes</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="terms">Auction Terms</TabsTrigger>
            </TabsList>
          </ScrollArea>
          <TabsContent value="specifications">
            <Card>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {auction.specifications.map((spec) => (
                    <div key={spec.label} className="space-y-1">
                      <div className="text-sm font-medium">{spec.label}</div>
                      <div className="text-sm text-muted-foreground">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="seller">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{auction.seller.name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{auction.seller.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(auction.seller.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.1750 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Sales: {auction.seller.totalSales}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{auction.seller.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{auction.seller.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{auction.seller.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bidHistory">
            <Card>
              <CardContent className="p-6">
                <BidHistory bidHistory={auction.bidHistory} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="auctioneerNotes">
            <Card>
              <CardContent className="p-6">
                <AuctioneerNotes notes={auction.auctioneerNotes} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shipping">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Available Methods:</div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {auction.shippingInfo.methods.map((method) => (
                        <li key={method}>{method}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Estimated Delivery:</div>
                    <div className="text-sm text-muted-foreground">{auction.shippingInfo.estimatedDelivery}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Returns:</div>
                    <div className="text-sm text-muted-foreground">{auction.shippingInfo.returns}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="terms">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Auction Terms</h3>
                  <div className="text-sm text-muted-foreground">{auction.auctionTerms}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Items</h2>
        <RelatedItems items={auction.relatedItems} />
      </div>
    </div>
  )
}

