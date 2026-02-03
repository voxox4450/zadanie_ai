import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  health: () => api.get('/health'),
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  resetPassword: (data) => api.put('/reset-password', data),
};

export default api;
