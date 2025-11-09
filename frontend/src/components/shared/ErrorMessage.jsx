// ============================================
// frontend/src/components/shared/ErrorMessage.jsx
// ============================================
import React from 'react';

export default function ErrorMessage({ message }) {
    return (
        <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
                <h4 className="text-red-400 font-semibold mb-1">Error</h4>
                <p className="text-red-300 text-sm">{message}</p>
            </div>
        </div>
    );
}
