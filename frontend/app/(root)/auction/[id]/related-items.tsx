import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface RelatedItem {
  id: string
  title: string
  image: string
  currentBid: number
}

interface RelatedItemsProps {
  items: RelatedItem[]
}

export default function RelatedItems({ items }: RelatedItemsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <Link href={`/auctions/${item.id}`}>
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
          </CardContent>
          <CardFooter className="p-4">
            <div className="w-full">
              <h3 className="font-semibold text-sm mb-2 truncate">{item.title}</h3>
              <p className="text-sm text-muted-foreground">Current Bid: ${item.currentBid.toLocaleString()}</p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

