import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant = 'primary', size = 'md', asChild = false, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button'

        return (
            <Comp
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    'disabled:pointer-events-none disabled:opacity-50',
                    {
                        'bg-foreground text-background hover:opacity-90': variant === 'primary',
                        'border border-border bg-background text-foreground hover:bg-muted':
                            variant === 'secondary',
                        'text-foreground hover:bg-muted': variant === 'ghost',
                    },
                    {
                        'h-8 rounded-md px-3 text-sm': size === 'sm',
                        'h-10 rounded-lg px-5 text-sm': size === 'md',
                        'h-12 rounded-lg px-6 text-base': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)

Button.displayName = 'Button'
