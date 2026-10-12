import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCRQmMUwJ2iixluQNNd8jBVyViV2BtwvzU',
  authDomain: 'urban-canopy-f59c8.firebaseapp.com',
  projectId: 'urban-canopy-f59c8',
  storageBucket: 'urban-canopy-f59c8.firebasestorage.app',
  messagingSenderId: '1091346651097',
  appId: '1:1091346651097:web:ad1134480e2496cad32bc8',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
