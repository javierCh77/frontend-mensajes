// components/dashboard/UltimosTurnosCard.tsx
"use client";

import { CalendarClock } from "lucide-react";
import { motion } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UltimosTurnosCard({ turnos }: { turnos: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-2xl shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarClock className="text-indigo-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-700">Últimos Turnos Registrados</h3>
      </div>
      <ul className="text-sm text-gray-600 space-y-2">
        {turnos.map((turno, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="border-b pb-2 border-gray-300"
          >
            <div className="font-medium text-gray-800">{turno.paciente}</div>
            <div className="text-xs flex items-center justify-between">
              {turno.fecha} - {turno.hora}{" "}
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-[10px] uppercase">
                {turno.servicio}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}