'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: Date | string; // Allow both Date and string for flexibility
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Convert endTime to a Date object if it's a string
  const targetDate = typeof endTime === 'string' ? new Date(endTime) : endTime;

  // Check if the targetDate is valid
  const isValidDate = !isNaN(targetDate.getTime());

  // Calculate the time left
  const calculateTimeLeft = () => {
    if (!isValidDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const difference = +targetDate - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    if (!isValidDate) {
      console.error('Invalid endTime provided to CountdownTimer');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(timer);
  }, [isValidDate, targetDate]);

  if (!isValidDate) {
    return (
      <div className="inline-flex gap-4  border p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl w-full items-center justify-center">
        <div className="text-center">
          <div className="font-bold text-sm">Invalid Date</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex gap-4 p-2 border p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl w-full items-center justify-center">
      <div className="text-center">
        <div className="font-bold text-sm">{timeLeft.days}</div>
        <div className="text-xs text-muted-foreground">Days</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-sm">{timeLeft.hours}</div>
        <div className="text-xs text-muted-foreground">Hours</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-sm">{timeLeft.minutes}</div>
        <div className="text-xs text-muted-foreground">Minutes</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-sm">{timeLeft.seconds}</div>
        <div className="text-xs text-muted-foreground">Seconds</div>
      </div>
    </div>
  );
}
