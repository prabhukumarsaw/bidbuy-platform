import * as React from 'react';
import {
  addMonths,
  format,
  setMonth,
  startOfMonth,
  isValid,
  parseISO,
} from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({
  date,
  setDate,
  minDate,
  maxDate,
  label,
  disabled = false,
  className,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date());
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (date && isValid(date)) {
      setSelectedDate(date);
      setCurrentMonth(date);
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      setDate(undefined);
      return;
    }

    if (minDate && newDate < minDate) {
      toast.error('Selected date is before the minimum allowed date');
      return;
    }

    if (maxDate && newDate > maxDate) {
      toast.error('Selected date is after the maximum allowed date');
      return;
    }

    try {
      const updatedDate = new Date(newDate);
      if (selectedDate) {
        updatedDate.setHours(selectedDate.getHours());
        updatedDate.setMinutes(selectedDate.getMinutes());
      }
      setSelectedDate(updatedDate);
      setDate(updatedDate);
    } catch (error) {
      toast.error('Invalid date selection');
    }
  };

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (!selectedDate) {
      const now = new Date();
      setSelectedDate(now);
      setDate(now);
      return;
    }

    try {
      const updatedDate = new Date(selectedDate);
      if (type === 'hours') {
        updatedDate.setHours(parseInt(value));
      } else {
        updatedDate.setMinutes(parseInt(value));
      }

      if (minDate && updatedDate < minDate) {
        toast.error('Selected time is before the minimum allowed time');
        return;
      }

      if (maxDate && updatedDate > maxDate) {
        toast.error('Selected time is after the maximum allowed time');
        return;
      }

      setSelectedDate(updatedDate);
      setDate(updatedDate);
    } catch (error) {
      toast.error('Invalid time selection');
    }
  };

  const handleMonthChange = (month: string) => {
    const newMonth = setMonth(currentMonth, parseInt(month));
    setCurrentMonth(newMonth);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const handleSetNow = () => {
    const now = new Date();
    if (minDate && now < minDate) {
      toast.error('Current time is before the minimum allowed time');
      return;
    }

    if (maxDate && now > maxDate) {
      toast.error('Current time is after the maximum allowed time');
      return;
    }

    setSelectedDate(now);
    setDate(now);
    setCurrentMonth(now);
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return '';
    try {
      const localDate = format(date, 'PPP HH:mm');
      const utcDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      return `${localDate} (${utcDate})`;
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? formatDisplayDate(date) : <span>Pick a date and time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center justify-between p-3 border-b">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              disabled={minDate && currentMonth <= minDate}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select
              value={currentMonth.getMonth().toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue>{format(currentMonth, 'MMMM yyyy')}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(setMonth(currentMonth, i), 'MMMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              disabled={maxDate && currentMonth >= maxDate}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={startOfMonth(currentMonth)}
            disabled={(date) => {
              if (!date) return false;
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
            className="rounded-t-none"
            classNames={{
              day_today: 'bg-accent text-accent-foreground',
              day_disabled: 'opacity-50 cursor-not-allowed',
            }}
          />
          <div className="flex items-center justify-between p-3 border-t">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 opacity-50" />
              <Select
                onValueChange={(value) => handleTimeChange('hours', value)}
                value={
                  selectedDate ? selectedDate.getHours().toString() : undefined
                }
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="mx-2">:</span>
              <Select
                onValueChange={(value) => handleTimeChange('minutes', value)}
                value={
                  selectedDate
                    ? selectedDate.getMinutes().toString()
                    : undefined
                }
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetNow}
              className="ml-4"
            >
              Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
