// Importation de la fonction "create" de Zustand (librairie pour gérer l'état global dans React)
import { create } from 'zustand';

// Importation d'Axios pour faire des requêtes HTTP vers le backend
import axios from 'axios';

// Définition de l'URL de base de l'API d'authentification
const API_URL = 'http://localhost:5000/api/auth';

// Création d'un store Zustand (useAuthStore) pour gérer l'état lié à l'authentification
export const useAuthStore = create((set) => ({ 
  // L'utilisateur connecté (par défaut null)
  user: null,
  // Indique si un utilisateur est authentifié ou non
  isAuthenticated: false,
  // Message d'erreur en cas de problème (par défaut null)
  error: null,
  // État de chargement (par défaut false)
  isLoading: false,
  // Indique si l’application est en train de vérifier l’état d’authentification (utile au chargement initial)
  isCheckingAuth: true,

  /**
   * Fonction signup : permet à un utilisateur de s'inscrire
   * @param {string} email - l'email de l'utilisateur
   * @param {string} name - le nom de l'utilisateur
   * @param {string} password - le mot de passe de l'utilisateur
   */
  signup: async (email, name, password) => {
    // Mise à jour du store : on lance le chargement et on réinitialise l'erreur
    set({ isLoading: true, error: null });

    try {
      // Envoi d'une requête POST à l'API d'inscription
      const response = await axios.post(`${API_URL}/signup`, { email, name, password });

      // Mise à jour du store si l'inscription réussit
      set({ 
        user: response.data.user,       // Sauvegarde les données de l'utilisateur renvoyées par l'API
        isAuthenticated: true,          // Marque l'utilisateur comme authentifié
        isLoading: false,               // Fin du chargement
        error: null                     // Pas d'erreur
      });

      // Debug : affiche la réponse complète dans la console
      console.log(response.data);

    } catch (error) {
      // Mise à jour du store en cas d'erreur
      set({ 
        error: error.response?.data?.message || "Erreur lors de l'inscription", // Message personnalisé ou défaut
        isLoading: false                  // Fin du chargement malgré l'erreur
      });
    }
  }
}));
