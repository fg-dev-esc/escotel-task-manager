import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB88Od0nOO6xRaCu_PIwHmbQSVoJl7FDt0",
  authDomain: "escotel-task-manager.firebaseapp.com",
  projectId: "escotel-task-manager",
  storageBucket: "escotel-task-manager.firebasestorage.app",
  messagingSenderId: "718033441537",
  appId: "1:718033441537:web:d71f7b42ab8ae0fd1b4100"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)