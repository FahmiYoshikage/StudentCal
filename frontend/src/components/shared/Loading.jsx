// ============================================
// frontend/src/components/shared/Loading.jsx
// ============================================
import React from 'react';

export default function Loading({ fullScreen = false }) {
    const content = (
        <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-300 animate-pulse">Loading...</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#1a0e3e] to-[#2d1b5e] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}
