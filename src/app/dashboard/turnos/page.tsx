"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { addDays, addMinutes, format, startOfWeek } from "date-fns";
import { Calendar } from "lucide-react";
import api from "@/lib/api";
import { ModalActualizarTurno } from "./components/ModalActualizarTurno";
import { ModalTurno } from "./components/ModalTurno";
import { LeyendaTurnos } from "./components/LeyendaTurnos";
import { SelectProfesional } from "./components/SelectProfesional";
import toast from "react-hot-toast";
import { Profesional, Turno, Paciente } from "./types"; 
////////////////////////////////////////////////////////////////////////////
export default function TurnosPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<string>("");
  const [cronogramaIdSeleccionado, setCronogramaIdSeleccionado] = useState<string>("");
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteBuscado, setPacienteBuscado] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<string>("08:00");
  const [horaFin, setHoraFin] = useState<string>("20:00");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [slotsDisponibles, setSlotsDisponibles] = useState<any[]>([]);
  const [turnoSeleccionadoParaEstado, setTurnoSeleccionadoParaEstado] = useState<Turno | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>("pendiente");
  const [cronogramaDuracion, setCronogramaDuracion] = useState<number>(30);
  const [cronogramaFechaInicio, setCronogramaFechaInicio] = useState<Date | null>(null);
  const [cronogramaFechaFin, setCronogramaFechaFin] = useState<Date | null>( null);
  const [diasHabilitados, setDiasHabilitados] = useState<number[]>([]);
//////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await api.get("/pacientes");
        setPacientes(res.data);
      } catch (err) {
        console.error("Error al cargar pacientes", err);
      }
    };
    const fetchProfesionales = async () => {
      try {
        const res = await api.get("/profesional/con-cronograma");
        setProfesionales(res.data);
      } catch (err) {
        console.error("Error al cargar profesionales con cronograma", err);
      }
    };
    fetchPacientes();
    fetchProfesionales();
  }, []);

  const handleSeleccionProfesional = async (profesionalId: string) => {
    setProfesionalSeleccionado(profesionalId);

    try {
      const resCronograma = await api.get(
        `/cronograma/profesional/${profesionalId}`
      );
      if (resCronograma.data.length > 0) {
        const cronogramas = resCronograma.data;
        const primerCronograma = cronogramas[0];
        setCronogramaIdSeleccionado(primerCronograma.id);
        setCronogramaDuracion(primerCronograma.duracionTurno || 30);
        setCronogramaFechaInicio(new Date(primerCronograma.fechaInicio));
        setCronogramaFechaFin(new Date(primerCronograma.fechaFin));
        const horaI = new Date(primerCronograma.horaInicio).toLocaleTimeString( "es-AR",{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        );
        const horaF = new Date(primerCronograma.horaFin).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        );
        setHoraInicio(horaI);
        setHoraFin(horaF);

        const semanaInicio = startOfWeek(new Date(), { weekStartsOn: 1 });
        const duracion = primerCronograma.duracionTurno || 30;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nuevosSlots: any[] = [];
        const dias: number[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cronogramas.forEach((c: any) => {
          const dia = c.diaSemana;
          dias.push(dia);
          const fechaDia = addDays(semanaInicio, dia - 1);
          let hora = new Date(`${format(fechaDia, "yyyy-MM-dd")}T${horaI}`);
          const fin = new Date(`${format(fechaDia, "yyyy-MM-dd")}T${horaF}`);

          while (hora < fin) {
            nuevosSlots.push({
              id: `slot-${hora.toISOString()}`,
              title: `Disponible - ${format(hora, "HH:mm")}`,
              start: new Date(hora),
              end: addMinutes(new Date(hora), duracion),
              backgroundColor: "#e0f2fe",
              borderColor: "#0284c7", // azul más fuerte
              display: "background",
            });
            hora = addMinutes(hora, duracion);
          }
        });

        setSlotsDisponibles(nuevosSlots);
        setDiasHabilitados(dias);
      } else {
        toast.error("Este profesional no tiene cronogramas disponibles");
        setCronogramaIdSeleccionado("");
        setDiasHabilitados([]);
      }
      const resTurnos = await api.get(`/turno/profesional/${profesionalId}`);
      setTurnos(resTurnos.data);
    } catch (err) {
      console.error("Error al seleccionar profesional", err);
      setCronogramaIdSeleccionado("");
      setTurnos([]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar />
        <h2 className="text-2xl font-bold">Turnos</h2>
      </div>
      <SelectProfesional profesionales={profesionales} seleccionado={profesionalSeleccionado} onChange={handleSeleccionProfesional}/>
      <LeyendaTurnos />
      <div className="bg-white p-2 rounded-xl shadow-lg text-center" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {profesionalSeleccionado && (
          <h1 className="text-2xl font-semibold mb-2 text-gray-600"> Turnos de Dra.{" "} {profesionales.find((p) => p.id === profesionalSeleccionado)?.apellido}</h1>
        )}
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          allDaySlot={false}
          editable={true}
          slotMinTime={horaInicio}
          slotMaxTime={horaFin}
          dateClick={(info) => {
            const fechaClic = new Date(info.date);
            if (
              !cronogramaFechaInicio ||
              !cronogramaFechaFin ||
              !cronogramaIdSeleccionado
            ) {
              toast.error("Seleccioná un profesional con cronograma válido");
              return;
            }
            const diaSemana = fechaClic.getDay() === 0 ? 7 : fechaClic.getDay(); // 0=domingo
            if (!diasHabilitados.includes(diaSemana)) {
              toast.error("Este día no está habilitado para turnos");
              return;
            }
            if (
              fechaClic < cronogramaFechaInicio ||
              fechaClic > cronogramaFechaFin
            ) {
              toast.error("La fecha está fuera del rango del cronograma");
              return;
            }
            setFechaSeleccionada(fechaClic);
            setModalOpen(true);
          }}
          slotDuration={`00:${cronogramaDuracion .toString().padStart(2, "0")}:00`}
          businessHours={{startTime: horaInicio, endTime: horaFin, daysOfWeek: diasHabilitados,}}
          events={[...slotsDisponibles, ...turnos.map((t) => {
              const inicio = new Date(t.fecha);
              const fin = addMinutes(inicio, cronogramaDuracion);
              let color = "#4ade80";
              let textColor = "#ffffff";
              if (t.estado === "pendiente") {color = "#fde68a"; textColor = "#6d6d6d"; }
              if (t.estado === "cancelado") {color = "#fca5a5"; textColor = "#ffffff"; }
              return {
                id: t.id,
                title: `${t.paciente.nombre} ${t.paciente.apellido} - ${ t.motivoConsulta || "" }`,
                start: inicio,
                end: fin,
                backgroundColor: color,
                borderColor: color,
                textColor: textColor,
                extendedProps: {estado: t.estado,paciente: t.paciente, motivoConsulta: t.motivoConsulta, fecha: t.fecha,},
              };
            }),
          ]}
          eventClick={(info) => {
            const turno = turnos.find((t) => t.id === info.event.id);
            if (turno) {setTurnoSeleccionadoParaEstado(turno); setNuevoEstado(turno.estado); }
          }}
          height="auto"
          eventDidMount={(info) => {const { paciente, motivoConsulta, estado, fecha } = info.event.extendedProps;
            const nombre = paciente?.nombre || "Sin nombre";
            const apellido = paciente?.apellido || "";
            const motivo = motivoConsulta || "Sin motivo";
            const fechaStr = fecha ? new Date(fecha).toLocaleString("es-AR") : "Sin fecha";
            const estadoStr = estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "Sin estado";
            const tooltip = `🧑 ${nombre} ${apellido}📝 ${motivo}📅 ${fechaStr}🔖 ${estadoStr} `.trim();
            info.el.setAttribute("title", tooltip);
          }}
        />
      </div>
      <ModalTurno
        open={modalOpen}
        pacientes={pacientes}
        fechaSeleccionada={fechaSeleccionada}
        pacienteBuscado={pacienteBuscado}
        setPacienteBuscado={setPacienteBuscado}
        pacienteSeleccionado={pacienteSeleccionado}
        setPacienteSeleccionado={setPacienteSeleccionado}
        motivoConsulta={motivoConsulta}
        setMotivoConsulta={setMotivoConsulta}
        onClose={() => setModalOpen(false)}
        onConfirm={async () => {
          if (!pacienteSeleccionado ||!fechaSeleccionada ||!cronogramaIdSeleccionado)
            return;
          try {
            await api.post("/turno", {
              fecha: fechaSeleccionada.toISOString(),
              pacienteId: pacienteSeleccionado.id,
              cronogramaId: cronogramaIdSeleccionado,
              motivoConsulta,
            });
            toast.success("Turno asignado correctamente");
            setModalOpen(false);
            const res = await api.get( `/turno/profesional/${profesionalSeleccionado}`);
            setTurnos(res.data);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            toast.error(
              err.response?.data?.message || "Error al asignar turno"
            );
          }
        }}
      />
      <ModalActualizarTurno
        turno={turnoSeleccionadoParaEstado}
        nuevoEstado={nuevoEstado}
        setNuevoEstado={setNuevoEstado}
        pacientes={pacientes}
        pacienteBuscado={pacienteBuscado}
        setPacienteBuscado={setPacienteBuscado}
        pacienteSeleccionado={pacienteSeleccionado}
        setPacienteSeleccionado={setPacienteSeleccionado}
        onClose={() => setTurnoSeleccionadoParaEstado(null)}
        onConfirm={async () => {
          if (!turnoSeleccionadoParaEstado) return;
          try {
            await api.put(`/turno/${turnoSeleccionadoParaEstado.id}`, {
              estado: nuevoEstado,
              pacienteId: pacienteSeleccionado?.id,
            });
            toast.success("Turno actualizado correctamente");
            const res = await api.get(`/turno/profesional/${profesionalSeleccionado}`);
            setTurnos(res.data);
            setTurnoSeleccionadoParaEstado(null);
          } catch (err) {
            toast.error("Error al actualizar turno");
            console.log(err)
          }
        }}
      />
    </div>
  );
}
