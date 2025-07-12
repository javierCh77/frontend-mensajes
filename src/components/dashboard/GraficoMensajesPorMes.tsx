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
  data: { mes: string; cantidad: number }[];
}

export default function GraficoMensajesPorMes({ data }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(52, 211, 153, 0.4)");
    gradient.addColorStop(1, "rgba(52, 211, 153, 0)");

    const newChartData = {
      labels: data.map((e) => e.mes),
      datasets: [
        {
          label: "Mensajes por mes",
          data: data.map((e) => e.cantidad),
          borderColor: "#34d399",
          backgroundColor: gradient,
          pointBackgroundColor: "#34d399",
          tension: 0.3,
          fill: true,
        },
      ],
    };

    setChartData(newChartData);
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            const index = context.dataIndex;
            const actual = context.dataset.data[index];
            const anterior = index > 0 ? context.dataset.data[index - 1] : null;

            let cambio = "";
            if (anterior !== null && anterior !== 0) {
              const variacion = ((actual - anterior) / anterior) * 100;
              const simbolo = variacion >= 0 ? "↑" : "↓";
              cambio = ` (${simbolo} ${Math.abs(variacion).toFixed(1)}%)`;
            }

            return `📨 ${actual} mensajes${cambio}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <h3 className="font-semibold text-sm mb-2">📆 Evolución Mensual de Mensajes</h3>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Gráfico */}
       

        {/* Tabla lateral */}
        <div className="w-full md:w-1/5 overflow-auto text-xs">
       
          <table className="w-full border border-gray-200 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">Mes</th>
                <th className="px-2 py-1">Cant.</th>
                <th className="px-2 py-1">Var.</th>
              </tr>
            </thead>
            <tbody>
              {data.map((mes, i) => {
                const anterior = i > 0 ? data[i - 1].cantidad : null;
                const variacion =
                  anterior && anterior !== 0
                    ? ((mes.cantidad - anterior) / anterior) * 100
                    : null;
                const simbolo = variacion !== null ? (variacion >= 0 ? "↑" : "↓") : "-";

                return (
                  <tr key={mes.mes} className="border-t">
                    <td className="px-2 py-1">{mes.mes}</td>
                    <td className="px-2 py-1">{mes.cantidad}</td>
                    <td className="px-2 py-1">
                      {variacion !== null ? (
                        <span className={variacion >= 0 ? "text-green-600" : "text-red-500"}>
                          {simbolo} {Math.abs(variacion).toFixed(1)}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full md:w-4/5 h-[320px]">
          {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
      </div>
    </div>
  );
}
