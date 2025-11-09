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
    const days = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
    ];
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
