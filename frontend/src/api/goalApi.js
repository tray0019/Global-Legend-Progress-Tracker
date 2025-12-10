// src/api/goalApi.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const api = axios.create({
  baseURL: BASE_URL,
});

export function getAllGoals() {
  return api.get("/goals");
}

export function getGoalById(goalId) {
  return api.get(`/goals/${goalId}`);
}

export function createGoal(title) {
  return api.post("/goals", {
    goalTitle: title,
  });
}

export function renameGoal(goalId, newTitle) {
  return api.put(`/goals/${goalId}`, null, {
    params: { newTitle },
  });
}

export function deleteGoal(goalId) {
  return api.delete(`/goals/${goalId}`);
}
