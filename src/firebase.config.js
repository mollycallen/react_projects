import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBxhbxqkssa97FFtU67XuMj8Zy8Wq-YJRA',
  authDomain: 'projectmanager-be6bd.firebaseapp.com',
  projectId: 'projectmanager-be6bd',
  storageBucket: 'projectmanager-be6bd.appspot.com',
  messagingSenderId: '485361564814',
  appId: '1:485361564814:web:9d41d1e07d0ef053dedddf'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
