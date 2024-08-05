import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCilu9TGghikjI7lMVxFE2VDfXCKQkunfg",
    authDomain: "finalproject-a7c17.firebaseapp.com",
    projectId: "finalproject-a7c17",
    storageBucket: "finalproject-a7c17.appspot.com",
    messagingSenderId: "537944476029",
    appId: "1:537944476029:web:7f90d43c15bd6307b6a414"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };
