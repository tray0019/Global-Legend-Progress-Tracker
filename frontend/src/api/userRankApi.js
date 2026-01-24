import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 REQUIRED
});

export function getProgress() {
  return api.get('/progress/user');
}

export function addXP(difficulty) {
  return api.post(`/progress/user/xp?difficulty=${difficulty}`);
}

export function removeXP(difficulty) {
  return api.post(`/progress/user/xp/remove?difficulty=${difficulty}`);
}
