// src/hooks/useAutoAuth.ts
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  getAuthParamsFromURL,
  cleanAuthParamsFromURL,
  isTokenExpired,
  autoSignInWithToken,
  AuthParams,
} from "../utils/firebaseAuth";

export interface AutoAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AutoAuthReturn extends AutoAuthState {
  retry: () => void;
}

/**
 * Hook pour l'authentification automatique depuis le Hub
 */
export const useAutoAuth = (): AutoAuthReturn => {
  const [state, setState] = useState<AutoAuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const performAuth = async (authParams: AuthParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Vérifier si on a les paramètres nécessaires
      if (!authParams.token) {
        setState({
          user: null,
          loading: false,
          error: "Aucun token d'authentification fourni",
          isAuthenticated: false,
        });
        return;
      }

      // Vérifier si le token est expiré
      if (isTokenExpired(authParams.expires)) {
        setState({
          user: null,
          loading: false,
          error: "Token d'authentification expiré",
          isAuthenticated: false,
        });
        return;
      }

      // Tenter la connexion automatique
      const result = await autoSignInWithToken(authParams.token);

      if (result.success && result.user) {
        setState({
          user: result.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });

        // Nettoyer l'URL après connexion réussie
        cleanAuthParamsFromURL();
      } else {
        setState({
          user: null,
          loading: false,
          error: result.error || "Échec de l'authentification",
          isAuthenticated: false,
        });
      }
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: "Erreur lors de l'authentification automatique",
        isAuthenticated: false,
      });
    }
  };

  const retry = () => {
    const authParams = getAuthParamsFromURL();
    performAuth(authParams);
  };

  useEffect(() => {
    const authParams = getAuthParamsFromURL();
    performAuth(authParams);
  }, []);

  return {
    ...state,
    retry,
  };
};
