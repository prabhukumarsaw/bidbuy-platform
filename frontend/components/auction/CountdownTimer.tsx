'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface CountdownTimerProps {
  endTime: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = +endTime - +new Date();
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (time: number): string => time.toString().padStart(2, '0');

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="text-xs font-semibold">
        {timeLeft.days}d
      </Badge>
      <Badge variant="outline" className="text-xs font-semibold">
        {formatTime(timeLeft.hours)}h
      </Badge>
      <Badge variant="outline" className="text-xs font-semibold">
        {formatTime(timeLeft.minutes)}m
      </Badge>
      <Badge variant="outline" className="text-xs font-semibold">
        {formatTime(timeLeft.seconds)}s
      </Badge>
    </div>
  );
}
