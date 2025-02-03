// eslint-disable-next-line
// @ts-nocheck

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ImageUploadSection } from '@/components/widget/image-upload';
import { TagInput } from '@/components/widget/tag-input';
import { useCategories, useAuctionMutations } from '@/hooks/useAuctions';
import type { AuctionItem } from '@/types/types';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const editAuctionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startingPrice: z.number().min(0, 'Starting price must be positive'),
  minBidIncrement: z
    .number()
    .min(1, 'Minimum bid increment must be at least 1'),
  reservePrice: z.number().optional(),
  startTime: z.date().min(new Date(), 'Start time must be in the future'),
  endTime: z
    .date()
    .min(new Date(), 'End time must be in the future')
    .refine(
      (date) => date > new Date(Date.now() + 24 * 60 * 60 * 1000),
      'End time must be at least 24 hours in the future'
    ),
  categoryId: z.string().min(1, 'Please select a category'),
  featuredImage: z
    .custom<File>()
    .refine((file) => file instanceof File, 'Featured image is required')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
  images: z
    .array(z.custom<File>())
    .max(4, 'Maximum 4 additional images allowed')
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      'Max file size is 5MB'
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
});

type EditAuctionValues = z.infer<typeof editAuctionSchema>;

const SUGGESTED_TAGS = [
  'Vintage',
  'Rare',
  'Limited Edition',
  'Collectible',
  'Antique',
  'New',
  'Used',
  'Original',
  'Custom',
  'Handmade',
] as const;

interface EditAuctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auction: AuctionItem | null;
}

export function EditAuctionDialog({
  open,
  onOpenChange,
  auction,
}: EditAuctionDialogProps) {
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data ?? [];
  const { updateAuction } = useAuctionMutations();

  const form = useForm<EditAuctionValues>({
    resolver: zodResolver(editAuctionSchema),
    defaultValues: {
      title: '',
      description: '',
      startingPrice: 0,
      minBidIncrement: 1,
      reservePrice: undefined,
      startTime: undefined,
      endTime: undefined,
      categoryId: '',
      featuredImage: undefined, // Initialize as undefined
      images: [],
      tags: [],
    },
  });

  // Reset form when auction changes
  useEffect(() => {
    if (auction) {
      form.reset({
        title: auction.title,
        description: auction.description,
        startingPrice: auction.startingPrice,
        minBidIncrement: auction.minBidIncrement,
        reservePrice: auction.reservePrice,
        startTime: new Date(auction.startTime),
        endTime: new Date(auction.endTime),
        categoryId: auction.categoryId,
        featuredImage: undefined, // Reset to undefined
        images: [],
        tags: auction.tags || [],
      });

      // Set featured image and additional images if they exist
      if (auction.featuredImage) {
        setFeaturedImage(auction.featuredImage);
      }
      if (auction.images && auction.images.length > 0) {
        setImages(auction.images);
      }
    }
  }, [auction, form]);

  const onSubmit = async (data: EditAuctionValues) => {
    try {
      if (auction) {
        const formData = new FormData();

        // Append all form fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'featuredImage' && value instanceof File) {
            formData.append('featuredImage', value);
          } else if (key === 'images' && Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append('images', file);
              }
            });
          } else if (key === 'tags' && Array.isArray(value)) {
            formData.append('tags', JSON.stringify(value));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        // Call the updateAuction mutation
        await updateAuction.mutateAsync({ id: auction.id, formData });

        toast.success('Auction updated successfully');
        onOpenChange(false); // Close the dialog
      }
    } catch (error) {
      toast.error('Failed to update auction. Please try again.');
      console.error('Auction update error:', error);
    }
  };

  const handleFeaturedImageUpload = useCallback(
    (file: File) => {
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
        form.setValue('featuredImage', file); // Set the featuredImage field in the form
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const handleAdditionalImagesUpload = useCallback(
    (files: File[]) => {
      const currentImages = form.getValues('images') || [];
      const totalImages = currentImages.length + files.length;

      if (totalImages > 4) {
        toast.error('Maximum 4 additional images allowed');
        return;
      }

      const readers = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setImages((prev) => [...prev, ...results]);
        form.setValue('images', [...currentImages, ...files]);
      });
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Auction</DialogTitle>
          <DialogDescription>
            Update the auction details below
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            (form.watch('endTime') &&
                              date > form.watch('endTime'))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            (form.watch('startTime') &&
                              date < form.watch('startTime'))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <FormControl>
                    <ImageUploadSection
                      images={featuredImage ? [featuredImage] : []}
                      onImageUpload={(files) =>
                        handleFeaturedImageUpload(files[0])
                      }
                      onImageReplace={(_, file) =>
                        handleFeaturedImageUpload(file)
                      }
                      onImageRemove={() => {
                        setFeaturedImage('');
                        form.setValue('featuredImage', undefined as any);
                      }}
                      maxImages={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Additional Images</FormLabel>
                  <FormDescription>
                    Upload up to 4 additional images
                  </FormDescription>
                  <FormControl>
                    <ImageUploadSection
                      images={images}
                      onImageUpload={handleAdditionalImagesUpload}
                      onImageReplace={(index, file) => {
                        const newImages = [...images];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          newImages[index] = reader.result as string;
                          setImages(newImages);

                          const currentFiles = form.getValues('images');
                          const newFiles = [...currentFiles];
                          newFiles[index] = file;
                          form.setValue('images', newFiles);
                        };
                        reader.readAsDataURL(file);
                      }}
                      onImageRemove={(index) => {
                        const newImages = [...images];
                        newImages.splice(index, 1);
                        setImages(newImages);

                        const currentFiles = form.getValues('images');
                        const newFiles = [...currentFiles];
                        newFiles.splice(index, 1);
                        form.setValue('images', newFiles);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormDescription>
                    Add up to 10 tags to help buyers find your auction
                  </FormDescription>
                  <FormControl>
                    <TagInput
                      tags={field.value || []}
                      setTags={(newTags) => field.onChange(newTags)}
                      suggestions={[...SUGGESTED_TAGS]}
                      maxTags={10}
                      placeholder="Type a tag and press enter..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Auction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
