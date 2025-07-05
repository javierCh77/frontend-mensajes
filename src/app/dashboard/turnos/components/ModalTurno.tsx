import React, { useEffect, useRef, useState } from "react";
import { User, MessageCircle } from "lucide-react";
import { Paciente } from "../types";


interface Props {
  open: boolean;
  pacientes: Paciente[];
  fechaSeleccionada: Date | null;
  pacienteBuscado: string;
  setPacienteBuscado: (v: string) => void;
  pacienteSeleccionado: Paciente | null;
  setPacienteSeleccionado: (p: Paciente | null) => void;
  motivoConsulta: string;
  setMotivoConsulta: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalTurno = ({
  open,
  pacientes,
  fechaSeleccionada,
  pacienteBuscado,
  setPacienteBuscado,
  pacienteSeleccionado,
  setPacienteSeleccionado,
  motivoConsulta,
  setMotivoConsulta,
  onClose,
  onConfirm,
}: Props) => {
  const [error, setError] = useState(false);
  const pacienteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        pacienteInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPacienteBuscado("");
      setPacienteSeleccionado(null);
      setMotivoConsulta("");
      setError(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || !fechaSeleccionada) return null;

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(pacienteBuscado.toLowerCase())
  );

  const handleConfirm = () => {
    if (!pacienteSeleccionado || motivoConsulta.trim() === "") {
      setError(true);
      return;
    }

    onConfirm();
    setPacienteBuscado("");
    setPacienteSeleccionado(null);
    setMotivoConsulta("");
    setError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" /> Asignar Turno
        </h3>

        <div className="text-sm text-gray-700 mb-4">
          <p><strong>Fecha:</strong> {fechaSeleccionada.toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {fechaSeleccionada.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>

        {/* Buscar paciente */}
        <label className="text-sm font-medium text-gray-700 mb-1 block">Buscar paciente</label>
        <div className="relative mb-3">
          <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            ref={pacienteInputRef}
            type="text"
            className={`w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 ${
              error && !pacienteSeleccionado ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-400"
            }`}
            placeholder="Ej: Juan Pérez"
            value={
              pacienteSeleccionado ? `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}` : pacienteBuscado
            }
            onChange={(e) => {
              setPacienteBuscado(e.target.value);
              setPacienteSeleccionado(null);
              setError(false);
            }}
          />
        </div>

        {pacienteBuscado && !pacienteSeleccionado && (
          <ul className="border border-gray-300 rounded-md max-h-40 overflow-y-auto mb-4">
            {pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((p) => (
                <li
                  key={p.id}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setPacienteSeleccionado(p);
                    setPacienteBuscado("");
                  }}
                >
                  {p.nombre} {p.apellido} - <span className="font-bold">DNI: {p.dni} </span> 
                </li>
              ))
            ) : (
              <li className="p-2 text-sm text-gray-500">No se encontraron pacientes</li>
            )}
          </ul>
        )}

        {/* Motivo */}
        <label className="text-sm font-medium text-gray-700 mb-1 block">Motivo de consulta</label>
        <div className="relative mb-4">
          <MessageCircle className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Ej: Control, Dolor, Limpieza"
            className={`w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 ${
              error && motivoConsulta.trim() === "" ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-400"
            }`}
            value={motivoConsulta}
            onChange={(e) => {
              setMotivoConsulta(e.target.value);
              setError(false);
            }}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!pacienteSeleccionado}
            className={`px-4 py-2 rounded-md text-white transition-all ${
              pacienteSeleccionado
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
