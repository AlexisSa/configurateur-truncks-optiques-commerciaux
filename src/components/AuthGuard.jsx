import { useAuth } from "../firebase/auth";
import LoginModal from "./LoginModal";
import { useState, useEffect } from "react";

const AuthGuard = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="auth-required">
          <div className="auth-message">
            <h2>🔒 Accès restreint</h2>
            <p>
              Vous devez être connecté pour accéder au configurateur de truncks
              optiques.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="login-button"
            >
              Se connecter
            </button>
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
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  return children;
};

export default AuthGuard;
