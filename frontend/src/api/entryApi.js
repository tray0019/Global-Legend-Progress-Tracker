// src/api/entryApi.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const api = axios.create({
  baseURL: BASE_URL,
});

export function addEntry(goalId, description) {
  return api.post(`/goal/${goalId}/entries`, { description });
}

export function renameEntry(entryId, newDescription) {
  return api.put(`/entries/${entryId}`, { description: newDescription });
}

export function deleteEntry(entryId) {
  return api.delete(`/entries/${entryId}`);
}
