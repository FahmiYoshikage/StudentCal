// ============================================
// frontend/src/services/coursesService.js
// ============================================
import api from './api';

export const coursesService = {
    getAll: async () => {
        const response = await api.get('/api/courses');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/courses/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/courses', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/courses/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/courses/${id}`);
        return response.data;
    },

    sync: async () => {
        const response = await api.post('/api/courses/sync');
        return response.data;
    },
};

export default coursesService;
