'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetTime: string;
}

export function CountdownTimer({ targetTime }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  if (!timeRemaining) {
    return <div className="text-2xl font-bold font-mono text-purple-400">Loading...</div>;
  }

  if (timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0) {
    return <div className="text-2xl font-bold font-mono text-red-400">Event Happening Now</div>;
  }

  return (
    <div className="text-3xl font-bold font-mono text-purple-300">
      {String(timeRemaining.days).padStart(2, '0')}:{String(timeRemaining.hours).padStart(2, '0')}:
      {String(timeRemaining.minutes).padStart(2, '0')}
    </div>
  );
}
