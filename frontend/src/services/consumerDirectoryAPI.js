import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (configuredBaseUrl || "/api").replace(/\/$/, "");

export async function fetchConsumerDirectory(options = {}) {
  const response = await axios.get(`${API_BASE_URL}/consumers`, {
    withCredentials: true,
    headers: { Accept: "application/json" },
    ...options,
  });
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

export async function createConsumer(consumer, options = {}) {
  const response = await axios.post(`${API_BASE_URL}/consumers`, consumer, {
    withCredentials: true,
    headers: { Accept: "application/json" },
    ...options,
  });

  return response.data?.data;
}

export async function updateConsumer(id, consumer, options = {}) {
  const response = await axios.put(`${API_BASE_URL}/consumers/${id}`, consumer, {
    withCredentials: true,
    headers: { Accept: "application/json" },
    ...options,
  });
  return response.data?.data;
}
