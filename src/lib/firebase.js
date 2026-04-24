import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB88Od0nOO6xRaCu_PIwHmbQSVoJl7FDt0",
  authDomain: "escotel-task-manager.firebaseapp.com",
  projectId: "escotel-task-manager",
  messagingSenderId: "718033441537",
  appId: "1:718033441537:web:d71f7b42ab8ae0fd1b4100"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)