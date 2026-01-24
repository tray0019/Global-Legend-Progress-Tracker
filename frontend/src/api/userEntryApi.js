// src/api/userGoalApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export function addEntry(goalId, description) {
  return api.post(`users/goals/${goalId}/entries`, { description });
}

export function renameEntry(entryId, newDescription) {
  return api.put(`users/entries/${entryId}`, { description: newDescription });
}

export function deleteEntry(entryId) {
  return api.delete(`users/entries/${entryId}`);
}
