import { TrendingUp, Users, Clock, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CountdownTimer } from '../countdown-timer';

export function AuctionMetrics() {
  return (
    <>
      <CountdownTimer />

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-violet-200 dark:bg-violet-800">
              <Activity className="h-4 w-4 text-violet-700 dark:text-violet-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bid Activity</p>
              <p className="text-lg font-semibold">High</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-200 dark:bg-blue-800">
              <Users className="h-4 w-4 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Watchers</p>
              <p className="text-lg font-semibold">234</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
