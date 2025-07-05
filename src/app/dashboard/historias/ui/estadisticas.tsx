'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, eachDayOfInterval, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RegistroClinico {
  id: string;
  fecha: Date;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string | null;
  diente: string;
}

// Datos estáticos simulando registros de atenciones
const registrosEjemplo: RegistroClinico[] = [
  {
    id: '1',
    fecha: parseISO('2025-05-03'),
    motivoConsulta: 'Dolor',
    diagnostico: 'Caries',
    tratamiento: 'Obturación',
    observaciones: null,
    diente: '16',
  },
  {
    id: '2',
    fecha: parseISO('2025-05-10'),
    motivoConsulta: 'Control',
    diagnostico: 'Normal',
    tratamiento: 'Ninguno',
    observaciones: null,
    diente: '11',
  },
  {
    id: '3',
    fecha: parseISO('2025-05-10'),
    motivoConsulta: 'Urgencia',
    diagnostico: 'Infección',
    tratamiento: 'Antibióticos',
    observaciones: 'Revisar en una semana',
    diente: '36',
  },
];

const EstadisticasPaciente = () => {
  const [mesActual, setMesActual] = useState(new Date());
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState<any>({});

  const generateChartData = useCallback(() => {
    const startOfMonth = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
    const endOfMonth = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
    const daysInMonth = eachDayOfInterval({ start: startOfMonth, end: endOfMonth });

    const labels = daysInMonth.map(day => format(day, 'dd', { locale: es }));

    const registrosDelMes = registrosEjemplo.filter(reg => isSameMonth(reg.fecha, mesActual));

    const atencionesPorDia = registrosDelMes.reduce((acc, reg) => {
      const day = format(reg.fecha, 'dd', { locale: es });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dataValues = labels.map(day => atencionesPorDia[day] || 0);
    const hasAtenciones = dataValues.some(value => value > 0);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Número de Atenciones',
          data: dataValues,
          backgroundColor: hasAtenciones
            ? daysInMonth.map(day => {
                const dayStr = format(day, 'dd', { locale: es });
                return atencionesPorDia[dayStr]
                  ? 'rgba(91, 112, 156, 0.7)'
                  : 'rgba(153, 153, 153, 0.3)';
              })
            : 'rgba(91, 112, 156, 0.7)',
          borderColor: hasAtenciones
            ? daysInMonth.map(day => {
                const dayStr = format(day, 'dd', { locale: es });
                return atencionesPorDia[dayStr]
                  ? 'rgba(91, 112, 156, 1)'
                  : 'rgba(153, 153, 153, 0.5)';
              })
            : 'rgba(91, 112, 156, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Atenciones en ${format(mesActual, 'MMMM yyyy', { locale: es })}`,
          font: { size: 16 },
        },
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            title: (context: any) => {
              const dayIndex = context[0].dataIndex;
              return `Día ${labels[dayIndex]}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
          title: {
            display: true,
            text: 'Número de Atenciones',
            font: { size: 12 },
          },
        },
        x: {
          title: {
            display: true,
            text: 'Día',
            font: { size: 12 },
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [mesActual]);

  useEffect(() => {
    generateChartData();
  }, [generateChartData]);

  const cambiarMes = (delta: number) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() + delta);
    setMesActual(nuevoMes);
  };

  return (
    <div className="relative h-[60vh] rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Estadísticas de Atenciones</h3>
        <div className="space-x-2">
          <button onClick={() => cambiarMes(-1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">← Mes anterior</button>
          <button onClick={() => cambiarMes(1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Mes siguiente →</button>
        </div>
      </div>

      <div className="h-full">
        <Bar data={chartData} options={chartOptions} className="h-full w-full" />
      </div>
    </div>
  );
};

export default EstadisticasPaciente;
