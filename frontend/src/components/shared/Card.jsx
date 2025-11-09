// ============================================
// frontend/src/components/shared/Card.jsx
// ============================================
import React from 'react';
import { cn } from '../../utils/helpers';

export default function Card({ children, className, ...props }) {
    return (
        <div
            className={cn(
                'bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/50 transition-all',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
