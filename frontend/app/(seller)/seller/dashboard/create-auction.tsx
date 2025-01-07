'use client';

import * as React from 'react';
import { Plus, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CreateAuction() {
  return (
    <>
      <Link href="/seller/create-auction">
        <Button variant="action">
          <Plus className="mr-2 h-4 w-4" />
          <span>Create Auction</span>
        </Button>
      </Link>
    </>
  );
}
