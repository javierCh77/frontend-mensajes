"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Stethoscope, UserPlus, Link as LinkIcon } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { ProfesionalModal } from "@/components/dashboard/profesionales/ProfesionalModal";
import { EditarProfesionalModal } from "@/components/dashboard/profesionales/EditarProfesionalModal";

interface Servicio {
  id: string;
  nombre: string;
}

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

interface Profesional {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  matricula: string;
  servicio: Servicio;
  user?: Usuario;
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

export default function ProfesionalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [errores, setErrores] = useState<Partial<Record<keyof ProfesionalInput, string>>>({});
  const [asignandoUsuarioId, setAsignandoUsuarioId] = useState<string | null>(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<string | null>(null);

  const [nuevoProfesional, setNuevoProfesional] = useState<ProfesionalInput>({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    matricula: "",
    servicioId: "",
  });

  useEffect(() => {
    fetchProfesionales();
    fetchServicios();
  }, []);

  useEffect(() => {
    if (profesionales.length > 0) fetchUsuarios();
  }, [profesionales]);

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
      toast.error("No se pudieron cargar los servicios");
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await api.get("/users");
      const usados = new Set(profesionales.map((p) => p.user?.id).filter(Boolean));
      const disponibles = res.data.filter((u: Usuario) => u.rol === "prestador" && !usados.has(u.id));
      setUsuarios(disponibles);
    } catch {
      toast.error("No se pudieron cargar los usuarios disponibles");
    }
  };

  const handleCreateProfesional = async () => {
    const nuevosErrores: typeof errores = {};
    if (!nuevoProfesional.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!nuevoProfesional.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
    if (!nuevoProfesional.dni.trim()) nuevosErrores.dni = "El DNI es obligatorio";
    if (!nuevoProfesional.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!nuevoProfesional.email.trim()) nuevosErrores.email = "El email es obligatorio";
    if (!nuevoProfesional.matricula.trim()) nuevosErrores.matricula = "La matrícula es obligatoria";
    if (!nuevoProfesional.servicioId.trim()) nuevosErrores.servicioId = "Debe seleccionar un servicio";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await api.post("/profesional", nuevoProfesional);
      toast.success("Profesional creado correctamente");
      resetModal();
      fetchProfesionales();
    } catch {
      toast.error("Ocurrió un error al guardar el profesional");
    }
  };

  const handleUpdateProfesional = async () => {
    if (!editId) return;
    const nuevosErrores: typeof errores = {};
    if (!nuevoProfesional.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!nuevoProfesional.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
    if (!nuevoProfesional.dni.trim()) nuevosErrores.dni = "El DNI es obligatorio";
    if (!nuevoProfesional.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!nuevoProfesional.email.trim()) nuevosErrores.email = "El email es obligatorio";
    if (!nuevoProfesional.matricula.trim()) nuevosErrores.matricula = "La matrícula es obligatoria";
    if (!nuevoProfesional.servicioId.trim()) nuevosErrores.servicioId = "Debe seleccionar un servicio";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await api.patch(`/profesional/${editId}`, nuevoProfesional);
      toast.success("Profesional actualizado correctamente");
      resetModal();
      fetchProfesionales();
    } catch {
      toast.error("Error al actualizar el profesional");
    }
  };

  const handleAsignarUsuario = async () => {
    if (!profesionalSeleccionado || !asignandoUsuarioId) return;
    try {
      await api.patch(`/profesional/${profesionalSeleccionado}`, { userId: asignandoUsuarioId });
      toast.success("Usuario asignado correctamente");
      setAsignandoUsuarioId(null);
      setProfesionalSeleccionado(null);
      fetchProfesionales();
    } catch {
      toast.error("Error al asignar usuario");
    }
  };

  const resetModal = () => {
    setNuevoProfesional({
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      email: "",
      matricula: "",
      servicioId: "",
    });
    setErrores({});
    setModalOpen(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (p: Profesional) => {
    setNuevoProfesional({
      nombre: p.nombre,
      apellido: p.apellido,
      dni: p.dni,
      telefono: p.telefono,
      email: p.email,
      matricula: p.matricula,
      servicioId: p.servicio.id,
    });
    setIsEditing(true);
    setEditId(p.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/profesional/${id}`);
      toast.success("Profesional eliminado");
      fetchProfesionales();
    } catch {
      toast.error("No se pudo eliminar el profesional");
    }
  };

  const profesionalesFiltrados = profesionales.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dni}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Stethoscope />
        <h2 className="text-2xl font-bold">Profesionales</h2>
      </div>

      <div className="flex items-center justify-between py-4">
        <input
          type="text"
          placeholder="Buscar profesional..."
          className="border px-3 py-1 rounded w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 bg-[#5b709c] hover:bg-[#475882] text-white px-4 py-1 rounded-lg flex items-center gap-2"
          onClick={() => {
            resetModal();
            setModalOpen(true);
          }}
        >
          <UserPlus size={18} /> Nuevo Prestador
        </button>
      </div>

      <div className="overflow-x-auto h-[72vh] rounded-lg shadow-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#2f374d] text-white text-sm">
            <tr>
              <th className="px-6 py-2">Nombre</th>
              <th className="px-6 py-2">Apellido</th>
              <th className="px-6 py-2">DNI</th>
              <th className="px-6 py-2">Teléfono</th>
              <th className="px-6 py-2">Email</th>
              <th className="px-6 py-2">Matrícula</th>
              <th className="px-6 py-2">Servicio</th>
              <th className="px-6 py-2">Usuario</th>
              <th className="px-6 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {profesionalesFiltrados.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-2">{p.nombre}</td>
                <td className="px-6 py-2">{p.apellido}</td>
                <td className="px-6 py-2">{p.dni}</td>
                <td className="px-6 py-2">{p.telefono}</td>
                <td className="px-6 py-2">{p.email}</td>
                <td className="px-6 py-2">{p.matricula.toUpperCase()}</td>
                <td className="px-6 py-2 font-bold">{p.servicio?.nombre ?? '-'}</td>
                <td className="px-6 py-2">
                  {p.user ? (
                    <span className="text-sm text-gray-700">{p.user.nombre} {p.user.apellido}</span>
                  ) : (
                    <button
                      onClick={() => setProfesionalSeleccionado(p.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <LinkIcon size={18} />
                    </button>
                  )}
                </td>
                <td className="px-6 py-2 flex justify-center gap-4">
                  <button onClick={() => handleEdit(p)} className="text-[#3a476a]">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProfesionalModal
        open={modalOpen}
        isEditing={false}
        errores={errores}
        servicios={servicios}
        nuevoProfesional={nuevoProfesional}
        setNuevoProfesional={setNuevoProfesional}
        onClose={resetModal}
        onSubmit={handleCreateProfesional}
      />

      <EditarProfesionalModal
        open={isEditing}
        profesionalId={editId}
        datos={nuevoProfesional}
        errores={errores}
        servicios={servicios}
        setDatos={setNuevoProfesional}
        onClose={resetModal}
        onUpdate={handleUpdateProfesional}
      />

      {profesionalSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Asignar Usuario</h3>
            <select
              className="border p-2 rounded w-full mb-4"
              value={asignandoUsuarioId || ""}
              onChange={(e) => setAsignandoUsuarioId(e.target.value)}
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} ({u.email})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setProfesionalSeleccionado(null)} className="bg-gray-300 px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={handleAsignarUsuario} className="bg-blue-600 text-white px-4 py-2 rounded">
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
