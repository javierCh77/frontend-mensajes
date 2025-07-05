// components/PieChart.tsx
"use client";

import { Pie } from "react-chartjs-2";
import { PieChart as PieIcon } from "lucide-react";

export function PieChart({ title, labels, data }: { title: string; labels: string[]; data: number[] }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 w-full mb-2">
        <PieIcon className="text-indigo-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
      </div>
      <div className="w-full max-w-[350px] h-[300px] ">
        <Pie
          data={{
            labels,
            datasets: [
              {
                label: title,
                data,
                backgroundColor: ["#4F46E5", "#CBD5E1"],
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
              title: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
}