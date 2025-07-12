"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

interface Props {
  data: { fecha: string; cantidad: number }[];
}

export default function GraficoEvolucionMensajes({ data }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.4)"); // celeste
    gradient.addColorStop(1, "rgba(6, 182, 212, 0)");

    setChartData({
      labels: data.map((item) => item.fecha),
      datasets: [
        {
          label: "Mensajes Recibidos",
          data: data.map((item) => item.cantidad),
          borderColor: "#06b6d4",
          backgroundColor: gradient,
          pointBackgroundColor: "#06b6d4",
          tension: 0.3,
          fill: true,
        },
      ],
    });
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow w-full">
      <h3 className="font-semibold mb-2 text-sm">
        📈 Evolución de Mensajes (últimos 7 días)
      </h3>
      <div className="w-full h-[45vh]">
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
}
