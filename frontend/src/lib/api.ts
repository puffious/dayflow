// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Employees
  employees: `${API_BASE_URL}/api/employees`,
  employeeRegister: `${API_BASE_URL}/api/employees/register`,
  employeeMe: (email: string) => `${API_BASE_URL}/api/employees/me?email=${encodeURIComponent(email)}`,
  employeeById: (id: string) => `${API_BASE_URL}/api/employees/${id}`,
  
  // Attendance
  attendance: `${API_BASE_URL}/api/attendance`,
  checkIn: `${API_BASE_URL}/api/attendance/check-in`,
  checkOut: (attendanceId: string) => `${API_BASE_URL}/api/attendance/check-out/${attendanceId}`,
  attendanceByEmployee: (employeeId: string) => `${API_BASE_URL}/api/attendance/${employeeId}`,
  
  // Leaves
  leaves: `${API_BASE_URL}/api/leaves`,
  leaveRequest: `${API_BASE_URL}/api/leaves/request`,
  pendingLeaves: `${API_BASE_URL}/api/leaves/pending`,
  leaveStatus: (id: string) => `${API_BASE_URL}/api/leaves/status/${id}`,
};

export const API_CONFIG = {
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
