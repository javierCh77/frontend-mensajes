'use client'

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "@/lib/api";
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
}

interface HistoriaClinicaDental {
  id: string;
  pacienteId: string;
  fechaHora?: Date;
  profesional: string;
  numeroDiente?: string;
  diagnostico?: string;
  trabajoRealizado?: string;
  paciente?: Paciente; // <- Importante: incluye los datos del paciente
}

interface RegistroClinico {
  id: string;
  fecha: Date;
  diagnostico: string;
  motivoConsulta: string;
  tratamiento: string;
  diente: string;
}

interface HistoriaClinicaProps {
  pacienteId: string;
  onEditarHc: (hcItem: HistoriaClinicaDental) => void;
}

const HistoriaClinica: React.FC<HistoriaClinicaProps> = ({ pacienteId }) => {
  const [registrosClinicos, setRegistrosClinicos] = useState<RegistroClinico[]>([]);
  const [historiaClinicaExistente, setHistoriaClinicaExistente] = useState<HistoriaClinicaDental | null>(null);

  useEffect(() => {
    if (!pacienteId) {
      console.error("Error: pacienteId es undefined");
      return;
    }

    const fetchHistoriaClinica = async () => {
      try {
        const response = await api.get(`/historia-clinica/paciente/${pacienteId}`);
        if (response.data && response.data.length > 0) {
          const historia = response.data[0];
          setHistoriaClinicaExistente(historia);
          fetchRegistrosClinicos(historia.id);
        } else {
          setHistoriaClinicaExistente(null);
        }
      } catch (error) {
        console.error("Error al obtener historia clínica:", error);
      }
    };

    fetchHistoriaClinica();
  }, [pacienteId]);

  const fetchRegistrosClinicos = async (historiaClinicaId: string) => {
    try {
      const response = await api.get(`/registro-clinico/historia/${historiaClinicaId}`);
      setRegistrosClinicos(response.data);
    } catch (error) {
      console.error("Error al obtener los registros clínicos:", error);
    }
  };

  const handleCrearHistoriaClinica = async () => {
    if (!pacienteId) {
      console.error("Error: pacienteId es undefined");
      return;
    }

    const fechaInicio = new Date().toISOString().split("T")[0];

    try {
      const response = await api.post("/historia-clinica", {
        fechaInicio: fechaInicio,
        pacienteId: pacienteId,
      });

      setHistoriaClinicaExistente({
        id: uuidv4(),
        pacienteId: pacienteId,
        fechaHora: new Date(),
        profesional: "Nuevo Profesional",
        numeroDiente: "No especificado",
        diagnostico: "No especificado",
        trabajoRealizado: "No especificado",
      });
    } catch (error) {
      console.error("Error al crear historia clínica:", error.response ? error.response.data : error);
    }
  };

  const handleDescargarHistoriaClinicaPDF = () => {
    const doc = new jsPDF();
    const logoUrl = "/cmep.png";

    doc.addImage(logoUrl, 'PNG', 15, 0, 50, 40);
    const fechaHoy = format(new Date(), "dd'/'MM'/'yyyy");
    doc.setFontSize(12);
    doc.text(fechaHoy, 180, 20, { align: "right" });

    doc.setFontSize(16);
    doc.text("Historia Clínica", 20, 40);

    // Mostrar datos del paciente si existen
    if (historiaClinicaExistente?.paciente) {
      const { nombre, apellido, dni } = historiaClinicaExistente.paciente;
      doc.setFontSize(10);
      doc.text(`Nombre: ${nombre || "No disponible"}`, 20, 50);
      doc.text(`Apellido: ${apellido || "No disponible"}`, 80, 50);
      doc.text(`DNI: ${dni || "No disponible"}`, 150, 50);
    } else {
      doc.setFontSize(10);
      doc.text(`Nombre: No disponible`, 20, 50);
      doc.text(`Apellido: No disponible`, 80, 50);
      doc.text(`DNI: No disponible`, 150, 50);
    }

    doc.setLineWidth(0.5);
    doc.line(20, 55, 180, 55);

    doc.setLineWidth(0.5);
    doc.line(20, 72, 200, 72);

    const tableStartY = 70;
    doc.setFontSize(8);
    doc.text("Registros Clínicos:", 20, tableStartY - 10);

    let yPosition = tableStartY;
    doc.text("Fecha", 20, yPosition);
    doc.text("Motivo Consulta", 60, yPosition);
    doc.text("Diagnóstico", 120, yPosition);
    doc.text("Tratamiento", 160, yPosition);
    yPosition += 10;

    registrosClinicos.forEach((registro) => {
      doc.text(format(new Date(registro.fecha), "dd'/'MM'/'yyyy"), 20, yPosition);
      doc.text(registro.motivoConsulta, 60, yPosition);
      doc.text(registro.diagnostico, 120, yPosition);
      doc.text(registro.tratamiento, 160, yPosition);
      yPosition += 10;
    });

    doc.save("historia-clinica.pdf");
  };

  return (
    <div className="bg-[#eaecf4] rounded-lg shadow-md p-2 h-[60vh]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Historias Clínicas</h3>
        {registrosClinicos.length > 0 && (
          <button
            onClick={handleDescargarHistoriaClinicaPDF}
            className="px-4 py-1 bg-[#5b709c] hover:bg-[#475882] text-white rounded-lg cursor-pointer"
          >
            Descargar Historia Clínica
          </button>
        )}
      </div>

      {registrosClinicos.length > 0 ? (
        <div className="overflow-y-auto h-[51vh]">
          <table className="min-w-full leading-normal rounded-lg">
            <thead className="bg-[#2f374d] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">Profesional</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">Número Diente</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">Motivo Consulta</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">Diagnóstico</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">Tratamiento</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {registrosClinicos.map((registro) => (
                <tr key={registro.id} className="bg-[#f3f4f6] hover:bg-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">{format(new Date(registro.fecha), "dd'/'MM'/'yyyy")}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">javier</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{registro.diente}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{registro.motivoConsulta}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{registro.diagnostico}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{registro.tratamiento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : historiaClinicaExistente ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Este paciente no tiene registros clínicos registrados.</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Este paciente no tiene historia clínica registrada.</p>
          <button
            onClick={handleCrearHistoriaClinica}
            className="px-4 py-2 bg-[#5b709c] hover:bg-[#475882] text-white rounded-lg mt-4"
          >
            Crear Historia Clínica
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoriaClinica;
