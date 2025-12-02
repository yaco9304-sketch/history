import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'nation';
  nation?: 'goguryeo' | 'baekje' | 'silla';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const nationGradients = {
  goguryeo: 'bg-gradient-to-br from-red-900/90 to-red-950/90 border-red-800/50',
  baekje: 'bg-gradient-to-br from-blue-900/90 to-blue-950/90 border-blue-800/50',
  silla: 'bg-gradient-to-br from-amber-800/90 to-amber-900/90 border-amber-700/50',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      nation,
      hoverable = false,
      padding = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const variantStyles = {
      default: 'bg-gradient-to-br from-stone-800/80 to-stone-900/80 border border-amber-900/30 backdrop-blur-sm',
      glass: 'bg-gradient-to-br from-stone-800/60 to-stone-900/60 border border-amber-900/20 backdrop-blur-md',
      nation: nation ? nationGradients[nation] : 'bg-stone-800/50',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { scale: 1.02, y: -4 } : undefined}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          hoverable && 'cursor-pointer hover:shadow-xl hover:shadow-black/20',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// Card Title
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold text-white', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

// Card Content
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-slate-300', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

// Card Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-slate-700/50', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
