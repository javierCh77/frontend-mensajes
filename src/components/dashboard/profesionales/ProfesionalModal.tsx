"use client";

import { BookUser } from "lucide-react";
import { Servicio } from "@/types/servicio";
import { ProfesionalInput } from "@/types/profesional";

interface Props {
  open: boolean;
  datos: ProfesionalInput;
  errores: Partial<Record<keyof ProfesionalInput, string>>;
  servicios: Servicio[];
  setDatos: (data: ProfesionalInput) => void;
  onClose: () => void;
  onSubmit: () => void;
  editando?: boolean;
}

export function ProfesionalModal({
  open,
  datos,
  errores,
  servicios,
  setDatos,
  onClose,
  onSubmit,
  editando = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-[#1F5D89]">
          <BookUser />
          <h2 className="text-xl font-semibold">
            {editando ? "Editar Profesional" : "Nuevo Profesional"}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                errores.nombre
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]"
              } focus:outline-none focus:ring-2`}
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Apellido</label>
            <input
              type="text"
              value={datos.apellido}
              onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
              className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                errores.apellido
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]"
              } focus:outline-none focus:ring-2`}
            />
            {errores.apellido && (
              <p className="text-red-500 text-xs mt-1">{errores.apellido}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">DNI</label>
            <input
              type="text"
              value={datos.dni}
              onChange={(e) => setDatos({ ...datos, dni: e.target.value })}
              className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                errores.dni
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]"
              } focus:outline-none focus:ring-2`}
            />
            {errores.dni && (
              <p className="text-red-500 text-xs mt-1">{errores.dni}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Matrícula</label>
            <input
              type="text"
              value={datos.matricula}
              onChange={(e) => setDatos({ ...datos, matricula: e.target.value })}
              className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                errores.matricula
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]"
              } focus:outline-none focus:ring-2`}
            />
            {errores.matricula && (
              <p className="text-red-500 text-xs mt-1">{errores.matricula}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Servicio</label>
            <select
              value={datos.servicioId}
              onChange={(e) =>
                setDatos({ ...datos, servicioId: e.target.value })
              }
              className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                errores.servicioId
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]"
              } focus:outline-none focus:ring-2`}
            >
              <option value="">Seleccionar servicio</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
            {errores.servicioId && (
              <p className="text-red-500 text-xs mt-1">{errores.servicioId}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm rounded-lg bg-[#25D366] text-white hover:bg-[#1CB255] transition shadow-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
