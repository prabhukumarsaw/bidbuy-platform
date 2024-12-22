// eslint-disable-next-line
// @ts-nocheck

'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BiddingFormProps {
  currentBid: number
  nextMinBid: number
}

export default function BiddingForm({ currentBid, nextMinBid }: BiddingFormProps) {
  const [bidAmount, setBidAmount] = useState(nextMinBid)

  const handleIncrement = () => {
    setBidAmount((prev) => Math.round((prev + 75) * 100) / 100)
  }

  const handleDecrement = () => {
    setBidAmount((prev) => Math.max(nextMinBid, Math.round((prev - 75) * 100) / 100))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would implement the actual bid submission logic
    console.log(`Submitting bid: ${bidAmount}`)
    // toast({
    //   title: "Bid Placed",
    //   description: `Your bid of $${bidAmount.toLocaleString()} has been placed successfully.`,
    // })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
        >
          -
        </Button>
        <Input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(Number(e.target.value))}
          min={nextMinBid}
          step={0.01}
          className="text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
      <Button type="submit" className="w-full">
        Place Bid
      </Button>
    </form>
  )
}

