// components/LineChart.tsx
"use client";

import { Line } from "react-chartjs-2";
import { Activity } from "lucide-react";

export function LineChart({ title, labels, data }: { title: string; labels: string[]; data: number[] }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 w-full mb-2">
        <Activity className="text-indigo-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
      </div>
      <div className="w-full max-w-[500px] h-[300px]">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: title,
                data,
                fill: false,
                borderColor: "#4F46E5",
                tension: 0.3,
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