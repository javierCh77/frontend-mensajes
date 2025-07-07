"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Profesional } from "@/types/profesional";

interface Props {
  profesionales: Profesional[];
  onEdit: (profesional: Profesional) => void;
  onDelete: (id: string) => void;
}

export function TablaProfesionales({ profesionales, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto border rounded-lg mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">DNI</th>
            <th className="px-4 py-2">Matrícula</th>
            <th className="px-4 py-2">Servicio</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesionales.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{p.nombre}</td>
              <td className="px-4 py-2">{p.apellido}</td>
              <td className="px-4 py-2">{p.dni}</td>
              <td className="px-4 py-2">{p.matricula}</td>
              <td className="px-4 py-2">{p.servicio?.nombre}</td>
              <td className="px-4 py-2 text-right flex justify-end gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-600 hover:text-red-800"
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
