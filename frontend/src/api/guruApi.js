// frontend/src/api/guruApi.js
import api from "./axios";

// Jadwal Guru
export const getJadwalGuru = async () => {
  const response = await api.get("/guru/jadwal");
  return response.data;
};

// Ketersediaan Guru
export const getKetersediaanGuru = async () => {
  const response = await api.get("/guru/ketersediaan");
  return response.data;
};

export const updateKetersediaan = async (data) => {
  const response = await api.post("/guru/ketersediaan", data);
  return response.data;
};

// Profil Guru
export const getProfilGuru = async () => {
  const response = await api.get("/guru/profil");
  return response.data;
};

export const updateProfilGuru = async (data) => {
  const response = await api.put("/guru/profil", data);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put("/guru/profil/password", data);
  return response.data;
};

// Dashboard Guru
export const getDashboardGuru = async () => {
  const response = await api.get("/guru/dashboard");
  return response.data;
};

export default {
  getJadwalGuru,
  getKetersediaanGuru,
  updateKetersediaan,
  getProfilGuru,
  updateProfilGuru,
  updatePassword,
  getDashboardGuru,
};
