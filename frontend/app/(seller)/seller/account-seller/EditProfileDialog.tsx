'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerApi } from '@/lib/api/seller';
import { Seller } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Edit, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { useDropzone } from 'react-dropzone';

// Define the form schema
const formSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z.string().regex(/^[0-9]{5,6}$/, 'Invalid postal code'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProfileDialogProps {
  profile: Seller;
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: profile.businessName,
      phone: profile.phone,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      postalCode: profile.postalCode,
      country: profile.country,
    },
  });

  // if (previewImage && previewImage !== user?.image) {
  //   const response = await fetch(previewImage);
  //   const blob = await response.blob();
  //   formData.append('profileImage', blob, 'profile.jpg');
  // }

  useEffect(() => {
    if (profile.user) {
      setPreviewImage(profile.user.image || null);
    }
  }, [profile.user]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => sellerApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProfile'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description:
          'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    maxFiles: 1,
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-gray-100 text-xs text-blue-600 border-blue-300"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your seller profile information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
            >
              <input {...getInputProps()} />
              {previewImage ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    {isDragActive
                      ? 'Drop image here'
                      : 'Drag & drop or click to select profile image'}
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Business Name"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1234567890"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Business St"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="State"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12345"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Country"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
