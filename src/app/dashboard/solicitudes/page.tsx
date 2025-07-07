"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { SolicitudTurno } from "@/types/solicitud-turno";
import { TablaSolicitudes } from "@/components/dashboard/solicitudes/TablaSolicitudes";
import { SolicitudesToolbar } from "@/components/dashboard/solicitudes/SolicitudesToolbar";
import { getUsuarioFromToken } from "@/lib/getUsuarioFromToken";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudTurno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const usuario = getUsuarioFromToken();

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/solicitudes-turno");
      setSolicitudes(res.data);
    } catch {
      toast.error("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    if (!usuario) return toast.error("No se pudo identificar al usuario");

    try {
      await api.patch(`/solicitudes-turno/${id}`, {
        estado: nuevoEstado,
        usuarioModificacion: `${usuario.nombre} ${usuario.apellido}`,
      });
      toast.success(`Turno marcado como ${nuevoEstado}`);
      fetchSolicitudes();
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const matchesBusqueda = `${s.nombre} ${s.apellido} ${s.dni} ${s.correo} ${s.profesional}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesEstado =
      estadoFiltro === "todos" ? true : s.estado === estadoFiltro;

    return matchesBusqueda && matchesEstado;
  });

  return (
    <div className="p-4">
        <div className="flex items-center gap-2 text-[#022c1f]">
        <Inbox color="#10b985" />
        <h2 className="text-2xl font-bold">Solicitud de turnos</h2>
      </div>

      <SolicitudesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        estado={estadoFiltro}
        onEstadoChange={setEstadoFiltro}
      />

      {loading ? (
        <p className="mt-4 text-gray-500">Cargando solicitudes...</p>
      ) : solicitudesFiltradas.length === 0 ? (
        <p className="mt-4 text-gray-500">No hay resultados para mostrar.</p>
      ) : (
        <TablaSolicitudes
          solicitudes={solicitudesFiltradas}
          onCambiarEstado={handleCambiarEstado}
        />
      )}
    </div>
  );
}
