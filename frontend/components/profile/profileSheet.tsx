'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { User, Settings, LogOut } from 'lucide-react';

export function ProfileSheet() {
  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <Sheet>
      {/* Trigger Button */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar className="ring-2 ring-primary">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      {/* Content */}
      <SheetContent
        side="right"
        className="w-[250px] sm:w-[250px] bg-background text-foreground rounded-2xl shadow-2xl p-6 "
      >
        {/* Header */}
        <SheetHeader>
          <div className="flex items-center gap-4 py-4">
            <Avatar className="ring-2 ring-primary ring-offset-2 hover:scale-105 transition-transform duration-300">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-lg font-semibold">shadcn</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                m@example.com
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Navigation Options */}
        <div className="space-y-4 mt-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-xl text-muted-foreground hover:bg-muted/20 hover:text-primary transition-all ease-in-out rounded-md p-2"
            onClick={() => handleNavigation('/profile')}
          >
            <User className="mr-4 h-5 w-5 transition-transform duration-200 hover:scale-110" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-xl text-muted-foreground hover:bg-muted/20 hover:text-primary transition-all ease-in-out rounded-md p-2"
            onClick={() => handleNavigation('/settings')}
          >
            <Settings className="mr-4 h-5 w-5 transition-transform duration-200 hover:scale-110" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-xl text-muted-foreground hover:bg-muted/20 hover:text-primary transition-all ease-in-out rounded-md p-2"
            onClick={() => handleNavigation('/logout')}
          >
            <LogOut className="mr-4 h-5 w-5 transition-transform duration-200 hover:scale-110" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
