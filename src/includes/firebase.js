import { initializeApp } from 'firebase/app' // NOTE: core module must always be imported first
import { getAuth } from 'firebase/auth' // authentication module from Firebase SDK
import { getFirestore, collection } from 'firebase/firestore' // Database service module
import { getStorage } from 'firebase/storage' // Storage service module

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAh1VIgs2g3EzoYS_Rv4rmTcJXa2euP3YE',
  authDomain: 'ud-music-27489.firebaseapp.com',
  projectId: 'ud-music-27489',
  storageBucket: 'ud-music-27489.appspot.com',
  // messagingSenderId: "815258289021",
  appId: '1:815258289021:web:592a512d3804a2cd770214'
}

// Initializes Firebase & returns instance we can use to communicate with Firebase DB in our code
// Exporting instance makes it accessible to out components
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Let's instruct Firebase to keep files in user storage
// PWA: It's a 'blackbox' solution. Firebase will sync data with the server when the user is back online internally
// db.enablePersistence().catch((error) => {
//   // If we get this error, it means 'offline support' won't work
//   console.log(`Firebase persistence error: ${error.code}`)
// })

const usersCollection = collection(db, 'users') // We'll export User collection so that it's accessible from multiple components
const songsCollection = collection(db, 'songs')
const commentsCollection = collection(db, 'comments')

export { app, auth, db, usersCollection, songsCollection, commentsCollection, storage }
