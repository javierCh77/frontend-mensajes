// components/dashboard/UltimosMensajesCard.tsx
export default function UltimosMensajesCard({ mensajes }: { mensajes: any[] }) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Últimos Mensajes</h3>
        <ul className="divide-y divide-gray-200">
          {mensajes.map((m, i) => (
            <li key={i} className="py-2">
              <p className="text-sm text-gray-800">
                <span className="font-medium">{m.nombre}</span>: {m.mensaje}
              </p>
              <p className="text-xs text-gray-400">{m.fecha}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  