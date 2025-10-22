// api/verify-token.js
const admin = require("firebase-admin");

// Initialiser Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function handler(req, res) {
  // Vérifier la méthode HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token manquant" });
    }

    // Vérifier le token Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Récupérer les informations utilisateur
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    // Retourner les données utilisateur (sans informations sensibles)
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      emailVerified: userRecord.emailVerified,
      photoURL: userRecord.photoURL,
      customClaims: userRecord.customClaims,
    };

    res.status(200).json({
      success: true,
      user: userData,
      token: decodedToken,
    });
  } catch (error) {
    console.error("Erreur de validation du token:", error);

    // Gérer différents types d'erreurs
    if (error.code === "auth/invalid-token") {
      return res.status(401).json({ error: "Token invalide" });
    }

    if (error.code === "auth/token-expired") {
      return res.status(401).json({ error: "Token expiré" });
    }

    if (error.code === "auth/user-disabled") {
      return res.status(403).json({ error: "Utilisateur désactivé" });
    }

    res.status(500).json({
      error: "Erreur interne du serveur",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
