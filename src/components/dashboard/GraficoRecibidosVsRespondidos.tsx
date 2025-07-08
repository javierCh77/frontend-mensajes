// components/dashboard/GraficoRecibidosVsRespondidos.tsx
"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  data: { fecha: string; recibidos: number; respondidos: number }[];
}

export default function GraficoRecibidosVsRespondidos({ data }: Props) {
  const chartData = {
    labels: data.map((item) => item.fecha),
    datasets: [
      {
        label: "Recibidos",
        data: data.map((item) => item.recibidos),
        backgroundColor: "#06b6d4",
      },
      {
        label: "Respondidos",
        data: data.map((item) => item.respondidos),
        backgroundColor: "#34d399",
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow w-full">
      <h3 className="font-semibold mb-2 text-sm">💬 Recibidos vs Respondidos (últimos 7 días)</h3>
      <Bar data={chartData} />
    </div>
  );
}
