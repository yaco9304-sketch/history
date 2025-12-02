import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'goguryeo' | 'baekje' | 'silla';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 hover:from-amber-600 hover:to-amber-500 shadow-lg shadow-amber-900/30 border border-amber-500/30',
  secondary: 'bg-transparent border-2 border-amber-700/50 text-amber-100 hover:bg-amber-900/20 hover:border-amber-600/50',
  ghost: 'bg-transparent text-amber-100 hover:bg-amber-900/20',
  goguryeo: 'bg-gradient-to-r from-red-900 to-red-800 text-red-100 hover:from-red-800 hover:to-red-700 shadow-lg shadow-red-900/30 border border-red-700/30',
  baekje: 'bg-gradient-to-r from-blue-900 to-blue-800 text-blue-100 hover:from-blue-800 hover:to-blue-700 shadow-lg shadow-blue-900/30 border border-blue-700/30',
  silla: 'bg-gradient-to-r from-amber-800 to-amber-700 text-amber-100 hover:from-amber-700 hover:to-amber-600 shadow-lg shadow-amber-900/30 border border-amber-600/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
