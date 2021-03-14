import firebase from 'firebase/app';
import fbConfig from './firebase-config';
import 'firebase/firestore';
import 'firebase/functions'

firebase.initializeApp(fbConfig);
const db = firebase.firestore();
const functions = firebase.functions();

if (process.env.NODE_ENV === 'development'){
    db.useEmulator('localhost', 8080);
    functions.useEmulator('localhost', 5001);
}


export {db, functions}