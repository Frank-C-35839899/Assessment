import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyCIHiCv4Fea4OwLSh7yy-xqag7QrkEydOs',
  authDomain: 'fit5032-aa2d6.firebaseapp.com',
  databaseURL: 'https://fit5032-aa2d6-default-rtdb.firebaseio.com',
  projectId: 'fit5032-aa2d6',
  storageBucket: 'fit5032-aa2d6.firebasestorage.app',
  messagingSenderId: '941620305827',
  appId: '1:941620305827:web:f1443964c11246e4568416',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
