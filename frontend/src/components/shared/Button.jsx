// ============================================
// frontend/src/components/shared/Button.jsx
// ============================================
import React from 'react';
import { cn } from '../../utils/helpers';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) {
    const baseClasses =
        'font-semibold rounded-lg transition-all hover:scale-105';

    const variants = {
        primary:
            'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50',
        secondary:
            'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={cn(
                baseClasses,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
