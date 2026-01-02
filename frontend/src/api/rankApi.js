import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const api = axios.create({
  baseURL: BASE_URL,
});

export function getProgress(){
    return api.get("/progress");
}

export function addXP(amount) {
  return api.post("/progress/xp", { amount });
}