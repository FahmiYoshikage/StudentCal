// ============================================
// frontend/src/services/habitsService.js
// ============================================
import api from './api';

export const habitsService = {
    getAll: async () => {
        const response = await api.get('/api/habits');
        return response.data;
    },

    getToday: async () => {
        const response = await api.get('/api/habits/today');
        return response.data;
    },

    getStats: async (id) => {
        const response = await api.get(`/api/habits/${id}/stats`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/habits', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/habits/${id}`, data);
        return response.data;
    },

    toggle: async (id) => {
        const response = await api.post(`/api/habits/${id}/toggle`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/habits/${id}`);
        return response.data;
    },
};

export default habitsService;
