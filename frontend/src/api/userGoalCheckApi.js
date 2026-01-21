import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 REQUIRED
});

export function markGoalDoneToday(goalId) {
  return api.post(`/goals/${goalId}/checks`);
}

export function getGoalChecks(goalId, from, to) {
  return api.get(`/users/goals/${goalId}/checks`, {
    params: { from, to },
  });
}

export function getGlobalContributions(from, to) {
  return api.get('/users/calendar/contributions', {
    params: { from, to },
  });
}

export function toggleGoalDoneToday(goalId) {
  return api.post(`/users/goals/${goalId}/checks/today/toggle`);
}

export function getGoalDoneToday(goalId) {
  return api.get(`/users/goals/${goalId}/checks/today`);
}
