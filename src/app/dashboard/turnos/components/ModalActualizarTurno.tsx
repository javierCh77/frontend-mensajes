import React, { useEffect, useRef, useState } from "react";
import { User, RefreshCw } from "lucide-react";
import { Paciente, Turno } from "../types";

interface Props {
  turno: Turno | null;
  nuevoEstado: string;
  setNuevoEstado: (v: string) => void;
  pacientes: Paciente[];
  pacienteBuscado: string;
  setPacienteBuscado: (v: string) => void;
  pacienteSeleccionado: Paciente | null;
  setPacienteSeleccionado: (p: Paciente | null) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalActualizarTurno = ({
  turno,
  nuevoEstado,
  setNuevoEstado,
  pacientes,
  pacienteBuscado,
  setPacienteBuscado,
  pacienteSeleccionado,
  setPacienteSeleccionado,
  onClose,
  onConfirm,
}: Props) => {
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (turno) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [turno]);

  useEffect(() => {
    if (!turno) {
      setPacienteBuscado("");
      setPacienteSeleccionado(null);
      setError(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turno]);

  if (!turno) return null;

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(pacienteBuscado.toLowerCase())
  );

  const handleConfirm = () => {
    if (nuevoEstado === "pendiente" && !pacienteSeleccionado) {
      setError(true);
      return;
    }

    onConfirm();
    setPacienteBuscado("");
    setPacienteSeleccionado(null);
    setError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" /> Actualizar estado del turno
        </h3>

        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          Paciente: <strong>{turno.paciente.nombre} {turno.paciente.apellido}</strong><br />
          Fecha: <strong>{new Date(turno.fecha).toLocaleString()}</strong>
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo estado</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        {nuevoEstado === "pendiente" && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reasignar a otro paciente</label>
            <div className="relative mb-3">
              <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar paciente..."
                className={`w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error && !pacienteSeleccionado ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-400"
                }`}
                value={
                  pacienteSeleccionado
                    ? `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`
                    : pacienteBuscado
                }
                onChange={(e) => {
                  setPacienteBuscado(e.target.value);
                  setPacienteSeleccionado(null);
                  setError(false);
                }}
              />
            </div>

            {pacienteBuscado && !pacienteSeleccionado && (
              <ul className="border border-gray-300 rounded max-h-40 overflow-y-auto mb-4">
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
                      {p.nombre} {p.apellido}  - <span className="font-bold">DNI: {p.dni} </span> 
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-sm text-gray-500">No se encontraron pacientes</li>
                )}
              </ul>
            )}
          </>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
