import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from 'lucide-react'

const categories = [
  "Antiques",
  "Automotive",
  "Books & comics",
  "Digital art",
  "Fashion",
  "Gadget",
  "Jewelry",
  "Old Coin",
  "Real Estate"
]

const saleTypes = [
  "Upcoming",
  "Latest",
  "Highest Bidding",
  "Live Auction"
]

export function Sidebar() {
  return (
    <aside className="w-full lg:w-[300px] space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Period</h3>
        <Button variant="outline" className="w-full justify-start">
          All Day
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Condition</h3>
        <Button variant="outline" className="w-full justify-start">
          All
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Type Of Sales</h3>
        <div className="space-y-3">
          {saleTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} />
              <label htmlFor={type} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

