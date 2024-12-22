interface AuctioneerNotesProps {
  notes: string
}

export default function AuctioneerNotes({ notes }: AuctioneerNotesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Auctioneer&#39;s Notes</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{notes}</p>
    </div>
  )
}

