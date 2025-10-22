import { useState } from "react";
import { useAuth } from "../firebase/auth";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Connexion requise</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="login-info">
            <p>🔒 Accès réservé aux utilisateurs autorisés</p>
            <p>
              Connectez-vous pour accéder au configurateur de truncks optiques.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && <div className="error-message">❌ {error}</div>}

            <div className="form-actions">
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>
              Pas encore de compte ?
              <a
                href="https://hub-outils-xeilom.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-link"
              >
                Accédez au hub XEILOM
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
