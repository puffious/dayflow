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
  getAll: (page = 1, limit = 10) => api.get('/employees', { params: { page, limit } }),
  getById: (id: string) => api.get(`/employees/${id}`),
  register: (data: any) => api.post('/employees/register', data),
  getMe: (email: string) => api.get(`/employees/profile/me`, { params: { email } }),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
  checkIn: (data: any) => api.post('/attendance/check-in', data),
  checkOut: (attendanceId: string) => api.put(`/attendance/check-out/${attendanceId}`, {}),
  getHistory: (employeeId: string, params?: any) => 
    api.get(`/attendance/history/${employeeId}`, { params }),
  getReport: (params?: any) => api.get('/attendance/report', { params }),
  getDaily: (date: string) => api.get(`/attendance/daily/${date}`),
  getById: (id: string) => api.get(`/attendance/${id}`),
};

export const leaveAPI = {
  request: (data: any) => api.post('/leaves/request', data),
  getPending: (limit = 50, offset = 0) => api.get('/leaves/pending', { params: { limit, offset } }),
  getMyLeaves: (employeeId: string, params?: any) => 
    api.get(`/leaves/my-leaves/${employeeId}`, { params }),
  getBalance: (employeeId: string) => api.get(`/leaves/balance/${employeeId}`),
  updateStatus: (id: string, status: string) => 
    api.put(`/leaves/status/${id}`, { status }),
  getReport: (params?: any) => api.get('/leaves/report', { params }),
};

export default api;
