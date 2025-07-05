"use client";

import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

interface Profesional {
  id: string;
  nombre: string;
  apellido: string;
}

interface Cronograma {
  id: string;
  profesional: Profesional;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  duracionTurno: number;
  diaSemana:string;
}

interface Props {
  cronogramas: Cronograma[];
  profesionalId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CronogramaTable({cronogramas, profesionalId, onEdit, onDelete,}: Props) {
  
  
  const cronogramasFiltrados = cronogramas.filter(
    (c) => c.profesional.id === profesionalId
  );
  
  const nombreDiaSemana = (numero: string) => {
  const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  return dias[parseInt(numero, 10)] || "Desconocido";
};

  
  

  return (
    <div className="overflow-x-auto h-[70vh] bg-gray-100 rounded-lg shadow-md">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-2 py-2">Profesional</th>
            <th className="px-2 py-2">Dia</th>
            <th className="px-2 py-2">Fecha de Inicio</th>
            <th className="px-2 py-2">Fecha de Fin</th>
            <th className="px-2 py-2">Hora Inicio</th>
            <th className="px-2 py-2">Hora Fin</th>
            <th className="px-2 py-2">Duración Turno</th>
            <th className="px-2 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {cronogramasFiltrados.map((cronograma) => (
            <tr key={cronograma.id}>
              <td className="text-center">
                {cronograma.profesional.nombre} {cronograma.profesional.apellido}
              </td>
              <td className="text-center">
                {nombreDiaSemana(cronograma.diaSemana)}
              </td>
              <td className="text-center">
                {format(new Date(cronograma.fechaInicio), "dd/MM/yyyy")}
              </td>
              <td className="text-center">
                {format(new Date(cronograma.fechaFin), "dd/MM/yyyy")}
              </td>
              <td className="text-center">
                {cronograma.horaInicio.split("T")[1].slice(0, 5)}
              </td>
              <td className="text-center">
                {cronograma.horaFin.split("T")[1].slice(0, 5)}
              </td>
              <td className="text-center">{cronograma.duracionTurno} min</td>
              <td className="px-6 py-2 text-xs text-gray-700 flex gap-4">
                <button
                  onClick={() => onEdit(cronograma.id)}
                  className="text-[#3a476a] hover:underline cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(cronograma.id)}
                  className="text-red-400 hover:underline cursor-pointer"
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
