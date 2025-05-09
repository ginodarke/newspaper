import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  "relative overflow-hidden rounded-xl bg-card text-card-foreground transition-all duration-300 will-change-transform",
  {
    variants: {
      variant: {
        default: "border border-border elevation-1 inner-light",
        gradient: "bg-card-gradient border-none elevation-1 inner-light",
        elevated: "border border-border elevation-2 inner-light",
        flat: "border border-border shadow-none",
        glass: "bg-card/80 backdrop-blur-md border border-border/50",
      },
      size: {
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
      },
      interactive: {
        true: "cursor-pointer hover:elevation-2 active:elevation-1 active:scale-[0.99] transition-elevation duration-300",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
      fullWidth: false,
    },
  }
);

export interface CardProps 
  extends Omit<HTMLMotionProps<"div">, 'animate'>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  as?: React.ElementType;
  elevation?: 1 | 2 | 3 | 4;
  interactive3d?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, fullWidth, children, as: Component = 'div', elevation = 1, interactive3d = false, ...props }, ref) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Set a fixed elevation class based on the elevation prop
    const elevationClass = `elevation-${elevation}`;
    
    // Handle mouse movement for 3D effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive3d) return;
      
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 5 degrees)
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      setMousePosition({ x: rotateY, y: rotateX });
    };

    const handleMouseLeave = () => {
      if (interactive3d) {
        setMousePosition({ x: 0, y: 0 });
      }
    };
    
    // Motion-specific props
    const motionProps: Partial<HTMLMotionProps<"div">> = {
      whileHover: interactive ? { y: -5, scale: 1.02 } : undefined,
      whileTap: interactive ? { y: 0, scale: 0.98 } : undefined,
    };
    
    // 3D interactive props
    if (interactive3d) {
      motionProps.style = {
        transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        transition: mousePosition.x === 0 && mousePosition.y === 0 ? 'all 0.5s ease-out' : undefined,
      };
      motionProps.onMouseMove = handleMouseMove;
      motionProps.onMouseLeave = handleMouseLeave;
    }
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, interactive, fullWidth }),
          interactive3d && 'preserve-3d',
          // Don't apply elevation class if using interactive3d
          !interactive3d && elevationClass,
          className
        )}
        {...motionProps}
        {...props}
      >
        {/* Light source effect - subtle highlight at the top of the card */}
        {variant !== 'flat' && (
          <div className="absolute inset-x-0 top-0 h-px bg-white/10 rounded-t-xl" />
        )}
        
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { withBorder?: boolean, withGradient?: boolean }
>(({ className, withBorder = false, withGradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 relative z-10",
      withBorder && "pb-4 mb-4 border-b border-border",
      withGradient && "bg-gradient-to-r from-primary/5 to-secondary/5 -mx-5 px-5 pt-5 pb-6 rounded-t-xl",
      className
    )}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "font-bold tracking-tight text-featured text-foreground leading-headline",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { withPadding?: boolean }
>(({ className, withPadding = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      withPadding && "pt-0", 
      className
    )}
    {...props}
  />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 mt-auto border-t border-border", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; 