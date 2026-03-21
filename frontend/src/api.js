import axios from "axios";

// In production Django serves both frontend and API from the same origin.
// In dev, CRA's proxy forwards /api/* to localhost:8000.
const BASE = process.env.REACT_APP_API_URL || "/api";

export const api = axios.create({ baseURL: BASE });

export const getTransactions = (params = {}) => api.get("/transactions/", { params });
export const createTransaction = (data) => api.post("/transactions/", data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}/`);

export const getCategories = () => api.get("/categories/");
export const createCategory = (data) => api.post("/categories/", data);

export const getMonthlySummary = (month, year) =>
  api.get("/summary/", { params: { month, year } });

export const getAIInsights = (month, year, summary) =>
  api.post("/insights/", { month, year, summary });
