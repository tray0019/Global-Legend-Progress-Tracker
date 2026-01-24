// src/api/userGoalApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 REQUIRED
});

export const getUserGoals = async () => {
  const res = await api.get(`/users/me/goals`);
  return res.data;
};

export function getUserGoal(goalId) {
  if (!goalId) {
    console.error('getUserGoal called with invalid goalId:', goalId);
    return;
  }
  return api.get(`/users/me/goals/${goalId}`);
}

export function getActiveGoals() {
  return api.get('users/goals/active');
}

export function createUserGoal(title) {
  return api.post('/users/goals', { goalTitle: title });
}

export function renameUserGoal(goalId, newTitle) {
  return api.put(`/users/goals/${goalId}`, null, { params: { newTitle } });
}

export function deleteUserGoal(goalId) {
  return api.delete(`/users/goals/${goalId}`);
}

export function reorderUserGoals(positions) {
  return api.put('/users/goals/reorder', positions);
}

export function completeGoal(goalId) {
  return api.put(`users/goals/${goalId}/complete`);
}
