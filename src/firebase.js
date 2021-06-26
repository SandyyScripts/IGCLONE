import firebase from "firebase";


const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyA7DoJzMjIOexsqoWqID5KO0UfWqsXvFn4",
	authDomain: "instagram-clone-41354.firebaseapp.com",
	projectId: "instagram-clone-41354",
	storageBucket: "instagram-clone-41354.appspot.com",
	messagingSenderId: "241852255481",
	appId: "1:241852255481:web:59261f0b74794cb490a628",
	measurementId: "G-W9DEGQ77CV",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
