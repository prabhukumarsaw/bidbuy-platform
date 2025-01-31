'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import {
  Calendar,
  Clock,
  Printer,
  User,
  X,
  Plus,
  Check,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api/userApi';
import { useAuthStore } from '@/lib/store/auth-store';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import EditProfileDialog from '@/components/user/EditProfileDialog';
import BidsCard from '@/components/user/BidsCardUser';

export default function DoctorDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: userApi.getProfile,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="pt-6 border-t">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push('/login')}
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="container overflow-auto mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-purple-100 to-indigo-100">
            <CardHeader></CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={profile?.image || ''}
                    alt={profile?.name || 'User avatar'}
                  />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 text-sm px-2 py-1 bg-green-500 rounded-full"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-semibold text-primary mb-2">
                  {profile?.name}
                </h2>
                <p className="text-base text-muted-foreground mb-2">
                  {profile?.role}
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    USER CODE: <Badge variant="secondary"> {profile?.id}</Badge>
                    {/* <Badge variant="secondary">10 years experience</Badge> */}
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span> {profile?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{profile?.mobile}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{profile?.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Bio</h3>
              <p className="text-muted-foreground">
                <span>{profile?.bio}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1 bg-gradient-to-br from-blue-100 to-cyan-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold text-primary">
                Today&apos;s Slots
              </CardTitle>
              <div className="flex items-center space-x-2">s</div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Slots:
                </span>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Slot
                </Button>
              </div>
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>sa</TooltipTrigger>
                          <TooltipContent>as</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <BidsCard />
      </div>

      <EditProfileDialog
        user={profile}
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onProfileUpdate={refetchProfile}
      />
    </>
  );
}
