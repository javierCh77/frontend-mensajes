'use client';

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email });
    // Aquí harías la petición para enviar el correo de recuperación
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 sm:p-16">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
          >
            Enviar enlace de recuperación
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-sky-600 hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
