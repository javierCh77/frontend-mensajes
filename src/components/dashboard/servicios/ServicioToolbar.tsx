"use client";

import { ClipboardPlus } from "lucide-react";

interface ServicioToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNuevoServicioClick: () => void;
}

export function ServicioToolbar({
  searchTerm,
  onSearchChange,
  onNuevoServicioClick,
}: ServicioToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
      <input
        type="text"
        placeholder="Buscar servicio..."
        className="border px-3 py-1 rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        className="bg-[#059669] hover:bg-[#047854] text-white px-4 py-1 rounded-md flex items-center gap-2 shadow-md"
        onClick={onNuevoServicioClick}
      >
        <ClipboardPlus size={18} /> Nuevo Servicio
      </button>
    </div>
  );
}
