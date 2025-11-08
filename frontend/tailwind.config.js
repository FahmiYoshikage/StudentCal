// tailwind.config.js
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                'dark-bg': '#0f0b1f',
                'dark-secondary': '#1a0e3e',
                'dark-accent': '#2d1b5e',
                'purple-primary': '#a855f7',
                'pink-primary': '#ec4899',
                'blue-primary': '#3b82f6',
            },
            animation: {
                gradient: 'gradient 3s ease infinite',
                float: 'float 3s ease-in-out infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
1