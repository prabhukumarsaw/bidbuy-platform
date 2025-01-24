import { UploadCloud, X, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface ImageUploadProps {
  images: string[];
  onImageUpload: (files: File[]) => void;
  onImageReplace: (index: number, file: File) => void;
  onImageRemove: (index: number) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUploadSection({
  images,
  onImageUpload,
  onImageReplace,
  onImageRemove,
  maxImages = 4,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, or WebP images.');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        const remainingSlots = maxImages - images.length;
        const validFiles = acceptedFiles
          .slice(0, remainingSlots)
          .filter(validateFile);

        if (validFiles.length > 0) {
          // Simulate upload delay for better UX
          await new Promise((resolve) => setTimeout(resolve, 1000));
          onImageUpload(validFiles);
          toast.success(`Successfully uploaded ${validFiles.length} image(s)`);
        }
      } catch (error) {
        toast.error('Failed to upload images. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [images.length, maxImages, onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    disabled: images.length >= maxImages || isUploading,
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200',
          'bg-gradient-to-br from-background to-muted/50',
          'hover:from-muted/50 hover:to-muted',
          isDragActive && 'border-primary ring-2 ring-primary/20',
          (images.length >= maxImages || isUploading) &&
            'opacity-50 cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-background/80 shadow-sm">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <UploadCloud className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {isDragActive
                ? 'Drop images here'
                : isUploading
                ? 'Uploading...'
                : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum {maxImages} images (5MB each)
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewImage(image)}
                      >
                        <ImagePlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl h-[80vh]">
                      <ScrollArea className="h-full">
                        <img
                          src={previewImage || ''}
                          alt="Preview"
                          className="w-full h-auto"
                        />
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file && validateFile(file)) {
                          onImageReplace(index, file);
                          toast.success('Image replaced successfully');
                        }
                      };
                      input.click();
                    }}
                  >
                    <UploadCloud className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      onImageRemove(index);
                      toast.success('Image removed successfully');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
