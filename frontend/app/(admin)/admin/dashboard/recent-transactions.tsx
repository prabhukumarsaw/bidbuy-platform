import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const transactions = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    amount: "$250.00",
    status: "completed",
    date: "2023-06-15",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    amount: "$1,000.00",
    status: "pending",
    date: "2023-06-14",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    amount: "$750.00",
    status: "completed",
    date: "2023-06-13",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${transaction.email}`} alt={transaction.name} />
            <AvatarFallback>{transaction.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.email}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium leading-none">{transaction.amount}</p>
            <Badge 
              variant={transaction.status === "completed" ? "default" : "secondary"}
              className="mt-1"
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

