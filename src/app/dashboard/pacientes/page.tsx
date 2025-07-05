// Archivo: PacientesPage.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Contact, UserRoundPlus } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import CrearPacienteModal from "@/components/dashboard/pacientes/CrearPacienteModal";
import EditarPacienteModal from "@/components/dashboard/pacientes/EditarPacienteModal";

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

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [obraSociales, setObraSociales] = useState<{ id: string; nombre: string; codigo: string }[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);

  useEffect(() => {
    fetchPacientes();
    fetchObraSociales();
  }, []);

  const fetchPacientes = async () => {
    try {
      const res = await api.get("/pacientes");
      setPacientes(res.data);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      toast.error("No se pudieron cargar los pacientes");
    }
  };

  const fetchObraSociales = async () => {
    try {
      const res = await api.get("/obra-social");
      setObraSociales(res.data);
    } catch (error) {
      console.error("Error al obtener obras sociales:", error);
      toast.error("No se pudieron cargar las obras sociales");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Estás seguro que querés eliminar este paciente?");
    if (confirmDelete) {
      try {
        await api.delete(`/pacientes/${id}`);
        fetchPacientes();
        toast.success("Paciente eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar paciente:", error);
        toast.error("Ocurrió un error al eliminar el paciente");
      }
    }
  };

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dni}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Contact />
        <h2 className="text-2xl font-bold">Pacientes</h2>
      </div>

      <div className="flex items-center justify-between py-4">
        <input
          type="text"
          placeholder="Buscar paciente..."
          className="border px-3 py-1 rounded w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 bg-[#5b709c] hover:bg-[#475882] text-white px-4 py-1 rounded-lg flex items-center gap-2 cursor-pointer"
          onClick={() => setModalCrearOpen(true)}
        >
          <UserRoundPlus size={18} />
          Alta Paciente
        </button>
      </div>

      <div className="overflow-x-auto h-[72vh] rounded-lg shadow-md">
        <table className="min-w-full border-collapse shadow-md">
          <thead className="bg-[#2f374d] text-white text-sm">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Nombre</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Apellido</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">DNI</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Nacimiento</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Obra Social</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Teléfono</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Dirección</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pacientesFiltrados.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-6 py-2 text-xs text-gray-700">{p.nombre}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{p.apellido}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{p.dni}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{formatFecha(p.fechaNacimiento)}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{p.obraSocial?.codigo ?? "-"}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{p.telefono}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{p.direccion}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{p.email}</td>
                <td className="px-6 py-2 text-xs text-gray-700 flex gap-4">
                  <button onClick={() => {
                    setPacienteSeleccionado(p);
                    setModalEditarOpen(true);
                  }} className="text-[#3a476a] hover:underline cursor-pointer">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:underline cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrearPacienteModal
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSuccess={fetchPacientes}
        obrasSociales={obraSociales}
      />

      {pacienteSeleccionado && (
        <EditarPacienteModal
          open={modalEditarOpen}
          onClose={() => {
            setPacienteSeleccionado(null);
            setModalEditarOpen(false);
          }}
          paciente={pacienteSeleccionado}
          onUpdated={fetchPacientes}
          obraSociales={obraSociales}
        />
      )}
    </div>
  );
}
