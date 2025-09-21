import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

export const getPrediction = async (symbol: string, horizon: number) => {
  const { getToken } = useAuth();
  const token = await getToken();
  const response = await axios.get(`${API_BASE}/api/stocks/${symbol}/predict?horizon=${horizon}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};