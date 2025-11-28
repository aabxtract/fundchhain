'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: string;
}

const CountdownTimer = ({ deadline }: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(deadline) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  if (!Object.keys(timeLeft).length) {
    return <span>00:00:00</span>;
  }
  
  const { days, hours, minutes, seconds } = timeLeft as { days: number, hours: number, minutes: number, seconds: number };

  if (days > 0) {
    return <span>{days}d {formatTime(hours)}h</span>
  }

  return (
    <span className="font-mono">
      {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
    </span>
  );
};

export default CountdownTimer;
