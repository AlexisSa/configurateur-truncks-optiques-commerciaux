# Guide d'intégration - Authentification automatique depuis le Hub

## 🎯 Objectif

Permettre aux utilisateurs du Hub XEILOM d'accéder directement à votre outil sans se reconnecter, en utilisant les paramètres d'authentification transmis dans l'URL.

## 📋 Paramètres URL attendus

```
https://votre-outil.com/?token=JWT_TOKEN&uid=USER_ID&email=user@example.com&expires=1234567890
```

## 🚀 Installation

### 1. Variables d'environnement

Créez un fichier `.env.local` avec vos clés Firebase Admin :

```env
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_PRIVEE\n-----END PRIVATE KEY-----\n"
```

### 2. Installation des dépendances

```bash
npm install firebase-admin
```

## 🔧 Utilisation

### Option 1: Remplacement simple d'AuthGuard

```jsx
// src/App.jsx
import AutoAuthGuard from "./components/AutoAuthGuard";

function App() {
  return (
    <AutoAuthGuard fallbackToManualAuth={true}>
      {/* Votre application existante */}
    </AutoAuthGuard>
  );
}
```

### Option 2: Utilisation du hook useAutoAuth

```jsx
// src/components/MyComponent.jsx
import { useAutoAuth } from "../hooks/useAutoAuth";

function MyComponent() {
  const { user, loading, error, isAuthenticated, retry } = useAutoAuth();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!isAuthenticated) return <div>Non connecté</div>;

  return <div>Bonjour {user.email}!</div>;
}
```

## 🔒 Sécurité

### Validation côté serveur

- ✅ Le token est TOUJOURS validé côté serveur via `/api/verify-token`
- ✅ Utilisation de Firebase Admin SDK pour la validation
- ✅ Nettoyage automatique des paramètres URL après utilisation
- ✅ Gestion des tokens expirés

### Bonnes pratiques

- 🔐 Utilisez HTTPS en production
- 🧹 Nettoyez les paramètres URL après authentification
- ⏰ Vérifiez l'expiration des tokens
- 🚫 Ne stockez jamais les tokens côté client

## 🛠️ Configuration du Hub

### URL de redirection

Configurez votre outil dans le Hub avec cette URL :

```
https://votre-outil.com/?token={{userToken}}&uid={{userId}}&email={{userEmail}}&expires={{tokenExpires}}
```

### Paramètres requis

- `token`: JWT Firebase de l'utilisateur
- `uid`: ID unique de l'utilisateur
- `email`: Email de l'utilisateur
- `expires`: Timestamp d'expiration du token

## 🐛 Dépannage

### Erreurs courantes

1. **"Token invalide"**: Vérifiez la configuration Firebase Admin
2. **"Token expiré"**: Le token a dépassé sa durée de vie
3. **"Erreur de connexion"**: Problème réseau ou serveur indisponible

### Logs de débogage

Activez les logs en développement :

```javascript
// Dans useAutoAuth.ts
console.log("Paramètres d'auth:", authParams);
console.log("Résultat de validation:", result);
```

## 📱 Responsive

L'authentification automatique fonctionne sur tous les appareils :

- ✅ Desktop
- ✅ Mobile
- ✅ Tablette

## 🔄 Fallback

Si l'authentification automatique échoue :

- Option de connexion manuelle disponible
- Redirection vers le Hub XEILOM
- Bouton de retry pour réessayer

## 🚀 Déploiement

1. Configurez les variables d'environnement sur votre plateforme
2. Déployez l'API `/api/verify-token`
3. Testez avec des tokens valides du Hub
4. Vérifiez le nettoyage des paramètres URL

## 📞 Support

En cas de problème, vérifiez :

- La configuration Firebase Admin SDK
- Les variables d'environnement
- Les logs du serveur
- La validité des tokens Firebase
