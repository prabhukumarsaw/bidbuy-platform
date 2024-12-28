import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { AutoBidConfig } from '@/types/types';

interface AutoBidCardProps {
  currentPrice: number;
  onConfigChange: (config: AutoBidConfig) => void;
}

export function AutoBidCard({
  currentPrice,
  onConfigChange,
}: AutoBidCardProps) {
  const [config, setConfig] = useState<AutoBidConfig>({
    maxAmount: currentPrice + 25,
    incrementAmount: 5,
    enabled: false,
  });

  const handleChange = (updates: Partial<AutoBidConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h3 className="font-semibold">AI-Powered Auto Bidding</h3>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => handleChange({ enabled })}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Maximum Bid Amount</label>
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              value={config.maxAmount}
              onChange={(e) =>
                handleChange({ maxAmount: Number(e.target.value) })
              }
              className="bg-white/50"
            />
            <TooltipProvider>
              {' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>We'll automatically bid up to this amount</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Bid Increment</label>
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              value={config.incrementAmount}
              onChange={(e) =>
                handleChange({ incrementAmount: Number(e.target.value) })
              }
              className="bg-white/50"
            />
            <TooltipProvider>
              {' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Amount to increase each bid by</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </Card>
  );
}
