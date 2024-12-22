'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TermsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-normal">Terms and Conditions</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh] pr-4">
          <div className="text-sm text-muted-foreground">
            <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
            <p className="mb-4">
              By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            
            <h3 className="font-semibold mb-2">2. Use of Service</h3>
            <p className="mb-4">
              You agree to use this service for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the service.
            </p>
            
            <h3 className="font-semibold mb-2">3. Privacy</h3>
            <p className="mb-4">
              Your use of this service is subject to our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
            </p>
            
            <h3 className="font-semibold mb-2">4. Disclaimer</h3>
            <p className="mb-4">
              The materials on this service are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h3 className="font-semibold mb-2">5. Limitations</h3>
            <p className="mb-4">
              In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this service, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h3 className="font-semibold mb-2">6. Revisions and Errata</h3>
            <p className="mb-4">
              The materials appearing on our service could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its service are accurate, complete or current. We may make changes to the materials contained on its service at any time without notice.
            </p>
            
            <h3 className="font-semibold mb-2">7. Governing Law</h3>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
