// ============================================
// frontend/src/utils/formatters.js
// ============================================
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (date, options = {}) => {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options,
    });
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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
