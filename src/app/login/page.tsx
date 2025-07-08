"use client";

import React, { useState } from "react";

import animationData from "../../../public/lottie/logo.json";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import TypewriterText from "@/components/login/TypeWriterText";
import Lottie from "lottie-react";
import Image from "next/image";

export default function LoginPage() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Validando credenciales..."
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.status >= 200 && response.status < 300) {
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);
        setStatusMessage("Redireccionando al sistema...");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError("Error desconocido al iniciar sesión.");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          setError(
            "Credenciales inválidas. Por favor, verifica tu contraseña."
          );
        } else if (error.response.status === 404) {
          setError("El usuario no existe. Verifica tu correo.");
        } else {
          setError(error.response.data.message || "Error al iniciar sesión.");
        }
      } else {
        setError("No se pudo conectar al servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-[#1E293B]">
      {/* LADO IZQUIERDO: Estética WhatsApp automation refinada */}
      <div className="relative flex flex-col items-center justify-center bg-gradient-to-b from-[#059669] via-[#A1F3C3] to-white md:rounded-r-[80px] overflow-hidden px-6 py-10 text-center gap-6">
        {/* Fondo ondulado */}
        <svg
          className="absolute inset-0 w-full h-full z-0"
          viewBox="0 0 800 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#A1F3C3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 0 C 200 300 600 100 800 400 C 600 600 200 500 0 800 Z"
            fill="url(#waveGradient)"
          />
        </svg>

        <div className="z-10 flex flex-col items-center justify-center gap-4">
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white">Convers</span>
            <span className="text-[#a7f3db]">IA</span>
            <motion.span
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-block text-white ml-2"
            >
              💬
            </motion.span>
          </motion.h1>

          <div className="w-[180px]  md:w-[300px]">
            <Lottie animationData={animationData} loop={true} />
          </div>

          <TypewriterText
            text=" IIA que conversa por vos. Automatizá interacciones y optimizá tu tiempo en cada mensaje."
            speed={80}
            className="text-white text-base md:text-lg text-center max-w-sm drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      {/* LADO DERECHO: Formulario */}
      <div className="flex flex-col justify-center px-8 sm:px-16 md:px-32 shadow-xl rounded-t-2xl md:rounded-none">
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo/logoclinica.png"
                alt="Logo"
                width={180}
                height={180}
                className="w-24 sm:w-32 md:w-48 h-auto"
              />
            </div>

            <div className="relative">
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
                className="w-full px-10 py-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#34d3a2]"
                placeholder="usuario@autowhats.com"
              />
              <User className="absolute left-3 top-8 h-5 w-5 text-[#6ee7c1]" />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-10 py-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#34d3a2]"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-8 h-5 w-5 text-[#6ee7c1]" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#64748B]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#6ee7c1]"
                />
                Recordarme
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#10b985] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="transition-transform duration-200 hover:scale-[1.02] ease-in-out w-full py-2 px-4 bg-[#059669] hover:bg-[#10b985] text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] cursor-pointer flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  {statusMessage}
                </>
              ) : (
                "Ingresar"
              )}
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-[#94A3B8]">
          <span className="flex justify-center gap-1">
            &copy; {currentYear}{" "}
            <span className="text-[#059669] font-bold">Alba</span> Dev
          </span>
          <span>Todos los derechos reservados.</span>
        </div>
      </div>
    </div>
  );
}
