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

export function updateGoalDifficulty(goalId, difficulty){
  return api.patch(`/goals/${goalId}/difficulty`,{difficulty})
}

export function renameGoal(goalId, newTitle) {
  return api.put(`/goals/${goalId}`, null, {
    params: { newTitle },
  });
}

export function deleteGoal(goalId) {
  return api.delete(`/goals/${goalId}`);
}

export function reorderGoals(positions) {
  return api.put("/goals/reorder", positions);
}

export function toggleArchiveGoal(goalId){
  return api.put(`/goals/${goalId}/archived/toggle`);
}

export function getArchiveGoals(){
  return api.get("/goals/archived")
}

export function getActiveGoals(){
  return api.get("/goals/active")
}

export function getAchievements(){
  return api.get("/goals/achievements")
}

export function completeGoal(goalId) {
  return api.put(`/goals/${goalId}/complete`);
}

export function toggleAchievementGoal(goalId) {
  return api.put(`/goals/${goalId}/achievement/toggle`);
}

