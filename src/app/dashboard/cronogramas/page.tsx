// ✅ CronogramaPage.tsx
"use client";

import { useState, useEffect } from "react";
import { CalendarPlus } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import CronogramaTable from "../../../components/dashboard/cronograma/CronogramaTable";
import CronogramaModal from "../../../components/dashboard/cronograma/CronogramaModal";

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
  diaSemana: string;
}

export default function CronogramaPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([]);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const res = await api.get("/profesional");
        setProfesionales(res.data);
      } catch (err) {
        console.error("Error al obtener profesionales:", err);
      }
    };
    fetchProfesionales();
  }, []);

  useEffect(() => {
    const fetchCronogramas = async () => {
      try {
        const res = await api.get("/cronograma");
        setCronogramas(res.data);
      } catch (err) {
        console.error("Error al obtener cronogramas:", err);
      }
    };
    fetchCronogramas();
  }, []);

  const handleDelete = async (cronogramaId: string) => {
    const turnos = await api.get(`/turno/cronograma/${cronogramaId}`);
    if (turnos.data.length > 0) {
      alert("No se puede borrar el cronograma porque ya tiene turnos asignados.");
    } else {
      try {
        await api.delete(`/cronograma/${cronogramaId}`);
        setCronogramas(cronogramas.filter((c) => c.id !== cronogramaId));
        toast.success("Cronograma eliminado correctamente");
      } catch (error) {
        toast.error("Ocurrió un error al eliminar el Cronograma");
        console.log(error)
      }
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <CalendarPlus />
        <h2 className="text-2xl font-bold">Cronogramas</h2>
      </div>

      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-4">
          <label>Profesional:</label>
          <select
            value={profesionalSeleccionado}
            onChange={(e) => setProfesionalSeleccionado(e.target.value)}
            className="border px-4 py-1 rounded-lg"
          >
            <option value="">Seleccionar Profesional</option>
            {profesionales.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nombre} {prof.apellido}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={!profesionalSeleccionado}
          className={`ml-4 px-4 py-1 rounded-lg flex items-center gap-2 
            ${!profesionalSeleccionado
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#5b709c] hover:bg-[#475882] text-white cursor-pointer"}`}
        >
          <CalendarPlus size={18} />
          Crear cronograma
        </button>
      </div>

      <CronogramaTable
        cronogramas={cronogramas}
        profesionalId={profesionalSeleccionado}
        onDelete={handleDelete}
        onEdit={() => setModalOpen(true)}
      />

      <CronogramaModal
        open={modalOpen}
        profesionalId={profesionalSeleccionado}
        onClose={() => setModalOpen(false)}
        onSuccess={async () => {
          setModalOpen(false);
          const res = await api.get("/cronograma");
          setCronogramas(res.data);
        }}
      />
    </div>
  );
}