"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (fechaHora: string) => void;
}

export default function ConfirmarTurnoModal({ isOpen, onClose, onConfirmar }: Props) {
  const [fechaHora, setFechaHora] = useState("");

  // Resetear valor al abrir/cerrar
  useEffect(() => {
    if (!isOpen) setFechaHora("");
  }, [isOpen]);

  const handleConfirmar = () => {
    if (fechaHora) {
      onConfirmar(fechaHora);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Fondo semitransparente */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Contenedor modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">Confirmar Turno</Dialog.Title>

          <label className="block text-sm mb-1">Fecha y Hora del Turno:</label>
          <input
            type="datetime-local"
            className="w-full border rounded px-2 py-1 mb-4"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={!fechaHora}
              className={`px-3 py-1 rounded text-white transition ${
                fechaHora
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Confirmar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
