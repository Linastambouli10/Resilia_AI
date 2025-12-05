// src/utils/api.js
import axios from 'axios';

// 1. Point to your Spring Boot Backend
const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor: Automatically add the JWT Token to every request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("resiliaUser"));
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;