// frontend/src/utils/constants.js
export const DAYS = [
  { value: 1, label: 'Sen', fullLabel: 'Senin' },
  { value: 2, label: 'Sel', fullLabel: 'Selasa' },
  { value: 3, label: 'Rab', fullLabel: 'Rabu' },
  { value: 4, label: 'Kam', fullLabel: 'Kamis' },
  { value: 5, label: 'Jum', fullLabel: 'Jumat' },
  { value: 6, label: 'Sab', fullLabel: 'Sabtu' },
  { value: 7, label: 'Min', fullLabel: 'Minggu' }
];

export const TASK_STATUS = ['Todo', 'In Progress', 'Done'];

export const EXPENSE_CATEGORIES = [
  'Makanan',
  'Transportasi',
  'Buku & ATK',
  'Internet & Pulsa',
  'Hiburan',
  'Kesehatan',
  'Pakaian',
  'Lainnya'
];

export const INCOME_CATEGORIES = [
  'Uang Saku',
  'Beasiswa',
  'Part-time',
  'Freelance',
  'Hadiah',
  'Lainnya'
];

export const HABIT_ICONS = ['✓', '📚', '💪', '🏃', '🧘', '💻', '🎯', '⭐', '🔥', '💡'];
export const HABIT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// ============================================
// frontend/src/utils/formatters.js
// ============================================
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (time) => {
  return time.slice(0, 5); // "10:30:00" -> "10:30"
};

export const formatDeadline = (deadline) => {
  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Terlambat!';
  if (diffDays === 0) return 'Hari ini!';
  if (diffDays === 1) return 'Besok';
  if (diffDays <= 7) return `${diffDays} hari lagi`;
  return formatDate(deadline);
};

export const getDaysUntil = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================
// frontend/src/utils/helpers.js
// ============================================
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (str, length = 50) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const getDayName = (dayNumber) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[dayNumber];
};

export const getLetterGrade = (score) => {
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'D';
  return 'E';
};

export const getGradeColor = (grade) => {
  if (['A', 'A-'].includes(grade)) return 'text-green-600 bg-green-100';
  if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-100';
  if (['C+', 'C'].includes(grade)) return 'text-yellow-600 bg-yellow-100';
  if (grade === 'D') return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

// ============================================
// frontend/src/utils/validators.js
// ============================================
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validateNumber = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const validateDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

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
  const baseClasses = 'font-semibold rounded-lg transition-all hover:scale-105';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

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
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

// ============================================
// frontend/src/components/shared/Select.jsx
// ============================================
import React from 'react';
import { cn } from '../../utils/helpers';

export default function Select({ label, error, children, className, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

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

// ============================================
// frontend/src/components/shared/Modal.jsx
// ============================================
import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}