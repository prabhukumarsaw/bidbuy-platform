import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/types';

interface UserDetailsDialogProps {
  user: User;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function UserDetailsDialog({ user, onClose, onAction }: UserDetailsDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Name:</span>
            <span className="col-span-3">{user.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Email:</span>
            <span className="col-span-3">{user.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Status:</span>
            <span className="col-span-3">{user.active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Close</Button>
          {user.active ? (
            <Button onClick={() => onAction('deactivate')} variant="destructive">
              Deactivate User
            </Button>
          ) : (
            <Button onClick={() => onAction('activate')} variant="default">
              Activate User
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

