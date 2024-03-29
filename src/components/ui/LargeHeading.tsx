import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'


export const LargeHeadingVariants = cva(
  'text-black dark:text-white text-4xl lg:text-left font-extrabold leading-tight tracking-tighter',
  {
    variants: {
      size: {
        default: 'text-4xl md:text-5xl lg:text-6xl',
        sm: 'text-2xl md:text-3xl lg:text-4xl',
        lg:'text-5xl md:text-6xl lg:text-7xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

interface LargeHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof LargeHeadingVariants> {}

const LargeHeading = React.forwardRef<HTMLHeadingElement, LargeHeadingProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        {...props}
        className={cn(LargeHeadingVariants({ size, className }))}>
        {children}
      </h1>
    )
  }
)

LargeHeading.displayName = 'LargeHeading'

export default LargeHeading