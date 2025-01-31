import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/types';
import { userApi } from '@/lib/api/userApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface EditProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate: () => void;
}

const EditProfileDialog = ({
  user,
  open,
  onOpenChange,
  onProfileUpdate,
}: EditProfileDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setPreviewImage(user.image || null);
    }
  }, [user]);

  // Define Zod validation schema
  const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    mobile: z.string().optional(),
    address: z.string().optional(),
    bio: z
      .string()
      .min(1, 'Bio cannot be empty')
      .max(1000, 'Bio cannot exceed 1000 characters') // Limit bio to 1000 characters
      .refine((val) => {
        const wordCount = val.split(/\s+/).length;
        return wordCount <= 100; // Limit bio to 100 words
      }, 'Bio cannot exceed 100 words'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      mobile: user?.mobile || '',
      address: user?.address || '',
      bio: user?.bio || '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('mobile', user.mobile || '');
      setValue('address', user.address || '');
      setValue('bio', user.bio || '');
    }
  }, [user, setValue]);

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

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('mobile', data.mobile || '');
      formData.append('address', data.address || '');
      formData.append('bio', data.bio || '');

      if (previewImage && previewImage !== user?.image) {
        const response = await fetch(previewImage);
        const blob = await response.blob();
        formData.append('profileImage', blob, 'profile.jpg');
      }

      await userApi.updateProfile(formData);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      onProfileUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-w-3xl overflow-y-auto p-6 sm:p-8 bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className=" grid grid-cols-2  gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} className="w-full" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input id="mobile" {...register('mobile')} />
              {errors.mobile && (
                <p className="text-sm text-red-500">{errors.mobile.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="border border-gray-300 h-[150px] rounded-lg px-4 py-2 w-full text-start"
              {...register('bio')}
              placeholder="Enter a brief bio"
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
