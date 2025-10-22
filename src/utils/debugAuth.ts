// src/utils/debugAuth.ts
/**
 * Fonction de debug pour tester l'authentification automatique
 * À utiliser uniquement en développement
 */
export const debugAuthParams = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('firebaseToken');
  const userId = urlParams.get('userId');
  const userEmail = urlParams.get('userEmail');
  
  console.group('🔍 Debug Auth Params');
  console.log('Token présent:', !!token);
  console.log('User ID:', userId);
  console.log('User Email:', userEmail);
  
  if (token) {
    try {
      // Décoder le JWT pour voir les infos (sans validation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token exp:', new Date(payload.exp * 1000));
      console.log('Token iat:', new Date(payload.iat * 1000));
      console.log('Token maintenant:', new Date());
      console.log('Token expiré:', Date.now() / 1000 > payload.exp);
    } catch (e) {
      console.error('Erreur décodage token:', e);
    }
  }
  console.groupEnd();
};

/**
 * Génère une URL de test avec un token valide (pour debug)
 */
export const generateTestUrl = (baseUrl: string) => {
  const testToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMjEzMGZlZjAyNTg3ZmQ4ODYxODg2OTgyMjczNGVmNzZhMTExNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vaHViLW91dGlscy14ZWlsb20iLCJhdWQiOiJodWItb3V0aWxzLXhlaWxvbSIsImF1dGhfdGltZSI6MTc2MTEzMDI5NiwidXNlcl9pZCI6IlFzZDg1bjM4cmxVa242MFo5dmVrWHJNSTB5bzEiLCJzdWIiOiJRc2Q4NW4zOHJsVWtuNjBaOXZla1hyTUkweW8xIiwiaWF0IjoxNzYxMTMwMjk2LCJleHAiOjE3NjExMzM4OTYsImVtYWlsIjoiY29tbXVuaWNhdGlvbkB4ZWlsb20uZnIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjb21tdW5pY2F0aW9uQHhlaWxvbS5mciJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.GCcumunJ0zckUKB5DwP8q7VxweOfU-YmTtXpQlQndXJdDT0HlGBb23STQMLzdA0nmPZSWmxz5nSH-gYnVqyZeHmVulgvXMRBNNHv40_jj2EltHLOJg4pQFuym5Ok_Dwpo2A39gkVFkMW7CkG6wuuOYsm2bcXimyllYY__T0SyCnmowEKcc1zeqVSgxwxZrDuRnTvcjoPuW_ZdcoiCp4iDnPbLOv_nt3L4GuRxGbaQmEnH8XNUqqbn2sca0UyJsSp11PCuSnNBis65qPXql7TfkR0H0jYyzt8GhungGhlavH5_KBWmEPn0WAS3ddoTkuABCNeHZiIFmS9lu28wxGpog';
  const testUserId = 'Qsd85n38rlUkn60Z9vekXrMI0yo1';
  const testUserEmail = 'communication@xeilom.fr';
  
  // Créer un token avec expiration dans 1 heure
  const futureExp = Math.floor(Date.now() / 1000) + 3600;
  
  return `${baseUrl}?firebaseToken=${testToken}&userId=${testUserId}&userEmail=${encodeURIComponent(testUserEmail)}&expires=${futureExp}`;
};
