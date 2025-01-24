'use client';

import * as React from 'react';
import { addMonths, format, setMonth, startOfMonth } from 'date-fns';
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

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date());

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate && date) {
      const updatedDate = new Date(newDate);
      updatedDate.setHours(date.getHours());
      updatedDate.setMinutes(date.getMinutes());
      setDate(updatedDate);
    } else {
      setDate(newDate);
    }
  };

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (selectedDate) {
      const updatedDate = new Date(selectedDate);
      if (type === 'hours') {
        updatedDate.setHours(parseInt(value));
      } else {
        updatedDate.setMinutes(parseInt(value));
      }
      setSelectedDate(updatedDate);
      setDate(updatedDate);
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP HH:mm') : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between p-3 border-b">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select
            value={currentMonth.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue>{format(currentMonth, 'MMMM')}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(setMonth(new Date(), i), 'MMMM')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={startOfMonth(currentMonth)}
          initialFocus
          className="rounded-t-none"
          classNames={{
            day_today: 'bg-accent text-accent-foreground',
          }}
        />
        <div className="flex items-center justify-center p-3 border-t">
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
              selectedDate ? selectedDate.getMinutes().toString() : undefined
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
      </PopoverContent>
    </Popover>
  );
}
