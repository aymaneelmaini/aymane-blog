import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ContainerProps {
    children: ReactNode
    className?: string
}

export function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn('mx-auto w-full max-w-[1200px] px-6', className)}>
            {children}
        </div>
    )
}
