// ============================================
// frontend/src/services/gradesService.js
// ============================================
import api from './api';

export const gradesService = {
  getAll: async (courseId) => {
    const params = courseId ? { courseId } : {};
    const response = await api.get('/api/grades', { params });
    return response.data;
  },

  getByCourse: async (courseId) => {
    const response = await api.get(`/api/grades/course/${courseId}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/api/grades/summary');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/grades', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/grades/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/grades/${id}`);
    return response.data;
  }
};

export default gradesService;


