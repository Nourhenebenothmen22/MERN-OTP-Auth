import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, name, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, name, password });
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Erreur lors de l'inscription", 
        isLoading: false 
      });
    }
  }
}));