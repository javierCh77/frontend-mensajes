/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { addMinutes } from "date-fns";
import { Calendar } from "lucide-react";
import api from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { ModalHistoriaClinica } from "./components/ModalHistoriaClinica";

interface Turno {
  id: string;
  fecha: string;
  estado: string;
  motivoConsulta: string | null;
  cronograma: {
    duracionTurno: number;
    horaInicio: string;
    horaFin: string;
  };
  paciente: {
    nombre: string;
    apellido: string;
  };
}

export default function GrillaProfesionalPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [profesionalId, setProfesionalId] = useState<string>("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("20:00");
  const [cronogramaDuracion, setCronogramaDuracion] = useState(30);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);

  useEffect(() => {
    const obtenerProfesional = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded: any = jwtDecode(token);
      console.log("Token decodificado:", decoded);
      if (decoded.rol === "prestador") {
        const userId = decoded.sub || decoded.userId || decoded.id;
        try {
          const res = await api.get(`/profesional/by-user/${userId}`);
          if (res.data?.id) {
            setProfesionalId(res.data.id);
            console.log("User ID del token:", userId);

          }
        } catch (err) {
          console.error("Error al obtener profesional", err);
        }
      }
    };

    obtenerProfesional();
  }, []);

  useEffect(() => {
    if (!profesionalId) return;

    const fetchTurnos = async () => {
      try {
        const res = await api.get(`/turno/profesional/${profesionalId}`);
        const data = res.data;
console.log("Turnos recibidos:", data);

        if (data.length > 0 && data[0].cronograma) {
          const { horaInicio, horaFin, duracionTurno } = data[0].cronograma;
          setHoraInicio(new Date(horaInicio).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }));
          setHoraFin(new Date(horaFin).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }));
          setCronogramaDuracion(duracionTurno || 30);
        }

        setTurnos(data);
      } catch (err) {
        console.error("Error al cargar turnos", err);
      }
    };

    fetchTurnos();
  }, [profesionalId]);

  const eventos = turnos.map((t) => {
    const inicio = new Date(t.fecha);
    const duracion = t.cronograma?.duracionTurno || cronogramaDuracion;
    const fin = addMinutes(inicio, duracion);

    let color = "#4ade80";
    if (t.estado === "pendiente") color = "#fde68a";
    if (t.estado === "cancelado") color = "#fca5a5";
    if (t.estado === "atendido") color = "#60a5fa";

    return {
      id: t.id,
      title: `${t.paciente.nombre} ${t.paciente.apellido}`,
      start: inicio,
      end: fin,
      backgroundColor: color,
      borderColor: color,
    };
  });

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar />
        <h2 className="text-2xl font-bold">Mi Agenda Semanal</h2>
      </div>

      <div className="flex gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#4ade80] border" />
          <span className="text-sm">Confirmado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#fde68a] border" />
          <span className="text-sm">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#fca5a5] border" />
          <span className="text-sm">Cancelado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#60a5fa] border" />
          <span className="text-sm">Atendido</span>
        </div>
      </div>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={esLocale}
        allDaySlot={false}
        editable={false}
        slotMinTime={horaInicio}
        slotMaxTime={horaFin}
        slotDuration={`00:${cronogramaDuracion.toString().padStart(2, "0")}:00`}
        businessHours={{
          startTime: horaInicio,
          endTime: horaFin,
          daysOfWeek: [1, 2, 3, 4, 5],
        }}
        eventClick={(info) => {
          const turno = turnos.find((t) => t.id === info.event.id);
          if (turno) setTurnoSeleccionado(turno);
        }}
        events={eventos}
        height="auto"
      />

      <ModalHistoriaClinica
        turno={turnoSeleccionado}
        onClose={() => setTurnoSeleccionado(null)}
        onGuardado={(updatedTurno) => {
          setTurnos((prev) =>
            prev.map((t) => (t.id === updatedTurno.id ? updatedTurno : t))
          );
          setTurnoSeleccionado(null);
        }}
      />
    </div>
  );
}