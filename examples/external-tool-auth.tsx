// examples/external-tool-auth.tsx
import React from "react";
import AutoAuthGuard from "../src/components/AutoAuthGuard";
import { useAutoAuth } from "../src/hooks/useAutoAuth";

// Exemple 1: Utilisation simple avec AutoAuthGuard
const SimpleApp: React.FC = () => {
  return (
    <AutoAuthGuard>
      <div className="app">
        <h1>Mon Outil</h1>
        <p>
          Contenu protégé accessible uniquement aux utilisateurs authentifiés
        </p>
      </div>
    </AutoAuthGuard>
  );
};

// Exemple 2: Utilisation avancée avec le hook useAutoAuth
const AdvancedApp: React.FC = () => {
  const { user, loading, error, isAuthenticated, retry } = useAutoAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Authentification en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Erreur d'authentification</h2>
        <p>{error}</p>
        <button onClick={retry}>Réessayer</button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="unauthorized">
        <h2>Accès non autorisé</h2>
        <p>Vous devez être connecté pour accéder à cette application.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>Mon Outil</h1>
        <div className="user-info">
          <span>Connecté en tant que: {user?.email}</span>
        </div>
      </header>

      <main>
        <h2>Bienvenue dans votre outil !</h2>
        <p>Vous êtes maintenant connecté automatiquement depuis le Hub.</p>

        {/* Contenu de votre application */}
        <div className="tool-content">{/* Vos composants ici */}</div>
      </main>
    </div>
  );
};

// Exemple 3: Intégration dans App.jsx existant
const AppWithAutoAuth: React.FC = () => {
  return (
    <AutoAuthGuard fallbackToManualAuth={true}>
      {/* Votre application existante */}
      <div className="existing-app">{/* Vos composants existants */}</div>
    </AutoAuthGuard>
  );
};

export { SimpleApp, AdvancedApp, AppWithAutoAuth };
