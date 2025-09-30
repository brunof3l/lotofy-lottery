import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 will-change-transform disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary/95 to-primary text-primary-foreground shadow-md hover:from-primary to-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(120%_120%_at_50%_-20%,rgba(255,255,255,0.18),transparent_60%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        destructive:
          'bg-destructive text-white shadow-md hover:bg-destructive/90 active:translate-y-0 focus-visible:-translate-y-0.5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-sm hover:bg-accent/60 hover:text-accent-foreground active:translate-y-0 dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  const onPointerDown: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--ripple-x', `${x}px`)
    el.style.setProperty('--ripple-y', `${y}px`)
  }

  const rippleClass = variant === 'link' || variant === 'ghost' ? '' : ' ripple-enabled'

  return (
    <Comp
      data-slot="button"
      onPointerDown={onPointerDown}
      className={cn(buttonVariants({ variant, size, className }), rippleClass)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
