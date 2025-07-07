"use client";

import { Servicio } from "@/types/servicio";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  servicios: Servicio[];
  onEdit: (s: Servicio) => void;
  onDelete: (id: string) => void;
}

export function TablaServicios({ servicios, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto h-[65vh] rounded-lg border border-gray-200 shadow-md">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-[#1F2937] border-b">
          <tr>
            <th className="px-6 py-3 text-left uppercase tracking-wider text-xs font-semibold">
              Nombre
            </th>
            <th className="px-6 py-3 text-left uppercase tracking-wider text-xs font-semibold">
              Descripción
            </th>
            <th className="px-6 py-3 text-right uppercase tracking-wider text-xs font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {servicios.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-6 py-3 text-[#1F2937]">{s.nombre}</td>
              <td className="px-6 py-3 text-[#4B5563]">{s.descripcion}</td>
              <td className="px-6 py-3  justify-end flex gap-3 text-[#1F2937]">
                <button
                  onClick={() => onEdit(s)}
                  className="hover:text-[#059669] text-[#2f374d] transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="hover:text-red-500 text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
