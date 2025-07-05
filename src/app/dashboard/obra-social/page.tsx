// Archivo: ObraSocialPage.tsx

"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, HeartPulse, PlusCircle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import CrearObraSocialModal from "@/components/dashboard/obraSocial/CrearObraSocialModal";
import EditarObraSocialModal from "@/components/dashboard/obraSocial/EditarObraSocialModal";

export interface ObraSocial {
  id: string;
  codigo: string;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
}

export type ObraSocialInput = Omit<ObraSocial, "id">;

export default function ObraSocialPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState<ObraSocial | null>(null);

  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);

  useEffect(() => {
    fetchObrasSociales();
  }, []);

  const fetchObrasSociales = async () => {
    try {
      const res = await api.get("/obra-social");
      setObrasSociales(res.data);
    } catch (error) {
      console.error("Error al obtener obras sociales:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Estás seguro que querés eliminar esta obra social?");
    if (confirmDelete) {
      try {
        await api.delete(`/obra-social/${id}`);
        fetchObrasSociales();
        toast.success("Obra Social eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar obra social:", error);
        toast.error("Ocurrió un error al eliminar el servicio");
      }
    }
  };

  const obrasFiltradas = obrasSociales.filter((obra) =>
    `${obra.codigo} ${obra.nombre} ${obra.telefono}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <HeartPulse />
        <h2 className="text-2xl font-bold">Obras Sociales</h2>
      </div>

      <div className="flex items-center justify-between py-4">
        <input
          type="text"
          placeholder="Buscar obra social..."
          className="border px-3 py-1 rounded w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 bg-[#5b709c] hover:bg-[#475882] text-white px-4 py-1 rounded-lg flex items-center gap-2"
          onClick={() => setModalCrearOpen(true)}
        >
          <PlusCircle size={18} />
          Nueva Obra Social
        </button>
      </div>

      <div className="overflow-x-auto h-[72vh] rounded-lg shadow-md">
        <table className="min-w-full border-collapse shadow-md">
          <thead className="bg-[#2f374d] text-white text-sm">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Código</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Nombre</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Teléfono</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Dirección</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {obrasFiltradas.map((obra) => (
              <tr key={obra.id}>
                <td className="px-6 py-2 text-xs text-gray-700">{obra.codigo}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{obra.nombre}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{obra.telefono}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{obra.direccion}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{obra.email}</td>
                <td className="px-6 py-2 text-xs text-gray-700 flex gap-4">
                  <button
                    onClick={() => {
                      setObraSeleccionada(obra);
                      setModalEditarOpen(true);
                    }}
                    className="text-[#3a476a] hover:underline"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(obra.id)}
                    className="text-red-400 hover:underline"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrearObraSocialModal
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSuccess={fetchObrasSociales}
      />

      {modalEditarOpen && obraSeleccionada && (
        <EditarObraSocialModal
          open={modalEditarOpen}
          onClose={() => {
            setObraSeleccionada(null);
            setModalEditarOpen(false);
          }}
          obra={obraSeleccionada}
          onSuccess={fetchObrasSociales}
        />
      )}
    </div>
  );
}
