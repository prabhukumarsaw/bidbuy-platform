import { TooltipProvider as RadixTooltipProvider } from '@/components/ui/tooltip';

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <RadixTooltipProvider>{children}</RadixTooltipProvider>;
}
