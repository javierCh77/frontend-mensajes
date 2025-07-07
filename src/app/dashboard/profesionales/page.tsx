"use client";

import { useState, useEffect } from "react";
import { BookUser } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Profesional, ProfesionalInput } from "@/types/profesional";
import { Servicio } from "@/types/servicio";
import { ProfesionalModal } from "@/components/dashboard/profesionales/ProfesionalModal";
import { TablaProfesionales } from "@/components/dashboard/profesionales/TablaProfesionales";
import { ServicioToolbar } from "@/components/dashboard/servicios/ServicioToolbar";
import { ProfesionalToolbar } from "@/components/dashboard/profesionales/ProfesionalToolbar";

export default function ProfesionalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [errores, setErrores] = useState<
    Partial<Record<keyof ProfesionalInput, string>>
  >({});
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formData, setFormData] = useState<ProfesionalInput>({
    nombre: "",
    apellido: "",
    dni: "",
    matricula: "",
    servicioId: "",
  });

  useEffect(() => {
    fetchProfesionales();
    fetchServicios();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const res = await api.get("/profesional");
      setProfesionales(res.data);
    } catch {
      toast.error("No se pudieron cargar los profesionales");
    }
  };

  const fetchServicios = async () => {
    try {
      const res = await api.get("/servicio");
      setServicios(res.data);
    } catch {
      toast.error("Error al cargar servicios");
    }
  };

  const handleCreateOrUpdate = async () => {
    const errs: typeof errores = {};
    if (!formData.nombre) errs.nombre = "Nombre requerido";
    if (!formData.apellido) errs.apellido = "Apellido requerido";
    if (!formData.dni) errs.dni = "DNI requerido";
    if (!formData.matricula) errs.matricula = "Matrícula requerida";
    if (!formData.servicioId) errs.servicioId = "Servicio requerido";
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (editId) {
        await api.patch(`/profesional/${editId}`, formData);
        toast.success("Profesional actualizado");
      } else {
        await api.post("/profesional", formData);
        toast.success("Profesional creado");
      }
      resetModal();
      fetchProfesionales();
    } catch {
      toast.error("Error al guardar profesional");
    }
  };

  const resetModal = () => {
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      matricula: "",
      servicioId: "",
    });
    setErrores({});
    setModalOpen(false);
    setEditId(null);
  };

  const handleEdit = (p: Profesional) => {
    setFormData({
      nombre: p.nombre,
      apellido: p.apellido,
      dni: p.dni,
      matricula: p.matricula,
      servicioId: p.servicio.id,
    });
    setEditId(p.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar profesional?")) return;
    try {
      await api.delete(`/profesional/${id}`);
      fetchProfesionales();
      toast.success("Eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  const filtrados = profesionales.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dni} ${p.servicio?.nombre || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-[#022c1f]">
        <BookUser color="#10b985" />
        <h2 className="text-2xl font-bold">Profesionales</h2>
      </div>

      <ProfesionalToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNuevoClick={() => setModalOpen(true)}
      />

      <TablaProfesionales
        profesionales={filtrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProfesionalModal
        open={modalOpen}
        datos={formData}
        errores={errores}
        servicios={servicios}
        setDatos={setFormData}
        onClose={resetModal}
        onSubmit={handleCreateOrUpdate}
        editando={!!editId}
      />
    </div>
  );
}
