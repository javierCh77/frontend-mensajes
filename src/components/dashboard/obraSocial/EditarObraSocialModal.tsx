// Archivo: EditarObraSocialModal.tsx

"use client";

import { useState, useEffect } from "react";
import { HeartPulse } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface ObraSocial {
  id: string;
  codigo: string;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  obra: ObraSocial;
  onSuccess: () => void;
}

export default function EditarObraSocialModal({ open, onClose, obra, onSuccess }: Props) {
  const [form, setForm] = useState<Omit<ObraSocial, "id">>({
    codigo: "",
    nombre: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  const [errores, setErrores] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => {
    if (obra) {
      const { id, ...rest } = obra;
      setForm(rest);
    }
  }, [obra]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "codigo" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async () => {
    const nuevosErrores: typeof errores = {};
    if (!form.codigo.trim()) nuevosErrores.codigo = "El código es obligatorio";
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!form.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
    if (!form.email.trim()) nuevosErrores.email = "El email es obligatorio";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await api.patch(`/obra-social/${obra.id}`, form);
      toast.success("Obra social actualizada correctamente");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al actualizar obra social:", error);
      toast.error("No se pudo actualizar la obra social");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[#ffffff] p-6 rounded-xl shadow-lg w-full max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse className="text-[#5b709c]" />
          <h2 className="text-lg font-semibold">Editar Obra Social</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[ 
            ["codigo", "Código", "Ej. OSDE"],
            ["nombre", "Nombre", "Ej. OSDE Salud"],
            ["telefono", "Teléfono", "Ej. 0800-555-1234"],
            ["direccion", "Dirección", "Ej. Av. Córdoba 1234"],
            ["email", "Email", "Ej. contacto@osde.com.ar"]
          ].map(([key, label, placeholder]) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={key}
                name={key}
                type={key === "email" ? "email" : "text"}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={handleChange}
                className={`border p-2 rounded bg-white ${
                  errores[key as keyof typeof errores] ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errores[key as keyof typeof errores] && (
                <p className="text-red-500 text-xs mt-1">{errores[key as keyof typeof errores]}</p>
              )}
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
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}