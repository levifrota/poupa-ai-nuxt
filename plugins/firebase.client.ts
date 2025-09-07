// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { useFirebaseApp } from 'vuefire';

// export default defineNuxtPlugin(() => {
//   // Use the Firebase app already initialized by nuxt-vuefire
//   const app = useFirebaseApp();
  
//   // Get auth and firestore instances from the existing app
//   const auth = getAuth(app);
//   const db = getFirestore(app);

//   return {
//     provide: {
//       // Don't provide firebaseApp as it's already provided by nuxt-vuefire
//       firebaseClientAuth: auth, // Renamed to avoid conflicts
//       firebaseClientDb: db      // Renamed to avoid conflicts
//     }
//   };

// });