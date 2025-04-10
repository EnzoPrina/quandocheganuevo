import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../data/firebaseConfig';
import { User } from '../models/UserModel';
import { doc, setDoc } from 'firebase/firestore';

export class AuthViewModel {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;
      return { email: userEmail ?? '', uid };
    } catch (error: any) {
      console.error('Login failed:', error.message);
      return null;
    }
  }

  static async register(email: string, password: string, nome: string, apelido: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;

      // Guardar nombre y apellido en Firestore
      await setDoc(doc(db, 'users', uid), {
        email: userEmail,
        nome,
        apelido
      });

      return { email: userEmail ?? '', uid };
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout failed:', error.message);
    }
  }

  static onAuthStateChanged(callback: (user: User | null) => void) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ email: user.email ?? '', uid: user.uid });
      } else {
        callback(null);
      }
    });
  }
}
