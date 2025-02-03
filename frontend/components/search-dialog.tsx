'use client';

import * as React from 'react';
import {
  Search,
  PlaneTakeoff,
  BarChart2,
  Video,
  AudioLines,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';
interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
}

const allActions: Action[] = [
  {
    id: '1',
    label: 'Place Bid',
    icon: <PlaneTakeoff className="h-4 w-4 text-blue-500" />,
    description: 'Quick bid',
    short: '⌘B',
    end: 'Action',
  },
  {
    id: '2',
    label: 'Auction Analytics',
    icon: <BarChart2 className="h-4 w-4 text-orange-500" />,
    description: 'View stats',
    short: '⌘A',
    end: 'Report',
  },
  {
    id: '3',
    label: 'Live Auctions',
    icon: <Video className="h-4 w-4 text-purple-500" />,
    description: 'Join now',
    short: '⌘L',
    end: 'Stream',
  },
  {
    id: '4',
    label: 'Auction Alerts',
    icon: <AudioLines className="h-4 w-4 text-green-500" />,
    description: 'Set reminders',
    short: '⌘R',
    end: 'Notify',
  },
  {
    id: '5',
    label: 'Global Auctions',
    icon: <Globe className="h-4 w-4 text-blue-500" />,
    description: 'Worldwide',
    short: '⌘G',
    end: 'Browse',
  },
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState('');
  const [result, setResult] = React.useState<Action[] | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 200);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResult(allActions);
      return;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const filteredActions = allActions.filter((action) => {
      const searchableText = action.label.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    setResult(filteredActions);
  }, [debouncedQuery]);

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: {
          duration: 0.4,
        },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="center"
        className="min-h-[300px] w-[500px] pt-9 sm:w-[540px] border-0 bg-background/95 backdrop-blur-sm"
      >
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search auctions..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </SheetHeader>
        <div className="grid gap-6 px-1 py-2">
          <AnimatePresence>
            {result && (
              <motion.div
                className="w-full overflow-hidden"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul>
                  {result.map((action) => (
                    <motion.li
                      key={action.id}
                      className="px-3 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md"
                      variants={item}
                      layout
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{action.icon}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {action.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {action.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {action.short}
                        </span>
                        <span className="text-xs text-gray-400 text-right">
                          {action.end}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
