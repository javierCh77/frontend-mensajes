/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

import { BarChart } from "@/components/dashboard/BarChart";
import { LineChart } from "@/components/dashboard/LineChart";
import { PieChart } from "@/components/dashboard/PieChart";
import Card from "@/components/dashboard/Card";
import UltimosTurnosCard from "@/components/dashboard/UltimosTurnosCard";
import TopProfesionalesCard from "@/components/dashboard/TopProfesionalesCard";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data.json");
      const json = await res.json();
      setStats(json);
    };
    fetchData();
  }, []);

  if (!stats)
    return <p className="text-center mt-10 text-gray-500">Cargando datos...</p>;

  return (
    <div className="p-4 space-y-6 h-[calc(100vh-80px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 break-words">
        Dashboard Gerencial
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total de Turnos Hoy" value={stats.turnosHoy} trend={15} />
        <Card title="Pacientes Nuevos" value={stats.pacientesNuevos} trend={-5} />

        <Card
          title="Obras Sociales Activas"
          value={stats.obrasSocialesActivas}
          trend={1}
        />
        <Card
          title="Profesionales en Servicio"
          value={stats.profesionalesActivos}
          trend={20}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3  gap-4 ">
        <BarChart
          title="Turnos por Servicio"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          labels={stats.turnosPorServicio.map((s: any) => s.servicio)}
          data={stats.turnosPorServicio.map((s: any) => s.cantidad)}
        />
        <LineChart
          title="Turnos por Día"
          labels={stats.turnosPorDia.map((d: any) =>
            new Date(d.fecha).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
            })
          )}
          data={stats.turnosPorDia.map((d: any) => d.cantidad)}
        />
        <PieChart
          title="Obra Social más Utilizada"
          labels={[stats.obraSocialMasUsada.nombre, "Otras"]}
          data={[
            stats.obraSocialMasUsada.cantidad,
            100 - stats.obraSocialMasUsada.cantidad,
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UltimosTurnosCard turnos={stats.ultimosTurnos} />
        <TopProfesionalesCard profesionales={stats.topProfesionales} />
      </div>
    </div>
  );
}
