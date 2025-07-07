// components/dashboard/servicios/EditarServicioModal.tsx
"use client";

import { Pencil } from "lucide-react";
import { ServicioInput } from "@/types/servicio";
import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  datos: ServicioInput;
  errores: Partial<Record<keyof ServicioInput, string>>;
  setDatos: (data: ServicioInput) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const EditarServicioModal = ({ open, datos, errores, setDatos, onClose, onSubmit }: Props) => {
  const nombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => nombreRef.current?.focus(), 100);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <Pencil />
          <h2 className="text-lg font-semibold">Editar Servicio</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              ref={nombreRef}
              type="text"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              className={`w-full mt-1 p-2 border rounded ${errores.nombre ? "border-red-400" : "border-gray-300"}`}
              placeholder="Ej. Kinesiología"
            />
            {errores.nombre && <p className="text-red-500 text-xs">{errores.nombre}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Descripción</label>
            <input
              type="text"
              value={datos.descripcion}
              onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
              className={`w-full mt-1 p-2 border rounded ${errores.descripcion ? "border-red-400" : "border-gray-300"}`}
              placeholder="Ej. Rehabilitación física"
            />
            {errores.descripcion && <p className="text-red-500 text-xs">{errores.descripcion}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
          <button onClick={onSubmit} className=" text-white px-4 py-2 rounded bg-[#059669] hover:bg-[#047854]">
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};
