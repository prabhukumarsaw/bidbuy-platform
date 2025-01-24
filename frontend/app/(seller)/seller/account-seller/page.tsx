'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sellerApi } from '@/lib/api/seller';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Briefcase,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { EditProfileDialog } from './EditProfileDialog';

export default function SellerProfile() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sellerProfile'],
    queryFn: sellerApi.getProfile,
  });

  if (isLoading) {
    return <PremiumSellerProfileSkeleton />;
  }

  if (isError) {
    return <ErrorState />;
  }

  const profile = data?.data;

  if (!profile) {
    return null;
  }

  return (
    <div className="container  min-h-screen text-gray-800">
      <Card className="w-full bg-white/40 backdrop-blur-xl border-gray-200 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="relative p-0">
          <div className="h-64 md:h-80 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-end space-x-4">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={profile.user.image}
                    alt={profile.user.name}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
                    {profile.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    {profile.businessName}
                  </CardTitle>

                  <CardDescription className="text-xl text-gray-200 flex md:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <Badge
                      variant={profile.verified ? 'success' : 'destructive'}
                      className="px-2 py-0.5 text-xs font-medium"
                    >
                      {profile.verified ? 'Verified Seller' : 'Unverified'}
                    </Badge>

                    <EditProfileDialog profile={profile} />
                  </CardDescription>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProfileSection title="Business Overview">
              <ProfileItem
                icon={Briefcase}
                label="Member since"
                value={new Date(profile.createdAt).toLocaleDateString()}
              />
              <ProfileItem
                icon={MapPin}
                label="Location"
                value={`${profile.city}, ${profile.state}, ${profile.country}`}
              />
              <ProfileItem icon={Phone} label="Phone" value={profile.phone} />
              <ProfileItem
                icon={Mail}
                label="Email"
                value={profile.user.email}
              />
            </ProfileSection>

            <ProfileSection title="Tax Information">
              <ProfileItem label="GST Number" value={profile.gstNumber} />
              <ProfileItem label="PAN Number" value={profile.panNumber} />
            </ProfileSection>

            <ProfileSection title="Social Media">
              <SocialMediaLinks socialMedia={profile.socialMedia} />
            </ProfileSection>
          </div>

          <Separator className="my-6 bg-gray-300" />

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              About {profile.businessName}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {profile.businessDescription ||
                `${
                  profile.businessName
                } is a verified seller on our platform, specializing in ${
                  profile.businessCategory || 'various products'
                }. With a commitment to quality and customer satisfaction, they have been serving customers since ${
                  profile.yearEstablished || 'their establishment'
                }. Located in ${profile.city}, ${
                  profile.state
                }, they are known for their excellent service and reliable business practices.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/60 p-6 rounded-xl backdrop-blur-sm shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center text-sm">
      {Icon && <Icon className="mr-2 h-5 w-5 text-blue-500" />}
      <span className="font-medium text-gray-700 mr-2">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

function SocialMediaLinks({
  socialMedia,
}: {
  socialMedia?: SellerProfile['socialMedia'];
}) {
  if (!socialMedia) return null;

  const socialIcons = [
    { name: 'facebook', icon: Facebook, url: socialMedia.facebook },
    { name: 'twitter', icon: Twitter, url: socialMedia.twitter },
    { name: 'instagram', icon: Instagram, url: socialMedia.instagram },
    { name: 'linkedin', icon: Linkedin, url: socialMedia.linkedin },
  ];

  return (
    <div className="flex space-x-4">
      {socialIcons.map((social) =>
        social.url ? (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <social.icon className="h-6 w-6" />
          </a>
        ) : null
      )}
    </div>
  );
}

function PremiumSellerProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <Card className="w-full bg-white/40 backdrop-blur-xl border-gray-200 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="relative p-0">
          <Skeleton className="h-64 md:h-80 w-full rounded-t-2xl" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Separator className="my-6 bg-gray-300" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/60 p-6 rounded-xl backdrop-blur-sm shadow-lg border border-gray-200"
              >
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-6 bg-gray-300" />
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/60 backdrop-blur-xl border-gray-200 shadow-xl rounded-2xl text-center">
        <CardHeader>
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="mt-4 text-xl font-semibold text-gray-800">
            Error Loading Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            There was an error loading your profile. Please try again later.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
