// ============================================
// frontend/src/services/examsService.js
// ============================================
import api from './api';

export const examsService = {
    getAll: async () => {
        const response = await api.get('/api/exams');
        return response.data;
    },

    getUpcoming: async () => {
        const response = await api.get('/api/exams/upcoming');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/exams/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/exams', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/exams/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/exams/${id}`);
        return response.data;
    },
};

export default examsService;
