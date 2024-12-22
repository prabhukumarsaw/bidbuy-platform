// eslint-disable-next-line
// @ts-nocheck

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List } from 'lucide-react'
import { AuctionCard } from "@/components/auction-card"
import { Sidebar } from "./sidebar"

export default function AuctionPage() {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-muted-foreground">Showing 1–12 Of 27 Results</p>
            <div className="flex items-center gap-4">
              <Select defaultValue="default">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Sorting</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AuctionCard
              image="/placeholder.svg?height=400&width=600"
              title="Performance on empowering prime your drive."
              price={4648.00}
              sku="Genesis-1"
              status="upcoming"
              daysLeft={387}
              hoursLeft={3}
              minutesLeft={45}
              secondsLeft={47}
              seller="Egens lab"
            />
            <AuctionCard
              image="/placeholder.svg?height=400&width=600"
              title="Canvas & culture brush withn elegance auction."
              price={9458.00}
              sku="576894"
              status="live"
              daysLeft={366}
              hoursLeft={3}
              minutesLeft={45}
              secondsLeft={47}
              seller="Egens lab"
            />
            <AuctionCard
              image="/placeholder.svg?height=400&width=600"
              title="Gizmo galaxy your universent of cutting edge tech."
              price={3198.00}
              sku="375948"
              status="live"
              daysLeft={386}
              hoursLeft={3}
              minutesLeft={45}
              secondsLeft={47}
              seller="Egens lab"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

