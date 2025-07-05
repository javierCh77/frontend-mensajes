export const LeyendaTurnos = () => {
  return (
    <div className="flex items-center gap-4 mb-2">
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-[#4ade80] border border-gray-300" />
        <span className="text-sm text-gray-700">Confirmado</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-[#fde68a] border border-gray-300" />
        <span className="text-sm text-gray-700">Pendiente</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-[#fca5a5] border border-gray-300" />
        <span className="text-sm text-gray-700">Cancelado</span>
      </div>
    </div>
  );
};