import * as admin from 'firebase-admin';

export default defineNitroPlugin(() => {
  if (admin.apps.length === 0) {
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized.');
  }
});