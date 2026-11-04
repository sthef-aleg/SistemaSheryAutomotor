import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-shery-dark">
      <button onClick={handleLogin} className="bg-shery-gold text-black px-6 py-3 rounded-full font-bold">
        Acceder al Panel Administrativo
      </button>
    </div>
  );
}
