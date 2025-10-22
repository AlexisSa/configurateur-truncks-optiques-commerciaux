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
import { debugAuthParams } from "../utils/debugAuth";

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

      // Vérifier si le token est expiré (mais continuer quand même pour permettre le fallback)
      const tokenExpired = isTokenExpired(authParams.expires);
      if (tokenExpired) {
        console.warn("Token expiré détecté, tentative de validation côté serveur...");
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
        let errorMessage = result.error || "Échec de l'authentification";
        
        // Message plus informatif pour les tokens expirés
        if (tokenExpired && result.error?.includes("expiré")) {
          errorMessage = "Session expirée. Veuillez vous reconnecter via le Hub ou utiliser la connexion manuelle.";
        }
        
        setState({
          user: null,
          loading: false,
          error: errorMessage,
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
    debugAuthParams(); // Debug en développement
    performAuth(authParams);
  }, []);

  return {
    ...state,
    retry,
  };
};
