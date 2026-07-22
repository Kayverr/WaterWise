import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (configuredBaseUrl || "/api").replace(/\/$/, "");
const client = axios.create({
  baseURL: `${API_BASE_URL}/announcements`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

export async function fetchAnnouncements(options = {}) {
  const response = await client.get("/", options);
  return response.data?.data ?? [];
}

export async function createAnnouncement(payload) {
  const response = await client.post("/", payload);
  return response.data?.data ?? response.data;
}

export async function updateAnnouncement(id, payload) {
  const response = await client.put(`/${id}`, payload);
  return response.data?.data ?? response.data;
}

export async function deleteAnnouncement(id) {
  const response = await client.delete(`/${id}`);
  return response.data;
}

export default client;
