// ============================================
// frontend/src/components/shared/Input.jsx
// ============================================
import React from 'react';
import { cn } from '../../utils/helpers';

export default function Input({ label, error, className, ...props }) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition',
                    error && 'border-red-500',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
}
