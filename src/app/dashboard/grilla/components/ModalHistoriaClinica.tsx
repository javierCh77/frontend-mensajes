import React, { useState } from "react";
import { Turno } from "../../types";
import api from "@/lib/api";

interface Props {
  turno: Turno | null;
  onClose: () => void;
  onGuardado: (turnoActualizado: Turno) => void;
}

export const ModalHistoriaClinica = ({ turno, onClose, onGuardado }: Props) => {
  const [motivoConsulta, setMotivoConsulta] = useState(turno?.motivoConsulta || "");
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [diente, setDiente] = useState("");
  const [cargando, setCargando] = useState(false);

  if (!turno) return null;

  const handleGuardar = async () => {
    try {
      setCargando(true);
      const historiaRes = await api.get(`/historia-clinica/paciente/${turno.paciente.id}`);
      const historiaClinicaId = historiaRes.data.id;

      await api.post("/registro-clinico", {
        fecha: new Date().toISOString(),
        diagnostico,
        motivoConsulta,
        tratamiento,
        diente,
        historiaClinicaId,
      });

      const turnoActualizado = await api.put(`/turno/${turno.id}`, { estado: "atendido" });
      onGuardado(turnoActualizado.data);
    } catch (error) {
      alert("Error al guardar el registro clínico");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Registrar atención</h3>
        <p className="mb-2">
          <strong>Paciente:</strong> {turno.paciente.nombre} {turno.paciente.apellido}<br />
          <strong>Fecha:</strong> {new Date(turno.fecha).toLocaleString()}
        </p>

        <input
          type="text"
          placeholder="Motivo de consulta"
          className="w-full border rounded p-2 mb-2"
          value={motivoConsulta}
          onChange={(e) => setMotivoConsulta(e.target.value)}
        />
        <input
          type="text"
          placeholder="Diagnóstico"
          className="w-full border rounded p-2 mb-2"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tratamiento"
          className="w-full border rounded p-2 mb-2"
          value={tratamiento}
          onChange={(e) => setTratamiento(e.target.value)}
        />
        <input
          type="text"
          placeholder="Diente (ej. 18)"
          className="w-full border rounded p-2 mb-4"
          value={diente}
          onChange={(e) => setDiente(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose} disabled={cargando}>
            Cancelar
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleGuardar}
            disabled={cargando || !diagnostico || !tratamiento || !diente}
          >
            {cargando ? "Guardando..." : "Guardar y marcar atendido"}
          </button>
        </div>
      </div>
    </div>
  );
};