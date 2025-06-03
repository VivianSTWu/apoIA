import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDtB8VgpiLV2Qnwvj7DhDIYM2bWqra_dB0',
  authDomain: 'apo-ia.firebaseapp.com',
  projectId: 'apo-ia',
  storageBucket: 'apo-ia.firebasestorage.app',
  messagingSenderId: '483740849182',
  appId: '1:483740849182:web:80ba3324104dbca97b8a0f',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
