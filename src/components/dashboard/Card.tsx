import { CalendarDays, UserPlus, HeartPulse, Stethoscope } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

const icons = {
  "Total de Turnos Hoy": <CalendarDays className="text-indigo-500 w-6 h-6" />,
  "Pacientes Nuevos": <UserPlus className="text-green-500 w-6 h-6" />,
  "Obras Sociales Activas": <HeartPulse className="text-pink-500 w-6 h-6" />,
  "Profesionales en Servicio": (
    <Stethoscope className="text-yellow-500 w-6 h-6" />
  ),
};

export default function Card({
  title,
  value,
  trend,
}: {
  title: string;
  value: string | number;
  trend?: number;
}) {
  const renderTrendBadge = () => {
    if (trend === undefined) return null;

    const isPositive = trend > 0;
    const isNeutral = trend === 0;

    return (
      <span
        className={`ml-2 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
          isNeutral
            ? "text-gray-500 bg-gray-100"
            : isPositive
            ? "text-green-600 bg-green-100"
            : "text-red-600 bg-red-100"
        }`}
      >
        {isNeutral ? null : isPositive ? (
          <TrendingUp size={12} className="mr-1" />
        ) : (
          <TrendingDown size={12} className="mr-1" />
        )}
        {isNeutral ? "0%" : `${Math.abs(trend)}%`}
      </span>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">{title}</p>

            {renderTrendBadge()}
          </div>{" "}
          <div className="  rounded-full flex items-center justify-between">
            {icons[title as keyof typeof icons] || (
              <CalendarDays className="text-gray-400 w-6 h-6 " />
            )}
              <p className="text-2xl font-semibold text-gray-500 mt-1">{value}</p>
          </div>
        
        </div>
      </div>
    </div>
  );
}
