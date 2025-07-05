import React from "react";
import { Profesional } from "../types";

interface Props {
  profesionales: Profesional[];
  seleccionado: string;
  onChange: (id: string) => void;
}

export const SelectProfesional = ({ profesionales, seleccionado, onChange }: Props) => {
  return (
    <div className="mb-4 flex flex-wrap gap-4 items-center">
      <label className="font-medium">Profesional:</label>
      <select
        className="border rounded-lg px-4 py-2"
        value={seleccionado}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Seleccionar</option>
        {profesionales.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre} {p.apellido} - {p.servicio?.nombre || ""}
          </option>
        ))}
      </select>
    </div>
  );
};