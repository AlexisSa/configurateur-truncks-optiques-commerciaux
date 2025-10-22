// src/components/AutoAuthGuard.tsx
import React, { useState } from "react";
import { useAutoAuth } from "../hooks/useAutoAuth";
import LoginModal from "./LoginModal";

interface AutoAuthGuardProps {
  children: React.ReactNode;
  fallbackToManualAuth?: boolean;
}

const AutoAuthGuard: React.FC<AutoAuthGuardProps> = ({
  children,
  fallbackToManualAuth = true,
}) => {
  const { user, loading, error, isAuthenticated, retry } = useAutoAuth();
  const [showManualLogin, setShowManualLogin] = useState(false);

  // Écran de chargement pendant la validation
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // Utilisateur authentifié avec succès
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // Erreur d'authentification
  if (error) {
    return (
      <div className="auth-error">
        <div className="error-message">
          <h2>🔒 Authentification requise</h2>
          <p>Erreur: {error}</p>

          {fallbackToManualAuth && (
            <div className="auth-actions">
              <button
                onClick={() => setShowManualLogin(true)}
                className="login-button"
              >
                Se connecter manuellement
              </button>
              <button onClick={retry} className="retry-button">
                Réessayer
              </button>
            </div>
          )}

          <p className="hub-redirect">
            Ou accédez au{" "}
            <a
              href="https://hub-outils-xeilom.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hub-link"
            >
              Hub XEILOM
            </a>
          </p>
        </div>

        {showManualLogin && (
          <LoginModal
            isOpen={showManualLogin}
            onClose={() => setShowManualLogin(false)}
          />
        )}
      </div>
    );
  }

  // Fallback par défaut (ne devrait pas arriver)
  return (
    <div className="auth-required">
      <div className="auth-message">
        <h2>🔒 Accès restreint</h2>
        <p>Vous devez être connecté pour accéder à cet outil.</p>
        {fallbackToManualAuth && (
          <button
            onClick={() => setShowManualLogin(true)}
            className="login-button"
          >
            Se connecter
          </button>
        )}
      </div>

      {showManualLogin && (
        <LoginModal
          isOpen={showManualLogin}
          onClose={() => setShowManualLogin(false)}
        />
      )}
    </div>
  );
};

export default AutoAuthGuard;
