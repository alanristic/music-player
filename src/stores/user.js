import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, usersCollection } from '@/includes/firebase'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    // REGISTER Action
    async register(values) {
      // Register user with Google's Firebase (token is available after successful registration)
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)

      // We create Document into Firebase AND connect it via UUID
      await setDoc(doc(usersCollection, userCred.user.uid), {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      await updateProfile(userCred.user, {
        displayName: values.name
      })

      this.userLoggedIn = true
    },
    // LOGIN Action
    async login(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      this.userLoggedIn = true // globally accessible flag that user is logged-in
    },
    // LOG-OUT Action
    async logout() {
      await signOut(auth)
      this.userLoggedIn = false
    }
  }
})
