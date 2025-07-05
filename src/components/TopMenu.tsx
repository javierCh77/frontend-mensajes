"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/es";
import Image from "next/image";

interface User {
  nombre: string;
  apellido: string;
  fotoPerfil?: string;
}

const TopMenu = () => {
  const [horaActual, setHoraActual] = useState(moment());
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUsuario({
          nombre: decoded.nombre,
          apellido: decoded.apellido,
          fotoPerfil: decoded.fotoPerfil,
        });
      }
    }

    const intervalo = setInterval(() => {
      setHoraActual(moment());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const obtenerIniciales = (nombre: string, apellido: string) => {
    return `${nombre[0]}${apellido[0]}`.toUpperCase();
  };

  // Función para decodificar el JWT
  function parseJwt(token: string) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
      console.log(e)
    }
  }

  if (!usuario) return null; // o un loading spinner

  return (
    <div className="w-full flex justify-between items-center bg-white shadow px-6 py-2">
      <div>
        <p className="text-gray-800 font-medium">
          {horaActual.format("dddd, D [de] MMMM [de] YYYY")}
        </p>
        <p className="text-sm text-gray-500">{horaActual.format("HH:mm:ss")}</p>
      </div>

      <div className="flex flex-row-reverse items-center gap-3">
        <div className="relative">
          {usuario.fotoPerfil ? (
            <Image
              src={usuario.fotoPerfil}
              alt="Perfil"
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {obtenerIniciales(usuario.nombre, usuario.apellido)}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        <span className="text-sm text-gray-700">
          {usuario.nombre} {usuario.apellido}
        </span>
      </div>
    </div>
  );
};

export default TopMenu;
