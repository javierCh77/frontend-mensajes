"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: { hora: string; cantidad: number }[];
}

export default function GraficoMensajesPorHora({ data }: Props) {
  const cantidades = data.map((e) => e.cantidad);
  const maxCantidad = Math.max(...cantidades);

  const backgroundColors = cantidades.map((cantidad) =>
    cantidad === maxCantidad ? "#6ee7c1" : "#06b6d4"
  );
  // color naranja para el pico más alto, celeste para el resto

  const chartData = {
    labels: data.map((e) => e.hora),
    datasets: [
      {
        label: "Mensajes",
        data: cantidades,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full  flex flex-col">
      <h3 className="font-semibold text-sm mb-2">🕘 Distribución Horaria de Mensajes</h3>
      <Bar data={chartData} />
    </div>
  );
}
