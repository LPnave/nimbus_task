import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-500/10 text-blue-700 border border-blue-500/25',
        secondary: 'bg-[#eaedff] text-[#131b2e] border border-[#c6c6cd]',
        destructive: 'bg-red-500/10 text-red-700 border border-red-500/25',
        outline: 'text-[#131b2e] border border-[#c6c6cd]',
        success: 'bg-green-500/10 text-green-700 border border-green-500/25',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
