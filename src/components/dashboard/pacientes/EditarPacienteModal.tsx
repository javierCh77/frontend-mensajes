// Archivo: EditarPacienteModal.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Contact } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  telefono: string;
  direccion: string;
  email: string;
  obraSocial?: {
    id: string;
    codigo: string;
    nombre: string;
  };
}

type PacienteInput = Omit<Paciente, "id" | "obraSocial">;

interface ObraSocial {
  id: string;
  nombre: string;
  codigo: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  paciente: Paciente;
  onUpdated: () => void;
  obraSociales: ObraSocial[];
}

export default function EditarPacienteModal({ open, onClose, paciente, onUpdated, obraSociales }: Props) {
  const [form, setForm] = useState<PacienteInput>({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    telefono: "",
    direccion: "",
    email: "",
  });
  const [obraSocialId, setObraSocialId] = useState<string | null>(null);
  const [errores, setErrores] = useState<Partial<Record<keyof PacienteInput | "obraSocialId", string>>>({});

  const nombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  if (open && paciente) {
    setForm({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      dni: paciente.dni,
      telefono: paciente.telefono,
      direccion: paciente.direccion,
      email: paciente.email,
      fechaNacimiento: paciente.fechaNacimiento?.split("T")[0] ?? "",
    });
    setObraSocialId(paciente.obraSocial?.id ?? null);
    setTimeout(() => nombreRef.current?.focus(), 100);
  }
}, [open, paciente]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async () => {
  const nuevosErrores: typeof errores = {};

  if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
  if (!form.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
  if (!form.dni.trim()) nuevosErrores.dni = "El DNI es obligatorio";
  if (!form.fechaNacimiento) nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria";
  if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
  if (!form.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
  if (!form.email.trim()) nuevosErrores.email = "El email es obligatorio";

  setErrores(nuevosErrores);
  if (Object.keys(nuevosErrores).length > 0) return;

  try {
    const payload = {
      ...form,
      fechaNacimiento: new Date(form.fechaNacimiento).toISOString(),
      obraSocialId,
    };

    console.log("Payload enviado al backend:", payload); // <-- Agregado

    await api.patch(`/pacientes/${paciente.id}`, payload);

    toast.success("Paciente actualizado correctamente");
    onUpdated();
    onClose();
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    toast.error("No se pudo actualizar el paciente");
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[#ffffff] p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-4">
          <Contact className="text-[#5b709c]" />
          <h2 className="text-lg font-semibold">Editar Paciente</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["nombre", "apellido", "dni", "fechaNacimiento", "telefono", "direccion", "email"].map((campo) => (
            <div key={campo} className="flex flex-col">
              <label htmlFor={campo} className="text-sm font-medium text-gray-700 capitalize">
                {campo === "fechaNacimiento" ? "Fecha de nacimiento" : campo}
              </label>
              <input
                id={campo}
                name={campo}
                type={campo === "fechaNacimiento" ? "date" : campo === "email" ? "email" : "text"}
                ref={campo === "nombre" ? nombreRef : undefined}
                value={form[campo as keyof PacienteInput]}
                onChange={handleChange}
                className={`border p-2 rounded bg-white ${errores[campo as keyof PacienteInput] ? "border-red-300" : "border-gray-300"}`}
              />
              {errores[campo as keyof PacienteInput] && (
                <p className="text-red-500 text-xs mt-1">{errores[campo as keyof PacienteInput]}</p>
              )}
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="obraSocialId" className="text-sm font-medium text-gray-700">Obra Social</label>
            <select
              id="obraSocialId"
              value={obraSocialId ?? ""}
              onChange={(e) => setObraSocialId(e.target.value || null)}
              className={`border p-2 rounded bg-white ${errores.obraSocialId ? "border-red-300" : "border-gray-300"}`}
            >
              <option value="">Sin obra social</option>
              {obraSociales.map((obra) => (
                <option key={obra.id} value={obra.id}>{obra.nombre}</option>
              ))}
            </select>
            {errores.obraSocialId && (
              <p className="text-red-500 text-xs mt-1">{errores.obraSocialId}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#5b709c] hover:bg-[#475882] text-white rounded-lg"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}