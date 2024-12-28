import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CatalogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200"
        >
          <FileDown className="h-4 w-4" />
          Download AI-Generated Catalog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Catalog Format</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2"
            onClick={() => console.log('Downloading PDF...')}
          >
            <FileDown className="h-6 w-6" />
            <span className="font-semibold">PDF Format</span>
            <span className="text-sm text-muted-foreground">
              High-quality print version
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2"
            onClick={() => console.log('Downloading Digital...')}
          >
            <FileDown className="h-6 w-6" />
            <span className="font-semibold">Digital Version</span>
            <span className="text-sm text-muted-foreground">
              Interactive digital catalog
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
