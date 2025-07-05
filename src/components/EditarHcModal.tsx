// EditarHcModal.tsx
import React, { useState, useEffect } from 'react';

interface EditarHcModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteDni?: string;
  hcItem?: HistoriaClinicaDental;
  onSave: (updatedHc: HistoriaClinicaDental) => void;
}

interface HistoriaClinicaDental {
  id: number;
  fechaHora: Date;
  profesional: string;
  numeroDiente?: string;
  diagnostico?: string;
  trabajoRealizado?: string;
}

const EditarHcModal: React.FC<EditarHcModalProps> = ({ isOpen, onClose, pacienteDni, hcItem, onSave }) => {
  const [numeroDiente, setNumeroDiente] = useState<string>(hcItem?.numeroDiente || '');
  const [diagnostico, setDiagnostico] = useState<string>(hcItem?.diagnostico || '');
  const [trabajoRealizado, setTrabajoRealizado] = useState<string>(hcItem?.trabajoRealizado || '');

  useEffect(() => {
    if (hcItem) {
      setNumeroDiente(hcItem.numeroDiente || '');
      setDiagnostico(hcItem.diagnostico || '');
      setTrabajoRealizado(hcItem.trabajoRealizado || '');
    } else {
      setNumeroDiente('');
      setDiagnostico('');
      setTrabajoRealizado('');
    }
  }, [hcItem]);

  const handleGuardar = () => {
    if (hcItem) {
      onSave({ ...hcItem, numeroDiente, diagnostico, trabajoRealizado });
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Historia Clínica</h2>
        {pacienteDni && <p className="mb-2">DNI Paciente: {pacienteDni}</p>}
        <div className="mb-4">
          <label htmlFor="numeroDiente" className="block text-gray-700 text-sm font-bold mb-2">Número Diente:</label>
          <input
            type="text"
            id="numeroDiente"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={numeroDiente}
            onChange={(e) => setNumeroDiente(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="diagnostico" className="block text-gray-700 text-sm font-bold mb-2">Diagnóstico:</label>
          <textarea
            id="diagnostico"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="trabajoRealizado" className="block text-gray-700 text-sm font-bold mb-2">Trabajo Realizado:</label>
          <textarea
            id="trabajoRealizado"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={trabajoRealizado}
            onChange={(e) => setTrabajoRealizado(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg">
            Cancelar
          </button>
          <button onClick={handleGuardar} className="px-4 py-2 bg-[#5b709c] hover:bg-[#475882] text-white rounded-lg">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarHcModal;