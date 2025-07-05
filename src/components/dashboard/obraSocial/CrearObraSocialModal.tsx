"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { HeartPulse } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ObraSocialInput {
  codigo: string;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
}

export default function CrearObraSocialModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<ObraSocialInput>({
    codigo: "",
    nombre: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  const [errores, setErrores] = useState<Partial<Record<keyof ObraSocialInput, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "codigo" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async () => {
    const nuevosErrores: Partial<Record<keyof ObraSocialInput, string>> = {};

    if (!form.codigo.trim()) nuevosErrores.codigo = "El código es obligatorio";
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!form.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
    if (!form.email.trim()) nuevosErrores.email = "El email es obligatorio";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await api.post("/obra-social", form);
      toast.success("Obra social creada correctamente");
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("La obra social ya existe");
      } else {
        toast.error("Error al crear obra social");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#ffffff] p-6 rounded-xl shadow-lg w-full max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse className="text-[#5b709c]" />
          <h2 className="text-lg font-semibold">Nueva Obra Social</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {([
            ["codigo", "Código", "Ej. OSDE"],
            ["nombre", "Nombre", "Ej. OSDE Salud"],
            ["telefono", "Teléfono", "Ej. 0800-555-1234"],
            ["direccion", "Dirección", "Ej. Av. Córdoba 1234"],
            ["email", "Email", "Ej. contacto@osde.com.ar"],
          ] as const).map(([key, label, placeholder]) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={key}
                name={key}
                type="text"
                placeholder={placeholder}
                value={form[key]}
                onChange={handleChange}
                className={`border p-2 rounded bg-white ${
                  errores[key] ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errores[key] && <p className="text-red-500 text-xs mt-1">{errores[key]}</p>}
            </div>
          ))}
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
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
