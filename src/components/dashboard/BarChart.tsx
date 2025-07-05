// components/BarChart.tsx
"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from "chart.js";
import { BarChart3 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

export function BarChart({ title, labels, data }: { title: string; labels: string[]; data: number[] }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 w-full mb-2">
        <BarChart3 className="text-indigo-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
      </div>
      <div className="w-full max-w-[500px] h-[300px]">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: title,
                data,
                backgroundColor: "#4F46E5",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
          }}
        />
      </div>
    </div>
  );
}
