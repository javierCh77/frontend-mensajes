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
    <div className="overflow-x-auto border rounded-lg h-[70vh] ">
      <table className=" w-full text-sm text-center ">
        <thead className="bg-gray-100 text-gray-600">
          <tr >
            <th className="p-1 px-4  whitespace-nowrap">Fecha Solicitud</th>
            <th className="p-1 px-3  whitespace-nowrap">Nombre</th>
            <th className="p-1 px-3 whitespace-nowrap">Apellido</th>
            <th className="p-1 px-3 whitespace-nowrap">DNI</th>
            <th className="p-1 px-18 whitespace-nowrap">Correo</th>
            <th className="p-1 px-3 whitespace-nowrap">Teléfono</th>
            <th className="p-1 px-3 whitespace-nowrap">Especialidad</th>
            <th className="p-1 px-5 whitespace-nowrap">Profesional</th>
            <th className="p-1 px-3 whitespace-nowrap">Franja Horaria</th>
            <th className="p-1 px-3 whitespace-nowrap">Obra Social</th>
            <th className="p-1 px-3 whitespace-nowrap">Estado</th>
            <th className="p-1 px-6 whitespace-nowrap">Modifico</th>
            <th className="p-1 px-3 whitespace-nowrap">Fecha modificación</th>
            <th className="p-1 px-3 text-center whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s, i) => (
            <tr
              key={s.id}
              className={`border-t hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <td className="p-1">{new Date(s.fechaSolicitud).toLocaleString()}</td>
              <td className="p-1">{s.nombre}</td>
              <td className="p-1">{s.apellido}</td>
              <td className="p-1">{s.dni}</td>
              <td className="p-1 truncate max-w-[160px]">{s.correo}</td>
              <td className="p-1">{s.telefono}</td>
              <td className="p-1">{s.especialidad}</td>
              <td className="p-1">{s.profesional}</td>
              <td className="p-1">{s.franjaHoraria}</td>
              <td className="p-1">{s.obraSocial}</td>
              <td className="p-1">
                <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeClass(s.estado)}`}>
                  {s.estado}
                </span>
              </td>
              <td className="p-1">{s.usuarioModificacion || "-"}</td>
              <td className="p-1">
                {s.fechaModificacion
                  ? new Date(s.fechaModificacion).toLocaleString()
                  : "-"}
              </td>
              <td className="p-1 text-center">
                <div className="flex gap-2 justify-center">
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
