'use client';

import { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Loader2, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

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
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ImageUploadSection } from '@/components/widget/image-upload';
import { TagInput } from '@/components/widget/tag-input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { sellerApi } from '@/lib/api/seller';
import { DateTimePicker } from '@/components/ui/date-time-picker';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const createAuctionSchema = z.object({
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

type CreateAuctionValues = z.infer<typeof createAuctionSchema>;

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

export default function CreateAuctionForm() {
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const router = useRouter();

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => sellerApi.getAllCategories(),
  });

  const categories = categoriesData?.categories ?? [];

  const form = useForm<CreateAuctionValues>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      title: '',
      description: '',
      startingPrice: 0,
      minBidIncrement: 1,
      reservePrice: undefined,
      startTime: undefined,
      endTime: undefined,
      categoryId: '',
      featuredImage: undefined,
      images: [],
      tags: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateAuctionValues) => {
      const formData = new FormData();

      // Append all form fields
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

      return sellerApi.createAuction(formData);
    },
    onSuccess: () => {
      toast.success('Auction created successfully');
      router.push('/seller');
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create auction. Please try again.');
      console.error('Auction creation error:', error);
    },
  });

  const onSubmit = (data: CreateAuctionValues) => {
    if (new Date(data.endTime) <= new Date(data.startTime)) {
      toast.error('End time must be after start time');
      return;
    }
    mutation.mutate(data);
  };

  const handleFeaturedImageUpload = useCallback(
    (file: File) => {
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
        form.setValue('featuredImage', file);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Button
                  variant="ghost"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => router.back()}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Auctions</span>
                </Button>
                <h2 className="text-2xl font-semibold text-primary mt-2">
                  Create New Auction
                </h2>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter auction title" {...field} />
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
                          {categories?.length ? (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <p>No categories available.</p>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter auction description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
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
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="startingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Starting Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minBidIncrement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Bid Increment</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              step="0.01"
                              placeholder="1.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reservePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reserve Price (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum price that must be met for the item to be
                            sold
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <DateTimePicker
                              date={field.value}
                              setDate={field.onChange}
                              minDate={new Date()}
                              maxDate={form.watch('endTime')}
                            />
                          </FormControl>
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
                          <FormControl>
                            <DateTimePicker
                              date={field.value}
                              setDate={field.onChange}
                              minDate={form.watch('startTime') || new Date()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/seller')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending || !form.formState.isValid}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Auction
          </Button>
        </div>
      </form>
    </Form>
  );
}
