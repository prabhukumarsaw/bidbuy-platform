import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const listings = [
  {
    id: 1,
    title: "Vintage Watch",
    currentBid: "$1,200",
    timeLeft: "2h 15m",
    bidders: 8,
    progress: 75,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    title: "Antique Vase",
    currentBid: "$800",
    timeLeft: "1d 3h",
    bidders: 5,
    progress: 40,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    title: "Rare Coin",
    currentBid: "$3,500",
    timeLeft: "4h 30m",
    bidders: 12,
    progress: 90,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export function ActiveListings() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <motion.div
          key={listing.id}
          layoutId={`listing-${listing.id}`}
          className="rounded-lg border p-4 transition-shadow hover:shadow-md"
          onClick={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
        >
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={listing.image} alt={listing.title} />
              <AvatarFallback>{listing.title[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 flex-1">
              <p className="text-sm font-medium leading-none">{listing.title}</p>
              <p className="text-sm text-muted-foreground">
                Current Bid: {listing.currentBid}
              </p>
              <Progress value={listing.progress} className="h-2" />
            </div>
            <div className="ml-auto text-right">
              <Badge variant="secondary">{listing.timeLeft}</Badge>
              <p className="text-xs text-muted-foreground mt-1">{listing.bidders} bidders</p>
            </div>
          </div>
          <AnimatePresence>
            {expandedId === listing.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-2"
              >
                <p className="text-sm">Auction ends in: <span className="font-semibold">{listing.timeLeft}</span></p>
                <p className="text-sm">Total bids: <span className="font-semibold">{listing.bidders}</span></p>
                <Button size="sm" className="w-full mt-2">Place Bid</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

