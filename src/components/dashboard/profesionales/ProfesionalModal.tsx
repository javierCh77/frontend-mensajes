import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";

interface Servicio {
  id: string;
  nombre: string;
}

interface ProfesionalInput {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  matricula: string;
  servicioId: string;
}

interface Props {
  open: boolean;
  isEditing: boolean;
  errores: Partial<Record<keyof ProfesionalInput, string>>;
  servicios: Servicio[];
  nuevoProfesional: ProfesionalInput;
  setNuevoProfesional: (data: ProfesionalInput) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const ProfesionalModal = ({
  open,
  isEditing,
  errores,
  servicios,
  nuevoProfesional,
  setNuevoProfesional,
  onClose,
  onSubmit,
}: Props) => {
  const nombreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => nombreInputRef.current?.focus(), 100);
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoProfesional({ ...nuevoProfesional, [name]: value });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-[#f7f9fc] p-6 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="text-[#1F5D89]" />
          <h2 className="text-xl font-semibold text-[#1F5D89]">
            {isEditing ? "Editar Profesional" : "Nuevo Profesional"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "nombre", label: "Nombre" },
            { name: "apellido", label: "Apellido" },
            { name: "dni", label: "DNI" },
            { name: "telefono", label: "Teléfono" },
            { name: "email", label: "Email" },
            { name: "matricula", label: "Matrícula" },
          ].map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                name={name}
                ref={name === "nombre" ? nombreInputRef : undefined}
                type={name === "email" ? "email" : "text"}
                value={(nuevoProfesional as any)[name]}
                onChange={handleChange}
                className={`p-2 rounded-md border outline-none transition-all focus:ring-2 focus:ring-[#5b709c] ${
                  errores[name as keyof ProfesionalInput] ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errores[name as keyof ProfesionalInput] && (
                <span className="text-red-500 text-xs mt-1">
                  {errores[name as keyof ProfesionalInput]}
                </span>
              )}
            </div>
          ))}

          <div className="flex flex-col md:col-span-2">
            <label htmlFor="servicioId" className="text-sm font-medium text-gray-700 mb-1">
              Servicio
            </label>
            <select
              id="servicioId"
              name="servicioId"
              value={nuevoProfesional.servicioId}
              onChange={handleChange}
              className={`p-2 rounded-md border outline-none focus:ring-2 focus:ring-[#5b709c] ${
                errores.servicioId ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
            {errores.servicioId && (
              <span className="text-red-500 text-xs mt-1">
                {errores.servicioId}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-all text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-[#5b709c] hover:bg-[#475882] text-white rounded-md transition-all"
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
