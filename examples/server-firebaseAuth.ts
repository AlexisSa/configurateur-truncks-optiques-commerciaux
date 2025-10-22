// examples/server-firebaseAuth.ts
import admin from "firebase-admin";

// Configuration Firebase Admin SDK
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export interface TokenVerificationResult {
  success: boolean;
  user?: admin.auth.UserRecord;
  token?: admin.auth.DecodedIdToken;
  error?: string;
}

/**
 * Valide un token Firebase côté serveur
 */
export const verifyFirebaseToken = async (
  idToken: string
): Promise<TokenVerificationResult> => {
  try {
    // Vérifier le token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Récupérer les informations utilisateur
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    return {
      success: true,
      user: userRecord,
      token: decodedToken,
    };
  } catch (error) {
    console.error("Erreur de validation du token:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Middleware Express pour l'authentification
 */
export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Token d'authentification manquant" });
    }

    const token = authHeader.substring(7);
    const result = await verifyFirebaseToken(token);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = result.user;
    req.token = result.token;

    next();
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/**
 * Fonction utilitaire pour créer un token personnalisé
 */
export const createCustomToken = async (
  uid: string,
  additionalClaims?: any
): Promise<string> => {
  try {
    return await admin.auth().createCustomToken(uid, additionalClaims);
  } catch (error) {
    throw new Error(`Erreur lors de la création du token: ${error.message}`);
  }
};

/**
 * Fonction pour révoquer tous les tokens d'un utilisateur
 */
export const revokeUserTokens = async (uid: string): Promise<void> => {
  try {
    await admin.auth().revokeRefreshTokens(uid);
  } catch (error) {
    throw new Error(
      `Erreur lors de la révocation des tokens: ${error.message}`
    );
  }
};
