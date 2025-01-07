'use client';

import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImageUpload: (files: FileList) => void;
  onImageReplace: (index: number, file: File) => void;
  onImageRemove: (index: number) => void;
  isDragging: boolean;
  maxImages?: number;
  className?: string;
}

export function ImageUploadSection({
  images,
  onImageUpload,
  onImageReplace,
  onImageRemove,
  isDragging,
  maxImages = 4,
  className,
}: ImageUploadProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      onImageUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onImageUpload(e.target.files);
    }
  };

  const handleReplaceClick = (index: number, file: File) => {
    onImageReplace(index, file);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 transition-colors',
          'bg-muted/30 hover:bg-muted/50',
          isDragging && 'border-primary bg-primary/5',
          images.length >= maxImages && 'pointer-events-none opacity-50'
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={images.length >= maxImages}
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div className="p-3 rounded-full bg-background shadow-sm">
            <UploadCloud className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum {maxImages} images (5MB each)
            </p>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 px-2 text-xs"
                      >
                        Replace
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem>
                        <label className="cursor-pointer w-full">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleReplaceClick(index, file);
                            }}
                          />
                          Upload new image
                        </label>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onImageRemove(index)}
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
