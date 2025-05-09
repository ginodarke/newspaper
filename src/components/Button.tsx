import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none",
        success: "bg-success text-primary-foreground hover:bg-success-dark",
        warning: "bg-warning text-primary-foreground hover:bg-warning-dark",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
      depth: {
        flat: "", // No 3D effect
        raised: "transform-gpu hover:translate-y-[-2px] active:translate-y-[1px]", // Subtle 3D
        deep: "transform-gpu shadow-lg hover:translate-y-[-4px] hover:shadow-xl active:translate-y-[1px] active:shadow-md", // Pronounced 3D
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      depth: "raised",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, depth, children, asChild = false, loading = false, leftIcon, rightIcon, glow = false, ...props }, ref) => {
    
    // Determine the inner shadow for the 3D effect based on the variant
    const getInnerStyle = () => {
      if (variant === 'outline' || variant === 'ghost' || variant === 'link') {
        return {};
      }
      return {
        boxShadow: 'inset 0px 1px 0px 0px rgba(255, 255, 255, 0.2)'
      };
    };
    
    // Add a subtle bottom shadow for depth
    const getBottomShadow = () => {
      if (depth === 'flat' || variant === 'ghost' || variant === 'link') {
        return {};
      }
      
      // The shadow color should match the button color but darker
      const shadowColor = variant === 'default' ? 'rgba(14, 165, 233, 0.5)' : 
                          variant === 'secondary' ? 'rgba(138, 79, 255, 0.5)' : 
                          'rgba(0, 0, 0, 0.2)';
                          
      return {
        boxShadow: `0px 4px 0px 0px ${shadowColor}`,
        marginBottom: '4px'
      };
    };

    // Get combined style for the button
    const buttonStyle = {
      ...getInnerStyle(),
      ...getBottomShadow()
    };

    // Using a regular button with motion styles applied via CSS classes
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, depth, className }),
          glow && `before:absolute before:inset-0 before:rounded-md before:bg-glow-primary 
                   before:opacity-0 hover:before:opacity-70 before:transition-opacity`,
          loading && "relative text-transparent transition-none hover:text-transparent",
          "transition-transform duration-300",
          depth !== 'flat' ? "hover:scale-105 active:scale-95" : ""
        )}
        style={buttonStyle}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {/* Inner highlight for top edge */}
        <span className="absolute inset-x-0 top-0 h-px bg-white/10 rounded-t-md" />
        
        {/* Content container */}
        <span className="flex items-center justify-center gap-2">
          {leftIcon && <span className={loading ? "opacity-0" : ""}>{leftIcon}</span>}
          {typeof children === 'string' ? (
            <span className={loading ? "opacity-0" : ""}>{children}</span>
          ) : (
            children
          )}
          {rightIcon && <span className={loading ? "opacity-0" : ""}>{rightIcon}</span>}
        </span>
        
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-current"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
 