import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'featured' | 'compact' | 'expanded';
  onClick?: () => void;
  animate?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const variants = {
  default: 'bg-card hover:shadow-md',
  featured: 'bg-card hover:shadow-lg border-2 border-primary/20',
  compact: 'bg-card hover:shadow-sm',
  expanded: 'bg-card hover:shadow-xl',
};

const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  hover: { y: -2 },
};

export default function Card({
  children,
  className,
  variant = 'default',
  onClick,
  animate = true,
  onMouseEnter,
  onMouseLeave,
}: CardProps) {
  const Component = animate ? motion.div : 'div';
  const props = animate
    ? {
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
        whileHover: 'hover',
        variants: animations,
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      {...props}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200',
        variants[variant],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
}

// Card Header Component
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
}

// Card Title Component
interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
}

// Card Description Component
interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

// Card Content Component
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

// Card Footer Component
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)}>
      {children}
    </div>
  );
} 