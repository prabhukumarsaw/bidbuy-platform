// eslint-disable-next-line
// @ts-nocheck

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from './EditProfileDialog';

export function ProfileHeader() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock user data (replace with actual data fetching logic)
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    image: '/placeholder.svg?height=128&width=128',
    role: 'USER',
  };

  return (
    <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
      <div className="relative">
        <Image
          src={user.image || '/placeholder.svg'}
          alt={user.name || 'Profile picture'}
          width={128}
          height={128}
          className="rounded-full"
        />
        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 text-xs font-semibold">
          {user.role}
        </div>
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        <Button onClick={() => setIsEditDialogOpen(true)} className="mt-2">
          Edit Profile
        </Button>
      </div>
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={user}
      />
    </div>
  );
}
