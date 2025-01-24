import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ViewImageDialog = ({
  imageSrc,
  docNumber,
  title,
}: {
  imageSrc: string;
  title: string;
  docNumber: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center">
          <img
            src={imageSrc || '/avatar-placeholder.png'}
            alt={title}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-md"
          />
          <span className="text-[10px] font-medium text-gray-600 mt-0.5 text-center">
            {title}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium">
            {title} Document
          </DialogTitle>
          <p className="text-center text-sm text-gray-600">
            Document Number: {docNumber}
          </p>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-auto rounded-lg object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewImageDialog;
