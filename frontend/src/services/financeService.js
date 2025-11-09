// ============================================
// frontend/src/services/financeService.js
// ============================================
import api from './api';

export const financeService = {
    getAll: async (params = {}) => {
        const response = await api.get('/api/transactions', { params });
        return response.data;
    },

    getMonthlySummary: async (year, month) => {
        const params = { year, month };
        const response = await api.get('/api/transactions/summary/monthly', {
            params,
        });
        return response.data;
    },

    getYearlySummary: async (year) => {
        const response = await api.get('/api/transactions/summary/yearly', {
            params: { year },
        });
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/api/transactions/categories');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/transactions', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/transactions/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/transactions/${id}`);
        return response.data;
    },
};

export default financeService;
