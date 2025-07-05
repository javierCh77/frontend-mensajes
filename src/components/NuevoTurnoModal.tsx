"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAgregar: (nuevoTurno: { paciente: string; fecha: string; hora: string }) => void;
};

export default function NuevoTurnoModal({ isOpen, onClose, onAgregar }: Props) {
  const [paciente, setPaciente] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const handleSubmit = () => {
    if (paciente && fecha && hora) {
      onAgregar({ paciente, fecha, hora });
      setPaciente("");
      setFecha("");
      setHora("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Nuevo Turno</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nombre del paciente"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
