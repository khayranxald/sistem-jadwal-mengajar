import axiosInstance from "./axios";

// Helper function to create CRUD endpoints
const createCrudApi = (baseUrl) => ({
  getAll: (params = {}) => axiosInstance.get(baseUrl, { params }),
  getById: (id) => axiosInstance.get(`${baseUrl}/${id}`),
  create: (data) => axiosInstance.post(baseUrl, data),
  update: (id, data) => axiosInstance.put(`${baseUrl}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${baseUrl}/${id}`),
  getStatistics: () => axiosInstance.get(`${baseUrl}/statistics`),
});

// Mata Pelajaran API
export const mataPelajaranApi = createCrudApi("/admin/mata-pelajaran");

// Kelas API
export const kelasApi = createCrudApi("/admin/kelas");

// Jam Pelajaran API
export const jamPelajaranApi = createCrudApi("/admin/jam-pelajaran");

// Guru API
export const guruApi = createCrudApi("/admin/guru");

// Scheduling API
export const schedulingApi = {
  generate: (data) => axiosInstance.post("/admin/scheduling/generate", data),
  clear: (data) => axiosInstance.post("/admin/scheduling/clear", data),
  getAll: (params = {}) => axiosInstance.get("/admin/scheduling", { params }),
  getByKelas: (kelasId) => axiosInstance.get(`/admin/scheduling/kelas/${kelasId}`),
  getByGuru: (guruId) => axiosInstance.get(`/admin/scheduling/guru/${guruId}`),
  update: (id, data) => axiosInstance.put(`/admin/scheduling/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/scheduling/${id}`),
  getStatistics: (params = {}) => axiosInstance.get("/admin/scheduling/statistics", { params }),
};

// Export default object with all APIs
export default {
  mataPelajaran: mataPelajaranApi,
  kelas: kelasApi,
  jamPelajaran: jamPelajaranApi,
  guru: guruApi,
  scheduling: schedulingApi,
};
