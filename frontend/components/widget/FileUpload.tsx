import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: File;
  onChange: (file?: File) => void;
  label: string;
  description?: string;
  accept?: string[];
  maxSize?: number;
}

export function FileUpload({
  value,
  onChange,
  label,
  description,
  accept = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  maxSize = 5 * 1024 * 1024,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.[0]) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize,
    multiple: false,
  });

  const [preview, setPreview] = React.useState<string>();

  React.useEffect(() => {
    if (value && value.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(undefined);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg transition-all duration-200',
          'bg-gradient-to-br from-background to-muted/50',
          'hover:from-muted/50 hover:to-muted group cursor-pointer',
          isDragActive
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-muted-foreground/25',
          preview ? 'p-2' : 'p-8'
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative aspect-video rounded-md overflow-hidden group">
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-background/80 group-hover:bg-background transition-colors duration-200">
              <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
            <div className="text-center space-y-1">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-200">
                {isDragActive ? 'Drop the file here' : label}
              </span>
              {description && (
                <span className="text-xs text-muted-foreground block">
                  {description}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {value && !preview && (
        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
          <span className="text-sm truncate">{value.name}</span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
