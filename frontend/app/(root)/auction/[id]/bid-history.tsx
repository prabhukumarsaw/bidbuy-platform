import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Bid {
  bidder: string
  amount: number
  date: string
}

interface BidHistoryProps {
  bidHistory: Bid[]
}

export default function BidHistory({ bidHistory }: BidHistoryProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bidder</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bidHistory.map((bid, index) => (
          <TableRow key={index}>
            <TableCell>{bid.bidder}</TableCell>
            <TableCell>${bid.amount.toLocaleString()}</TableCell>
            <TableCell>{new Date(bid.date).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

