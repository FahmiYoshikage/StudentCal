// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Don't redirect on auth check failures
        if (
            error.response?.status === 401 &&
            !error.config.url.includes('/auth/me')
        ) {
            // Only redirect to login if not already on home page
            if (window.location.pathname !== '/') {
                console.log('Unauthorized, redirecting to home');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
