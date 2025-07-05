"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { CalendarDays, Clock4, PlusCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  profesionalId: string;
  onSuccess: () => void;
}

export default function CronogramaModal({ open, onClose, profesionalId, onSuccess }: Props) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [duracionTurno, setDuracionTurno] = useState(30);
  const [dia, setDia] = useState<number | "">("");
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const erroresNuevos: { [key: string]: string } = {};
    if (!fechaInicio) erroresNuevos.fechaInicio = "Campo obligatorio";
    if (!fechaFin) erroresNuevos.fechaFin = "Campo obligatorio";
    if (!horaInicio) erroresNuevos.horaInicio = "Campo obligatorio";
    if (!horaFin) erroresNuevos.horaFin = "Campo obligatorio";
    if (!duracionTurno || duracionTurno <= 0) erroresNuevos.duracionTurno = "Debe ser mayor a 0";
    if (!dia) erroresNuevos.dia = "Debe seleccionar un día";

    if (Object.keys(erroresNuevos).length > 0) {
      setErrores(erroresNuevos);
      return;
    }

    setErrores({});

    const fechaInicioISO = new Date(`${fechaInicio}T${horaInicio}:00`).toISOString();
    const fechaFinISO = new Date(`${fechaFin}T${horaFin}:00`).toISOString();

    const datos = {
      profesionalId,
      fechaInicio: fechaInicioISO,
      fechaFin: fechaFinISO,
      horaInicio: fechaInicioISO,
      horaFin: fechaFinISO,
      duracionTurno,
      diaSemana: Number(dia),
    };

    try {
      await api.post("/cronograma", datos);
      toast.success("Cronograma creado correctamente");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al crear cronograma");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[#f3f4f6] p-6 rounded-xl shadow-lg w-full max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="text-blue-700" />
          <h3 className="text-lg font-semibold">Nuevo Cronograma</h3>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Día de la Semana</label>
            <select
              value={dia}
              onChange={(e) => setDia(parseInt(e.target.value))}
              className={`w-full border px-3 py-2 rounded mt-1 ${errores.dia ? "border-red-400" : "border-gray-300"}`}
            >
              <option value="">Seleccionar día</option>
              <option value="1">Lunes</option>
              <option value="2">Martes</option>
              <option value="3">Miércoles</option>
              <option value="4">Jueves</option>
              <option value="5">Viernes</option>
              <option value="6">Sábado</option>
              <option value="7">Domingo</option>
            </select>
            {errores.dia && <p className="text-red-500 text-xs mt-1">{errores.dia}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className={`w-full border px-3 py-2 rounded mt-1 ${errores.fechaInicio ? "border-red-400" : "border-gray-300"}`}
              />
              {errores.fechaInicio && <p className="text-red-500 text-xs mt-1">{errores.fechaInicio}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className={`w-full border px-3 py-2 rounded mt-1 ${errores.fechaFin ? "border-red-400" : "border-gray-300"}`}
              />
              {errores.fechaFin && <p className="text-red-500 text-xs mt-1">{errores.fechaFin}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className={`w-full border px-3 py-2 rounded mt-1 ${errores.horaInicio ? "border-red-400" : "border-gray-300"}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora Fin</label>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className={`w-full border px-3 py-2 rounded mt-1 ${errores.horaFin ? "border-red-400" : "border-gray-300"}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duración del Turno (minutos)</label>
            <input
              type="number"
              value={duracionTurno}
              onChange={(e) => setDuracionTurno(Number(e.target.value))}
              className={`w-full border px-3 py-2 rounded mt-1 ${errores.duracionTurno ? "border-red-400" : "border-gray-300"}`}
            />
            {errores.duracionTurno && <p className="text-red-500 text-xs mt-1">{errores.duracionTurno}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5b709c] hover:bg-[#475882] text-white rounded-lg"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}