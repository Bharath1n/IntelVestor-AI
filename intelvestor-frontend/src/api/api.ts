import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const getPrediction = async (symbol: string, horizon: number, token: string) => {
  const response = await axios.get(`${API_BASE}/api/stocks/${symbol}/predict?horizon=${horizon}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};