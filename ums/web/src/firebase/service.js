import firebase from 'firebase';
import '@firebase/messaging';

// Initializes the firebase service.
const config = {
    apiKey: "AIzaSyCjAgFRX2_Bn1c7WuukMAMbPgx_dUUGa2o",
    authDomain: "university-messaging-system.firebaseapp.com",
    databaseUrl: "https://university-messaging-system.firebaseio.com",
    projectId: "university-messaging-system",
    storageBucket: "university-messaging-system.appspot.com",
    messagingSenderId: "125689732989",
    appId: "1:125689732989:web:e8b619fce660add8483614",
    measurementId: "G-NR5NX14XY8"
};
firebase.initializeApp(config);
// For testing purposes, the following line must be commented out. Firebase messaging will not work unless a modern browser is used.
// firebase.messaging();
export const auth = firebase.auth;
export const firestore = firebase.firestore;
export const storage = firebase.storage;
export const messaging = firebase.messaging;