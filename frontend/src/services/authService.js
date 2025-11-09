// ============================================
// frontend/src/services/authService.js
// ============================================
import api from './api';

export const authService = {
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    loginWithGoogle: () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    },
};

export default authService;
