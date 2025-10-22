// src/utils/firebaseAuth.ts
import { User } from "firebase/auth";

export interface AuthParams {
  token?: string;
  uid?: string;
  email?: string;
  expires?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Récupère les paramètres d'authentification depuis l'URL
 */
export const getAuthParamsFromURL = (): AuthParams => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    token: urlParams.get("firebaseToken") || urlParams.get("token") || undefined,
    uid: urlParams.get("userId") || urlParams.get("uid") || undefined,
    email: urlParams.get("userEmail") || urlParams.get("email") || undefined,
    expires: urlParams.get("expires") || undefined,
  };
};

/**
 * Nettoie les paramètres d'authentification de l'URL
 */
export const cleanAuthParamsFromURL = (): void => {
  const url = new URL(window.location.href);
  const paramsToRemove = ["firebaseToken", "token", "userId", "uid", "userEmail", "email", "expires"];

  paramsToRemove.forEach((param) => {
    url.searchParams.delete(param);
  });

  // Mettre à jour l'URL sans recharger la page
  window.history.replaceState({}, "", url.toString());
};

/**
 * Valide un token Firebase avec le backend
 */
export const verifyTokenWithBackend = async (
  token: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch("/api/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Erreur de validation du token",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erreur de connexion au serveur",
    };
  }
};

/**
 * Vérifie si un token est expiré
 */
export const isTokenExpired = (expires?: string): boolean => {
  if (!expires) return true;

  const expirationTime = parseInt(expires, 10);
  const currentTime = Math.floor(Date.now() / 1000);

  return currentTime >= expirationTime;
};

/**
 * Connecte automatiquement un utilisateur avec un token valide
 */
export const autoSignInWithToken = async (
  token: string
): Promise<AuthResponse> => {
  try {
    // Vérifier le token avec le backend
    const verification = await verifyTokenWithBackend(token);

    if (!verification.success) {
      return verification;
    }

    // Le backend a validé le token, on peut considérer l'utilisateur comme connecté
    return {
      success: true,
      user: verification.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la connexion automatique",
    };
  }
};
