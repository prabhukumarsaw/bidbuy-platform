import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Seller, SellerStatus } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import ViewImageDialog from '@/components/widget/ViewImageDialog';

interface SellerDetailsDialogProps {
  seller: Seller;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function SellerDetailsDialog({
  seller,
  onClose,
  onAction,
}: SellerDetailsDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seller Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Business Information</h3>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="text-muted-foreground">Name:</span>{' '}
                  {seller.businessName}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{' '}
                  {seller.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span>
                  <br />
                  {seller.address}
                  <br />
                  {seller.city}, {seller.state} {seller.postalCode}
                  <br />
                  {seller.country}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Account Status</h3>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge variant={seller.verified ? 'success' : 'warning'}>
                    {seller.status}
                  </Badge>
                </p>
                {seller.verifiedAt && (
                  <p>
                    <span className="text-muted-foreground">Verified At:</span>{' '}
                    {format(new Date(seller.verifiedAt), 'PPP')}
                  </p>
                )}
                {seller.suspended && (
                  <>
                    <p>
                      <span className="text-muted-foreground">
                        Suspended At:
                      </span>{' '}
                      {format(new Date(seller.suspendedAt!), 'PPP')}
                    </p>
                    {seller.suspensionReason && (
                      <p>
                        <span className="text-muted-foreground">Reason:</span>{' '}
                        {seller.suspensionReason}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Documents</h3>
            <div className="grid grid-cols-3 gap-4">
              {seller.gstDocument && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    GST Document
                  </p>
                  <ViewImageDialog
                    imageSrc={seller.gstDocument}
                    docNumber={seller.gstNumber}
                    title="GST"
                  />
                </div>
              )}
              {seller.aadhaarDocument && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Aadhaar Document
                  </p>
                  <ViewImageDialog
                    imageSrc={seller.aadhaarDocument}
                    docNumber={seller.aadhaarNumber}
                    title="Aadhaar"
                  />
                </div>
              )}
              {seller.panDocument && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    PAN Document
                  </p>
                  <ViewImageDialog
                    imageSrc={seller.panDocument}
                    docNumber={seller.panNumber}
                    title="PAN"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {seller.status === SellerStatus.PENDING && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => onAction('reject')}
                >
                  Reject
                </Button>
                <Button onClick={() => onAction('verify')}>Verify</Button>
              </>
            )}
            {seller.status === SellerStatus.VERIFIED && !seller.suspended && (
              <Button variant="destructive" onClick={() => onAction('suspend')}>
                Suspend
              </Button>
            )}
            {seller.suspended && (
              <Button variant="success" onClick={() => onAction('reactivate')}>
                Reactivate
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
