"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/dashboard/Card";
import UltimosMensajesCard from "@/components/dashboard/UlimosMensajesCard";
import GraficoEvolucionMensajes from "@/components/dashboard/GraficoEvolucionMensajes";
import GraficoRecibidosVsRespondidos from "@/components/dashboard/GraficoRecibidosVsRespondidos";
import GraficoMensajesPorHora from "@/components/dashboard/GraficoMensajesPorHora";
import GraficoTortaEstados from "@/components/dashboard/GraficoTortaEstados";
import GraficoMensajesPorMes from "@/components/dashboard/GraficoMensajesPorMes";
import api from "@/lib/api"; // ✅ Importás Axios configurado

export default function DashboardMensajesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/resumen");
        console.log("📊 Datos del backend:", res.data); // 👈 Revisá esto en consola
        
        setStats(res.data);
        
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      }
    };
    fetchData();
  }, []);

  if (!stats)
    return <p className="text-center mt-10 text-gray-500">Cargando datos...</p>;

  return (
    <div className="px-2 space-y-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-foreground mb-1">
        Bienvenido al Panel Gerencial
      </h2>
      <p className="text-sm text-muted mb-4">
        📅 Resumen mensajería del día{" "}
        {new Date().toLocaleDateString("es-AR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card title="Total Mensajes" value={stats.mensajesHoy} />
        <Card title="Recibidos Hoy" value={stats.mensajesHoy} />
        <Card title="Respuestas IA" value={stats.respuestasIA} />
        <Card title="Tiempo Respuesta" value={stats.tiempoPromedioRespuesta} />
        <Card title="Éxito Respuestas IA" value={`${stats.porcentajeExitoIA}%`} />
        <Card title="Mensajes Pendientes" value={stats.mensajesPendientes} />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <GraficoEvolucionMensajes data={stats.mensajesUltimos7Dias} />
        <GraficoRecibidosVsRespondidos data={stats.mensajesPorEstadoUltimos7Dias} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
        <GraficoMensajesPorHora data={stats.mensajesPorHora || []} />
        </div>
        <div className="flex justify-center">
          <GraficoTortaEstados data={stats.estadosDetalle} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full">
        <GraficoMensajesPorMes data={stats.mensajesPorMes} />
      </div>

      {/* Últimos mensajes */}
      <UltimosMensajesCard mensajes={stats.ultimosMensajes.slice(0, 5)} />
    </div>
  );
}
