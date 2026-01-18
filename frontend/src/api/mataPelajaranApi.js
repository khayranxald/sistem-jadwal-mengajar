import axiosInstance from "./axios";

const BASE_URL = "/admin/mata-pelajaran";

export const mataPelajaranApi = {
  // Get all with filters
  getAll: (params = {}) => {
    return axiosInstance.get(BASE_URL, { params });
  },

  // Get by ID
  getById: (id) => {
    return axiosInstance.get(`${BASE_URL}/${id}`);
  },

  // Create
  create: (data) => {
    return axiosInstance.post(BASE_URL, data);
  },

  // Update
  update: (id, data) => {
    return axiosInstance.put(`${BASE_URL}/${id}`, data);
  },

  // Delete
  delete: (id) => {
    return axiosInstance.delete(`${BASE_URL}/${id}`);
  },

  // Statistics
  getStatistics: () => {
    return axiosInstance.get(`${BASE_URL}/statistics`);
  },
};

export default mataPelajaranApi;
