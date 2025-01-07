'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Loader2, Plus, Trash, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';

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
import Link from 'next/link';
import { Icons } from '@/components/icons';

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
  endTime: z.date().min(new Date(), 'End time must be in the future'),
  categoryId: z.string().min(1, 'Please select a category'),
  featuredImage: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Featured image is required')
    .transform((files) => files[0])
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
  images: z
    .custom<FileList>()
    .transform((files) => Array.from(files))
    .refine((files) => files.length <= 5, 'Maximum 5 images allowed')
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      'Max file size is 5MB'
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
  tags: z.array(z.string()).optional(),
});

type CreateAuctionValues = z.infer<typeof createAuctionSchema>;

const categories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Fashion' },
  { id: '3', name: 'Home & Garden' },
  { id: '4', name: 'Sports' },
  { id: '5', name: 'Art' },
];

export default function CreateAuctionForm() {
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<CreateAuctionValues>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      minBidIncrement: 1,
      tags: [],
    },
  });

  async function onSubmit(data: CreateAuctionValues) {
    setIsSubmitting(true);
    try {
      // Handle form submission here
      console.log(data);
    } catch (error) {
      console.error('Error creating auction:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImagePreview = (files: FileList) => {
    const imageUrls: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrls.push(reader.result as string);
        setImages([...imageUrls]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, field: any) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      field.onChange(files);
      handleMultipleImagePreview(e.dataTransfer.files);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Link
                  href="/dashboard/seller/auctions"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  aria-label="Back to auction listing"
                >
                  <Icons.chevronLeft className="w-4 h-4" />
                  <span>Back to Auctions</span>
                </Link>
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
                          <div className="space-y-4">
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, field)}
                              className={cn(
                                'border-2 border-dashed rounded-lg p-6 transition-all duration-200',
                                'bg-gradient-to-br from-background to-muted/50',
                                'hover:from-muted/50 hover:to-muted group',
                                featuredImage
                                  ? 'border-muted'
                                  : 'border-primary/50',
                                isDragging &&
                                  'border-primary ring-2 ring-primary/20'
                              )}
                            >
                              <label
                                htmlFor="featuredImage"
                                className="flex flex-col items-center gap-3 cursor-pointer"
                              >
                                <div className="p-3 rounded-full bg-background/80 group-hover:bg-background transition-colors duration-200">
                                  <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                </div>
                                <div className="text-center space-y-1">
                                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-200">
                                    Click to upload featured image
                                  </span>
                                  <span className="text-xs text-muted-foreground block">
                                    Maximum file size: 5MB
                                  </span>
                                </div>
                                <Input
                                  id="featuredImage"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      onChange(e.target.files);
                                      handleImagePreview(file);
                                    }
                                  }}
                                  {...field}
                                />
                              </label>
                            </div>
                            {featuredImage && (
                              <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-1">
                                <div className="relative aspect-[16/9] rounded-lg overflow-hidden group">
                                  <img
                                    src={featuredImage}
                                    alt="Featured preview"
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="scale-90 hover:scale-100 transition-transform duration-200"
                                      onClick={() => {
                                        setFeaturedImage('');
                                        form.setValue(
                                          'featuredImage',
                                          undefined
                                        );
                                      }}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
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
                        <FormLabel>Product Images</FormLabel>
                        <FormDescription>
                          Upload up to 4 images of your product. First image
                          will be the featured image.
                        </FormDescription>
                        <FormControl>
                          <ImageUploadSection
                            images={images}
                            isDragging={isDragging}
                            onImageUpload={(files) => {
                              const remainingSlots = 4 - images.length;
                              const newFiles = Array.from(files).slice(
                                0,
                                remainingSlots
                              );

                              if (newFiles.length > 0) {
                                const imageUrls: string[] = [];
                                newFiles.forEach((file) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    imageUrls.push(reader.result as string);
                                    if (imageUrls.length === newFiles.length) {
                                      setImages([...images, ...imageUrls]);
                                      // Update form value
                                      const dt = new DataTransfer();
                                      const existingFiles = Array.from(
                                        value || []
                                      );
                                      existingFiles.forEach((file) =>
                                        dt.items.add(file)
                                      );
                                      newFiles.forEach((file) =>
                                        dt.items.add(file)
                                      );
                                      onChange(dt.files);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                });
                              }
                            }}
                            onImageReplace={(index, file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const newImages = [...images];
                                newImages[index] = reader.result as string;
                                setImages(newImages);

                                // Update form value
                                const dt = new DataTransfer();
                                const existingFiles = Array.from(value || []);
                                existingFiles.splice(index, 1, file);
                                existingFiles.forEach((file) =>
                                  dt.items.add(file)
                                );
                                onChange(dt.files);
                              };
                              reader.readAsDataURL(file);
                            }}
                            onImageRemove={(index) => {
                              const newImages = [...images];
                              newImages.splice(index, 1);
                              setImages(newImages);

                              // Update form value
                              const dt = new DataTransfer();
                              const existingFiles = Array.from(value || []);
                              existingFiles.splice(index, 1);
                              existingFiles.forEach((file) =>
                                dt.items.add(file)
                              );
                              onChange(dt.files);
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                </div>
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
                        suggestions={[
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
                        ]}
                        maxTags={10}
                        placeholder="Type a tag and press enter..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Auction
          </Button>
        </div>
      </form>
    </Form>
  );
}
