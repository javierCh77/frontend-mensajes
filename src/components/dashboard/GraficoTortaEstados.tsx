"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

interface Estado {
  estado: string;
  cantidad: number;
  actualizado: string;
}

interface Props {
  data: Estado[];
}

const colores = {
  pendiente: "#facc15",   // amarillo
  asignado: "#60a5fa",    // azul
  respondido: "#34d399",  // verde
  cerrado: "#a78bfa",     // violeta
};

export default function GraficoTortaEstados({ data }: Props) {
  const chartData = {
    labels: data.map((e) => e.estado),
    datasets: [
      {
        label: "Cantidad",
        data: data.map((e) => e.cantidad),
        backgroundColor: data.map((e) => colores[e.estado.toLowerCase() as keyof typeof colores]),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full flex flex-col gap-3">
      {/* Título arriba a la derecha */}
      <div className="w-full flex justify-start pr-4">
        <h3 className="font-semibold text-sm text-gray-700">🥧 Estados de los Mensajes</h3>
      </div>

      {/* Contenido: gráfica + tabla */}
      <div className="flex flex-col md:flex-row items-center md:items-center justify-around   h-full">
        {/* Gráfico */}
        <div className="w-[280px] h-[280px]">
          <Pie data={chartData} options={chartOptions} />
        </div>

        {/* Tabla */}
        <div className="w-full md:w-1/2 overflow-x-auto">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">📄 Detalle por Estado</h4>
          <table className="text-xs w-full border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left">Estado</th>
                <th className="py-2 px-3 text-left">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {data.map((estado) => (
                <tr key={estado.estado} className="border-t border-gray-100">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          colores[estado.estado.toLowerCase() as keyof typeof colores],
                      }}
                    />
                    {estado.estado}
                  </td>
                  <td className="py-2 px-3">{estado.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
