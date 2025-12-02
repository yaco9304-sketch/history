import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TimerProps {
  seconds: number;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const Timer = ({
  seconds: initialSeconds,
  onComplete,
  size = 'md',
  showIcon = true,
  className,
}: TimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const isWarning = seconds <= 30;
  const isCritical = seconds <= 10;

  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 font-mono font-bold',
        sizeStyles[size],
        isCritical ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-white',
        className
      )}
      animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
    >
      {showIcon && <Clock className="w-5 h-5" />}
      <span>
        {minutes}:{remainingSeconds.toString().padStart(2, '0')}
      </span>
    </motion.div>
  );
};

// Countdown Animation (게임 시작 전)
interface CountdownProps {
  from?: number;
  onComplete?: () => void;
}

export const Countdown = ({ from = 3, onComplete }: CountdownProps) => {
  const [count, setCount] = useState(from);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (count === 0) {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 500);
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              className="text-9xl font-bold text-white"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {count === 0 ? '시작!' : count}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
