// components/dashboard/TopProfesionalesCard.tsx
"use client";

import { Users } from "lucide-react";
import { motion } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TopProfesionalesCard({ profesionales }: { profesionales: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-2xl shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="text-indigo-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-700">Top Profesionales por Consultas</h3>
      </div>
      <ul className="text-sm text-gray-600 space-y-2">
        {profesionales.map((prof, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="flex justify-between border-b pb-2 border-gray-300"
          >
            <span className="font-medium text-gray-800">{prof.nombre}</span>
            <span className="font-semibold text-indigo-600">{prof.consultas}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}