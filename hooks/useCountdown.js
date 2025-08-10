import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (initialCount = 3, onComplete = null) => {
  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isActive && count > 0) {
      const timer = setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActive && count === 0 && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        setIsActive(false);
        if (onComplete) onComplete();
      }, 1000);
    }
  }, [count, isActive, isCompleted, onComplete]);

  const start = useCallback(() => {
    setCount(initialCount);
    setIsActive(true);
    setIsCompleted(false);
  }, [initialCount]);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsCompleted(false);
    setCount(initialCount);
  }, [initialCount]);

  return {
    count,
    isActive,
    isCompleted,
    start,
    stop,
  };
};