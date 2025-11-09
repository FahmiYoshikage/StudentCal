// ============================================
// frontend/src/services/tasksService.js
// ============================================
import api from './api';

export const tasksService = {
    getAll: async (params = {}) => {
        const response = await api.get('/api/tasks', { params });
        return response.data;
    },

    getUpcoming: async () => {
        const response = await api.get('/api/tasks/upcoming');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/tasks/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/tasks', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/tasks/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/api/tasks/${id}/status`, { status });
        return response.data;
    },

    toggleSubtask: async (taskId, subtaskId) => {
        const response = await api.patch(
            `/api/tasks/${taskId}/subtasks/${subtaskId}`
        );
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/tasks/${id}`);
        return response.data;
    },
};

export default tasksService;
