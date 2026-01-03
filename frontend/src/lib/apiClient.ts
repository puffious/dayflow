import axios from 'axios';
import { API_CONFIG } from './api';

const api = axios.create(API_CONFIG);

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  register: (data: any) => api.post('/employees/register', data),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
  checkIn: (data: any) => api.post('/attendance/check-in', data),
  checkOut: (attendanceId: string) => api.put(`/attendance/check-out/${attendanceId}`, {}),
  getHistory: (employeeId: string, params?: any) => 
    api.get(`/attendance/${employeeId}`, { params }),
};

export const leaveAPI = {
  request: (data: any) => api.post('/leaves/request', data),
  getPending: () => api.get('/leaves/pending'),
  updateStatus: (id: string, status: string) => 
    api.put(`/leaves/status/${id}`, { status }),
};

export default api;
