"use client";

import { BookUser } from "lucide-react";

interface ProfesionalToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNuevoClick: () => void;
}

export function ProfesionalToolbar({
  searchTerm,
  onSearchChange,
  onNuevoClick,
}: ProfesionalToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
      <input
        type="text"
        placeholder="Buscar profesional..."
        className="border px-3 py-2 rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        className="bg-[#25D366] hover:bg-[#1CB255] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
        onClick={onNuevoClick}
      >
        <BookUser size={18} /> Nuevo Profesional
      </button>
    </div>
  );
}
