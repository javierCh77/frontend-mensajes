"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Search, Trash2, UserRoundPlus, Users } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  celular: string;
  rol: string;
}

const ROLES = [
  { label: "Desarrollador", value: "desarrollador" },
  { label: "Administración", value: "administracion" },
  { label: "Prestador", value: "prestador" },
  { label: "Contabilidad", value: "contabilidad" },
  { label: "Gerencia", value: "gerencia" },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    celular: "",
    password: "",
    rol: "administracion",
  });
  const [errores, setErrores] = useState<Partial<Record<keyof typeof nuevoUsuario, string>>>({});
  const nombreInputRef = useRef<HTMLInputElement>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get("/users");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (modalOpen && nombreInputRef.current) {
      setTimeout(() => nombreInputRef.current?.focus(), 100);
    }
  }, [modalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleCrearUsuario = async () => {
    const nuevosErrores: typeof errores = {};

    if (!nuevoUsuario.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!nuevoUsuario.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
    if (!nuevoUsuario.dni.trim()) nuevosErrores.dni = "El DNI es obligatorio";
    if (!nuevoUsuario.email.trim()) nuevosErrores.email = "El email es obligatorio";
    if (!nuevoUsuario.celular.trim()) nuevosErrores.celular = "El celular es obligatorio";
    if (!nuevoUsuario.password.trim()) nuevosErrores.password = "La contraseña es obligatoria";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      toast.error("Por favor completá todos los campos obligatorios");
      return;
    }

    try {
      await api.post("/auth/register", nuevoUsuario);
      fetchUsuarios();
      resetModal();
      toast.success("Usuario creado correctamente");
    } catch (error) {
      toast.error("Error al crear el usuario");
      console.error(error);
    }
  };

  const resetModal = () => {
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      celular: "",
      password: "",
      rol: "administracion",
    });
    setErrores({});
    setModalOpen(false);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
       <div className="flex items-center gap-2 text-[#022c1f]">
        <Users color="#10b985" />
        <h2 className="text-2xl font-bold">Usuarios</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
      <input
          type="text"
          placeholder="Buscar usuario..."
          className="border px-3 py-2 rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
    
        <button
        className="bg-[#25D366] hover:bg-[#1CB255] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
        onClick={() => setModalOpen(true)}
        >
          <UserRoundPlus size={18} />
          Crear Usuario
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600">
            <tr className="text-center"> 
              <th className="px-6 py-2">Nombre</th>
              <th className="px-6 py-2">Apellido</th>
              <th className="px-6 py-2">DNI</th>
              <th className="px-6 py-2">Email</th>
              <th className="px-6 py-2">Celular</th>
              <th className="px-6 py-2 text-center ">Rol</th>
        
            </tr>
          </thead>
          <tbody >
            {usuariosFiltrados.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50 text-center">
                <td className="px-6 py-2 text-xs text-gray-700">{u.nombre}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{u.apellido}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{u.dni}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{u.email}</td>
                <td className="px-6 py-2 text-xs text-gray-700">{u.celular}</td>
                <td className="px-6 py-2 text-xs text-gray-700 capitalize  ">{u.rol}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#eaecf4] p-6 rounded shadow-lg w-full max-w-3xl">
            <div className="flex gap-2 items-center mb-4">
              <Users />
              <h2 className="text-lg font-semibold">Nuevo Usuario</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["nombre", "apellido", "dni", "email", "celular", "password"].map((name) => (
                <div key={name}>
                  <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={name === "password" ? "password" : "text"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={(nuevoUsuario as any)[name]}
                    onChange={handleInputChange}
                    className={`border p-2 rounded bg-white w-full mt-1 ${errores[name as keyof typeof errores] ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errores[name as keyof typeof errores] && (
                    <p className="text-red-500 text-xs mt-1">{errores[name as keyof typeof errores]}</p>
                  )}
                </div>
              ))}
              <div>
                <label htmlFor="rol" className="text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={nuevoUsuario.rol}
                  onChange={handleInputChange}
                  className="border p-2 rounded bg-white w-full mt-1 border-gray-300"
                >
                  {ROLES.map((rol) => (
                    <option key={rol.value} value={rol.value}>
                      {rol.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={resetModal} className="px-4 py-2 bg-gray-300 hover:bg-[#f5f6fa] cursor-pointer rounded-lg">
                Cancelar
              </button>
              <button
                onClick={handleCrearUsuario}
                className="px-4 py-2 bg-[#5b709c] hover:bg-[#475882] text-white rounded-lg cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
