"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AuctionCardProps {
  image: string
  title: string
  price: number
  sku: string
  status: "live" | "upcoming"
  daysLeft: number
  hoursLeft: number
  minutesLeft: number
  secondsLeft: number
  seller: string
}

export function AuctionCard({
  image,
  title,
  price,
  sku,
  status,
  daysLeft: initialDays,
  hoursLeft: initialHours,
  minutesLeft: initialMinutes,
  secondsLeft: initialSeconds,
  seller,
}: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: initialDays,
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              hours = 23
              if (days > 0) {
                days--
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 text-white text-sm font-medium rounded-full ${
            status === "live" ? "bg-red-500" : "bg-blue-500"
          }`}>
            {status === "live" ? "Live" : "Upcoming"}
          </span>
        </div>
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="w-full h-[300px] object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Starting bid:</p>
            <p className="text-2xl font-bold">${price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {status === "live" ? "Lot #" : "Sku #"} {sku}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-xl font-bold">{timeLeft.days}</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{timeLeft.hours}</p>
            <p className="text-xs text-muted-foreground">Hours</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{timeLeft.minutes}</p>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{timeLeft.seconds}</p>
            <p className="text-xs text-muted-foreground">Seconds</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>EL</AvatarFallback>
          </Avatar>
          <span className="text-sm">{seller}</span>
        </div>
        <Button variant="default">
          {status === "live" ? "Bid Now" : "Notify Me"}
        </Button>
      </CardFooter>
    </Card>
  )
}

