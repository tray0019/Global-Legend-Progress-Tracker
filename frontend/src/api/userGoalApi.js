import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export function getUserGoals() {
  return api.get('/users/goals');
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
