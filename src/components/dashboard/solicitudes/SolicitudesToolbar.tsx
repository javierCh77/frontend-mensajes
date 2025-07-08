"use client";

import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  estado: string;
  onEstadoChange: (estado: string) => void;
}

export function SolicitudesToolbar({
  searchTerm,
  onSearchChange,
  estado,
  onEstadoChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por nombre, DNI, correo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#25D366] text-sm"        />
      </div>
      <select value={estado} onChange={(e) => onEstadoChange(e.target.value)} className="w-full md:w-52 border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#25D366] text-sm">
        <option value="todos">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="confirmado">Confirmado</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </div>
  );
}
