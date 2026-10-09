import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
export const loginComGoogle = () => signInWithPopup(auth, googleProvider)
export const logout = () => signOut(auth)
export const getIdToken = () => auth.currentUser?.getIdToken()
