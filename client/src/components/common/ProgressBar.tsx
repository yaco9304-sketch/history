import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  icon?: string;
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar = ({
  value,
  max = 100,
  color = '#4CAF50',
  showValue = false,
  size = 'md',
  label,
  icon,
  animated = true,
  className,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {/* Label Row */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm text-slate-300 flex items-center gap-1.5">
              {icon && <span>{icon}</span>}
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-white">
              {value.toLocaleString()}{max !== 100 && `/${max.toLocaleString()}`}
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className={cn(
          'w-full bg-slate-700/50 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        {/* Progress Fill */}
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Stat Bar Component (게임용)
interface StatBarProps {
  stat: 'military' | 'economy' | 'diplomacy' | 'culture';
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statConfig = {
  military: { color: '#F44336', icon: '🗡️', label: '군사력' },
  economy: { color: '#4CAF50', icon: '🌾', label: '경제력' },
  diplomacy: { color: '#2196F3', icon: '🤝', label: '외교력' },
  culture: { color: '#9C27B0', icon: '📚', label: '문화력' },
};

export const StatBar = ({
  stat,
  value,
  max = 200,
  showLabel = true,
  size = 'md',
}: StatBarProps) => {
  const config = statConfig[stat];

  return (
    <ProgressBar
      value={value}
      max={max}
      color={config.color}
      showValue
      size={size}
      label={showLabel ? config.label : undefined}
      icon={showLabel ? config.icon : undefined}
    />
  );
};
