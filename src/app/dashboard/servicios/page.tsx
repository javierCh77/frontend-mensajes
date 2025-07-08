"use client";

import { useState, useEffect } from "react";
import { BriefcaseMedical } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Servicio, ServicioInput } from "@/types/servicio";
import { EditarServicioModal } from "@/components/dashboard/servicios/EditarServicioModal";
import { ServicioModal } from "@/components/dashboard/servicios/ServicioModal";
import { TablaServicios } from "@/components/dashboard/servicios/TablaServicios";
import { ServicioToolbar } from "@/components/dashboard/servicios/ServicioToolbar";

export default function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [errores, setErrores] = useState<
    Partial<Record<keyof ServicioInput, string>>
  >({});
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formData, setFormData] = useState<ServicioInput>({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    fetchServicios();
  }, []);

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
    if (!formData.descripcion.trim())
      errs.descripcion = "La descripción es obligatoria";
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
    if (!formData.descripcion.trim())
      errs.descripcion = "La descripción es obligatoria";
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
      toast.error(
        "No se pudo eliminar el servicio. Puede estar vinculado a un médico."
      );
    }
  };

  const serviciosFiltrados = servicios.filter((s) =>
    `${s.nombre} ${s.descripcion}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-2">
      <div className="flex items-center gap-2 text-[#022c1f]">
        <BriefcaseMedical color="#10b985" />
        <h2 className="text-2xl font-bold">Servicios</h2>
      </div>

      <ServicioToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNuevoServicioClick={() => setModalCrearOpen(true)}
      />

      <TablaServicios
        servicios={serviciosFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
