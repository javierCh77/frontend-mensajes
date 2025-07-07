// lib/getUsuarioFromToken.ts
export interface UsuarioToken {
    nombre: string;
    apellido: string;
    fotoPerfil?: string;
    id?: string;
    email?: string;
    rol?: string;
  }
  
  export function getUsuarioFromToken(): UsuarioToken | null {
    if (typeof window === "undefined") return null;
  
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error al decodificar token:", e);
      return null;
    }
  }
  