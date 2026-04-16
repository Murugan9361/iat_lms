import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Auth ───────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

// ─── Dashboard ──────────────────────────────────────────────
export const dashboardAPI = {
  admin: () => api.get('/dashboard/admin'),
  student: () => api.get('/dashboard/student'),
};

// ─── Users ──────────────────────────────────────────────────
export const userAPI = {
  create: (data) => api.post('/users', data),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getByRole: (role) => api.get(`/users/role/${role}`),
  search: (name) => api.get(`/users/search?name=${name}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ─── Leads ──────────────────────────────────────────────────
export const leadAPI = {
  create: (data) => api.post('/leads', data),
  getAll: () => api.get('/leads'),
  assign: (id, data) => api.patch(`/leads/${id}/assign`, data),
  updateStatus: (id, data) => api.patch(`/leads/${id}/status`, data),
  search: (name) => api.get(`/leads/search?name=${name}`),
};

// ─── Students ───────────────────────────────────────────────
export const studentAPI = {
  enroll: (data) => api.post('/students', data),
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  search: (name) => api.get(`/students/search?name=${name}`),
};

// ─── Courses ────────────────────────────────────────────────
export const courseAPI = {
  create: (data) => api.post('/courses', data),
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  update: (id, data) => api.put(`/courses/${id}`, data),
};

// ─── Batches ─────────────────────────────────────────────────
export const batchAPI = {
  create: (data) => api.post('/batches', data),
  getAll: () => api.get('/batches'),
  getActive: () => api.get('/batches/active'),
  getById: (id) => api.get(`/batches/${id}`),
  assignStudent: (batchId, studentId) => api.post(`/batches/${batchId}/students/${studentId}`),
  getTrainerBatches: (trainerId) => api.get(`/batches/trainer/${trainerId}`),
};

// ─── Syllabus ────────────────────────────────────────────────
export const syllabusAPI = {
  generate: (batchId) => api.post(`/syllabus/generate/${batchId}`),
  getByBatch: (batchId) => api.get(`/syllabus/batch/${batchId}`),
  updateTopic: (id, data) => api.put(`/syllabus/${id}/topic`, data),
  updateStatus: (id, data) => api.patch(`/syllabus/${id}/status`, data),
};

// ─── Attendance ──────────────────────────────────────────────
export const attendanceAPI = {
  mark: (data) => api.post('/attendance', data),
  getByDate: (batchId, date) => api.get(`/attendance/batch/${batchId}/date/${date}`),
  batchSummary: (batchId) => api.get(`/attendance/batch/${batchId}/summary`),
  studentSummary: (studentId, batchId) => api.get(`/attendance/student/${studentId}/batch/${batchId}`),
};

// ─── Payments ────────────────────────────────────────────────
export const paymentAPI = {
  create: (data) => api.post('/payments', data),
  getByStudent: (studentId) => api.get(`/payments/student/${studentId}`),
  addTransaction: (paymentId, data) => api.post(`/payments/${paymentId}/transactions`, data),
};

// ─── Evaluation ──────────────────────────────────────────────
export const evaluationAPI = {
  addTest: (data) => api.post('/validation-tests', data),
  getTests: (batchId) => api.get(`/validation-tests/batch/${batchId}`),
  addMock: (data) => api.post('/mock-interviews', data),
  getMocks: (batchId) => api.get(`/mock-interviews/batch/${batchId}`),
};

// ─── Placement ───────────────────────────────────────────────
export const placementAPI = {
  add: (data) => api.post('/placements', data),
  getAll: () => api.get('/placements'),
  update: (id, data) => api.put(`/placements/${id}`, data),
};

// ─── Queries ─────────────────────────────────────────────────
export const queryAPI = {
  raise: (data) => api.post('/queries', data),
  getByBatch: (batchId) => api.get(`/queries/batch/${batchId}`),
  getByStudent: (studentId) => api.get(`/queries/student/${studentId}`),
  reply: (id, data) => api.patch(`/queries/${id}/reply`, data),
};
