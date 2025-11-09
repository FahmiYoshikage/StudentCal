export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'bounce-in': 'bounceIn 0.6s ease-out',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glowPulse: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                    },
                    '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
                },
                slideDown: {
                    from: { opacity: '0', transform: 'translateY(-20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.9)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                bounceIn: {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
