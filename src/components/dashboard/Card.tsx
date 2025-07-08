import {
  CalendarDays,
  MessageSquareText,
  Inbox,
  Bot,
  Clock3,
  Timer,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const icons = {
  "Total Mensajes": <MessageSquareText className="text-indigo-500 w-6 h-6" />,
  "Recibidos Hoy": <Inbox className="text-blue-500 w-6 h-6" />,
  "Respuestas IA": <Bot className="text-purple-500 w-6 h-6" />,
  "Tiempo P. de Respuesta": <Clock3 className="text-yellow-500 w-6 h-6" />,
  "Éxito Respuestas IA": <TrendingUp className="text-green-500 w-6 h-6" />,
  "Mensajes Pendientes": <Timer className="text-red-500 w-6 h-6" />,
};

export default function Card({
  title,
  value,
  trend,
}: {
  title: string;
  value: string | number | null | undefined;
  trend?: number;
}) {
  // Log para debugging
  console.log("Rendering Card:", { title, value });

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
          </div>

          <div className="flex items-center justify-between mt-1">
            {/* Ícono (o fallback) */}
            {icons[title as keyof typeof icons] ?? (
              <CalendarDays className="text-gray-400 w-6 h-6" />
            )}
            {/* Valor (con fallback visual) */}
            <p className="text-2xl font-semibold text-gray-500">
              {value ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
