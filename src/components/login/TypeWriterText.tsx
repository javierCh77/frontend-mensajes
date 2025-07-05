'use client';

import { useEffect, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  className?: string;
}

export default function TypewriterText({ text, speed = 30, className = '' }: Props) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className={className}>{displayedText}</p>;
}
