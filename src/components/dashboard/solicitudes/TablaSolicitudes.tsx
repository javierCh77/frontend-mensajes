"use client";

import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { SolicitudTurno } from "@/types/solicitud-turno";

interface Props {
  solicitudes: SolicitudTurno[];
  onCambiarEstado: (id: string, nuevoEstado: string) => void;
}

export function TablaSolicitudes({ solicitudes, onCambiarEstado }: Props) {
  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">DNI</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Especialidad</th>
            <th className="px-4 py-2">Profesional</th>
            <th className="px-4 py-2">Franja Horaria</th>
            <th className="px-4 py-2">Obra Social</th>
            <th className="px-4 py-2">Fecha Solicitud</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Modificado por</th>
            <th className="px-4 py-2">Fecha modificación</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{s.nombre}</td>
              <td className="px-4 py-2">{s.apellido}</td>
              <td className="px-4 py-2">{s.dni}</td>
              <td className="px-4 py-2">{s.correo}</td>
              <td className="px-4 py-2">{s.telefono}</td>
              <td className="px-4 py-2">{s.especialidad}</td>
              <td className="px-4 py-2">{s.profesional}</td>
              <td className="px-4 py-2">{s.franjaHoraria}</td>
              <td className="px-4 py-2">{s.obraSocial}</td>
              <td className="px-4 py-2">
                {new Date(s.fechaSolicitud).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`capitalize px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeClass(
                    s.estado
                  )}`}
                >
                  {s.estado}
                </span>
              </td>
              <td className="px-4 py-2">{s.usuarioModificacion || "-"}</td>
              <td className="px-4 py-2">
                {s.fechaModificacion
                  ? new Date(s.fechaModificacion).toLocaleString()
                  : "-"}
              </td>
              <td className="px-4 py-2 text-right">
                <div className="flex gap-2 justify-end">
                  {s.estado !== "confirmado" && (
                    <button
                      title="Confirmar"
                      onClick={() => onCambiarEstado(s.id, "confirmado")}
                      className="text-green-600 hover:text-green-800"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {s.estado !== "cancelado" && (
                    <button
                      title="Cancelar"
                      onClick={() => onCambiarEstado(s.id, "cancelado")}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  {s.estado !== "pendiente" && (
                    <button
                      title="Volver a pendiente"
                      onClick={() => onCambiarEstado(s.id, "pendiente")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <RotateCcw size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
