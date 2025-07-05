"use client";

import React, { useState, useEffect, useRef } from "react";
import EditarHcModal from "../../../components/EditarHcModal";
import EstadisticasPaciente from "./ui/estadisticas";
import HistoriaClinica from "./ui/HistoriaClinica";
import api from "@/lib/api";
import { FileText, Search, User } from "lucide-react";

// ===============================
// Interfaces
// ===============================

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
}

interface HistoriaClinicaDental {
  id: number;
  pacienteId: string;
  fechaHora: Date;
  profesional: string;
  numeroDiente?: string;
  diagnostico?: string;
  trabajoRealizado?: string;
  
  
}

// ===============================
// Historia clínica del paciente
// ===============================

const HistoriaClinicaPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Paciente[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("resumen");
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<Paciente | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [historialDental, setHistorialDental] = useState<HistoriaClinicaDental[]>(
    []
  );
  const [isEditarModalOpen, setIsEditarModalOpen] = useState<boolean>(false);
  const [hcItemAEditar, setHcItemAEditar] =
    useState<HistoriaClinicaDental | null>(null);

  // =======================
  // Obtener pacientes desde el backend
  // =======================
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setPacienteSeleccionado(null);
      setActiveResultIndex(-1);
      setHistorialDental([]);
      return;
    }

    const fetchPacientes = async () => {
      try {
        const response = await api.get(
          `/pacientes?searchTerm=${encodeURIComponent(
            searchTerm
          )}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error al buscar pacientes:", error);
        setSearchResults([]);
      }
    };

    fetchPacientes();
  }, [searchTerm]);

  // =======================
  // Manejo de los pacientes seleccionados
  // =======================
  const handleSelectPaciente = (paciente: Paciente) => {
    setSelectedPacienteId(paciente.id);
    setPacienteSeleccionado(paciente);
    setSearchResults([]);
    setSearchTerm(paciente.nombre);
    setActiveResultIndex(-1);
  };

  // =======================
  // Manejo de pestañas
  // =======================
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // =======================
  // Manejo de edición de historia clínica
  // =======================
  const handleEditarHc = (hcItem: HistoriaClinicaDental) => {
    setHcItemAEditar(hcItem);
    setIsEditarModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsEditarModalOpen(false);
    setHcItemAEditar(null);
  };

  const handleGuardarEdicionHc = (updatedHc: HistoriaClinicaDental) => {
    console.log("Historia clínica actualizada (simulado):", updatedHc);
    setHistorialDental((prevHistorial) =>
      prevHistorial.map((item) => (item.id === updatedHc.id ? updatedHc : item))
    );
    handleCerrarModal();
  };

  // =======================
  // Buscar y manejar resultados de búsqueda
  // =======================
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length > 0) {
      if (event.key === "ArrowDown") {
        setActiveResultIndex((prevIndex) =>
          prevIndex < searchResults.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (event.key === "ArrowUp") {
        setActiveResultIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : -1
        );
      } else if (event.key === "Enter" && activeResultIndex !== -1) {
        handleSelectPaciente(searchResults[activeResultIndex]);
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // =======================
  // Mostrar información del paciente
  // =======================
  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-4">
        <FileText />
        <h2 className="text-2xl font-bold">Historia Clínica</h2>
      </div>

      {/* Campo de búsqueda */}
      <div className="mb-6 flex items-center rounded-md shadow-sm">
        <div className="relative flex-grow focus-within:shadow-outline-blue transition duration-150 ease-in-out">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="form-input block w-full pl-10 pr-3 py-2 leading-5 transition duration-150 ease-in-out rounded-md border border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          {searchResults.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              {searchResults.map((paciente, index) => (
                <li
                  key={paciente.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === activeResultIndex ? "bg-[#e0f2fe]" : ""
                  }`}
                  onClick={() => handleSelectPaciente(paciente)}
                >
                  {paciente.nombre} {paciente.apellido} - {paciente.dni}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {pacienteSeleccionado ? (
        <>
          {/* Sección de pestañas */}
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              <li className="mr-2">
                <button
                  onClick={() => handleTabClick("resumen")}
                  className={`inline-flex items-center p-4 rounded-t-lg border-b-2 ${
                    activeTab === "resumen"
                      ? "border-[#5b709c] text-[#5b709c]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white dark:border-transparent dark:hover:border-gray-300"
                  }`}
                >
                  <User className="mr-2 w-4 h-4" />
                  Resumen
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => handleTabClick("historiasClinicas")}
                  className={`inline-flex items-center p-4 rounded-t-lg border-b-2 ${
                    activeTab === "historiasClinicas"
                      ? "border-[#5b709c] text-[#5b709c]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white dark:border-transparent dark:hover:border-gray-300"
                  }`}
                >
                  <FileText className="mr-2 w-4 h-4" />
                  Historias Clínicas
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => handleTabClick("estadisticas")}
                  className={`inline-flex items-center p-4 rounded-t-lg border-b-2 ${
                    activeTab === "estadisticas"
                      ? "border-[#5b709c] text-[#5b709c]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white dark:border-transparent dark:hover:border-gray-300"
                  }`}
                >
                  <svg
                    className="mr-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0-10V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2zm9 10v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2zM18 9v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2z"
                    ></path>
                  </svg>
                  Estadísticas
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            {activeTab === "resumen" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Resumen del Paciente</h3>
                <p>Nombre: {pacienteSeleccionado?.nombre}</p>
                <p>DNI: {pacienteSeleccionado?.dni}</p>
                <p>ID: {pacienteSeleccionado?.id}</p>
                {/* Más información del paciente */}
                <button className="px-4 py-2 bg-[#5b709c] hover:bg-[#475882] text-white rounded-lg mt-4">
                  Editar Información del Paciente
                </button>
              </div>
            )}

            {activeTab === "historiasClinicas" && (
              <HistoriaClinica
              pacienteId={pacienteSeleccionado?.id} // Asegúrate de que 'pacienteSeleccionado' no sea null
              onEditarHc={handleEditarHc}
            />
            )}

            {activeTab === "estadisticas" && pacienteSeleccionado && (
              <EstadisticasPaciente historialDental={historialDental} />
            )}
          </div>

          <EditarHcModal
            isOpen={isEditarModalOpen}
            onClose={handleCerrarModal}
            pacienteDni={pacienteSeleccionado?.dni}
            hcItem={hcItemAEditar}
            onSave={handleGuardarEdicionHc}
          />
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Busca un paciente para ver su historia clínica.</p>
        </div>
      )}
    </div>
  );
};

export default HistoriaClinicaPage;
