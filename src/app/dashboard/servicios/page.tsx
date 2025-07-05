"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, ClipboardPlus, BriefcaseMedical } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Servicio, ServicioInput } from "@/types/servicio";
import { EditarServicioModal } from "@/components/dashboard/servicios/EditarServicioModal";
import { ServicioModal } from "@/components/dashboard/servicios/ServicioModal";

export default function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [errores, setErrores] = useState<Partial<Record<keyof ServicioInput, string>>>({});
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formData, setFormData] = useState<ServicioInput>({ nombre: "", descripcion: "" });

  useEffect(() => { fetchServicios(); }, []);

  const fetchServicios = async () => {
    try {
      const res = await api.get("/servicio");
      setServicios(res.data);
    } catch {
      toast.error("No se pudieron cargar los servicios");
    }
  };

  const handleCreate = async () => {
    const errs: typeof errores = {};
    if (!formData.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!formData.descripcion.trim()) errs.descripcion = "La descripción es obligatoria";
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await api.post("/servicio", formData);
      toast.success("Servicio creado correctamente");
      resetModal();
      fetchServicios();
    } catch {
      toast.error("Ocurrió un error al crear el servicio");
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const errs: typeof errores = {};
    if (!formData.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!formData.descripcion.trim()) errs.descripcion = "La descripción es obligatoria";
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await api.patch(`/servicio/${editId}`, formData);
      toast.success("Servicio actualizado correctamente");
      resetModal();
      fetchServicios();
    } catch {
      toast.error("Error al actualizar el servicio");
    }
  };

  const resetModal = () => {
    setFormData({ nombre: "", descripcion: "" });
    setErrores({});
    setModalCrearOpen(false);
    setModalEditarOpen(false);
    setEditId(null);
  };

  const handleEdit = (s: Servicio) => {
    setFormData({ nombre: s.nombre, descripcion: s.descripcion });
    setEditId(s.id);
    setModalEditarOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro que quieres eliminar este servicio?")) return;
    try {
      await api.delete(`/servicio/${id}`);
      fetchServicios();
      toast.success("Servicio eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el servicio. Puede estar vinculado a un médico.");
    }
  };

  const serviciosFiltrados = servicios.filter((s) => `${s.nombre} ${s.descripcion}`.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <BriefcaseMedical />
        <h2 className="text-2xl font-bold">Servicios</h2>
      </div>

      <div className="flex items-center justify-between py-4">
        <input
          type="text"
          placeholder="Buscar servicio..."
          className="border px-3 py-1 rounded w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 bg-[#5b709c] hover:bg-[#475882] text-white px-4 py-1 rounded-lg flex items-center gap-2 cursor-pointer"
          onClick={() => setModalCrearOpen(true)}
        >
          <ClipboardPlus size={18} /> Nuevo Servicio
        </button>
      </div>

      <div className="overflow-x-auto h-[72vh] rounded-lg shadow-md">
        <table className="min-w-full border-collapse shadow-md">
          <thead className="bg-[#2f374d] text-white text-sm">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Nombre</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Descripción</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {serviciosFiltrados.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-6 py-2 text-xs text-gray-700">{s.nombre}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{s.descripcion}</td>
                <td className="px-8 py-2 text-xs text-gray-500 flex gap-4">
                  <button onClick={() => handleEdit(s)} className="text-[#3a476a]">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-400">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ServicioModal
        open={modalCrearOpen}
        datos={formData}
        errores={errores}
        setDatos={setFormData}
        onClose={resetModal}
        onSubmit={handleCreate}
      />

      <EditarServicioModal
        open={modalEditarOpen}
        datos={formData}
        errores={errores}
        setDatos={setFormData}
        onClose={resetModal}
        onSubmit={handleUpdate}
      />
    </div>
  );
}