import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import type { AuctionItem } from '@/types/types';

interface ViewAuctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auction: AuctionItem | null;
}

export function ViewAuctionDialog({
  open,
  onOpenChange,
  auction,
}: ViewAuctionDialogProps) {
  if (!auction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full max-h-full h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Auction Details</DialogTitle>
          <DialogDescription>
            View detailed information about this auction
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={auction.featuredImage}
              alt={auction.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {auction.premium && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-yellow-500">
                  <Icons.star className="h-4 w-4 mr-1" />
                  Premium
                </Badge>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div>
              <h3 className="text-xl font-semibold">{auction.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {auction.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p>{auction.category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    auction.status === 'active'
                      ? 'success'
                      : auction.status === 'ended'
                      ? 'destructive'
                      : 'warning'
                  }
                >
                  {auction.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Start Time
                </p>
                <p>{format(new Date(auction.startTime), 'PPp')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  End Time
                </p>
                <p>{format(new Date(auction.endTime), 'PPp')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Starting Price
                </p>
                <p className="font-medium">
                  ${auction.startingPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Bid
                </p>
                {/* <p className="font-medium">
                  ${auction.currentBid?.toLocaleString() || 'No bids'}
                </p> */}
              </div>
            </div>

            {auction.tags && auction.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {auction.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
