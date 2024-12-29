import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const topBidders = [
  { id: 1, name: "Emma Wilson", bids: 23, spent: "$4,500", avatar: "EW", progress: 90 },
  { id: 2, name: "Liam Johnson", bids: 19, spent: "$3,200", avatar: "LJ", progress: 75 },
  { id: 3, name: "Olivia Davis", bids: 17, spent: "$2,800", avatar: "OD", progress: 60 },
]

export function TopBidders() {
  return (
    <div className="space-y-8">
      {topBidders.map((bidder) => (
        <div key={bidder.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${bidder.name}`} />
            <AvatarFallback>{bidder.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{bidder.name}</p>
            <p className="text-sm text-muted-foreground">{bidder.bids} bids</p>
            <Progress value={bidder.progress} className="h-2" />
          </div>
          <div className="ml-auto font-medium">{bidder.spent}</div>
        </div>
      ))}
    </div>
  )
}

