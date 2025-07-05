"use client";

import { useRouter, usePathname } from "next/navigation";
import { Calendar, Home, LogOut, FileText, ChevronLeft, ChevronRight, Contact, Stethoscope, BriefcaseMedical, CalendarPlus, HeartPulse,} from "lucide-react";
import { useState } from "react";

interface SidebarLink {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle
  const [collapsed, setCollapsed] = useState(false); // Desktop collapse
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la ruta actual

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const links: SidebarLink[] = [
    { label: "Inicio", icon: <Home size={20} />, href: "/dashboard" },
    {
      label: "Servicios",
      icon: <BriefcaseMedical   size={20} />,
      href: "/dashboard/servicios",
    },
    {
      label: "Profesionales",
      icon: <Stethoscope  size={20} />,
      href: "/dashboard/profesionales",
    },
    {
      label: "Cronogramas",
      icon: <CalendarPlus   size={20} />,
      href: "/dashboard/cronogramas",
    },
   
    
    {
      label: "Obra Social",
      icon: <HeartPulse   size={20} />,
      href: "/dashboard/obra-social",
    },
    {
      label: "Pacientes",
      icon: <Contact size={20} />,
      href: "/dashboard/pacientes",
    },
   
   
   
    
    {
      label: "Turnos",
      icon: <Calendar size={20} />,
      href: "/dashboard/turnos",
    },
    {
      label: "Historia Clínica",
      icon: <FileText size={20} />,
      href: "/dashboard/historias",
    },
    {
      label: "Usuarios",
      icon: <FileText size={20} />,
      href: "/dashboard/usuarios",
    },
    {
      label: "Grilla",
      icon: <FileText size={20} />,
      href: "/dashboard/grilla",
    },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden p-4">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-20 flex flex-col justify-between h-screen ${
          collapsed ? "w-15" : "w-50"
        } bg-[#2f374d] text-white border-r transition-all duration-300 ease-in-out`}
      >
        <div>
          {/* Header + collapse toggle */}
          <div className="flex items-center justify-between p-3 border-b border-gray-600">
            {!collapsed && <h2 className="text-lg font-semibold">Panel</h2>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block text-white focus:outline-none cursor-pointer bg-[#3a476a] p-2 rounded-3xl"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col p-2 space-y-2 text-xs"> {/* Espacio reducido entre los links */}
            {links.map(({ label, icon, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`flex items-center gap-3 w-full text-left text-white rounded-md p-2 cursor-pointer focus:outline-none ${
                  pathname === href ? 'bg-[#4a5568] text-[#b1c2d2]' : 'hover:bg-[#4a5568] hover:text-[#b1c2d2]'
                }`}
              >
                {icon}
                {!collapsed && <span>{label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-600">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full text-left text-white rounded-md p-2 cursor-pointer focus:outline-none hover:bg-[#4a5568] hover:text-[#b1c2d2]`}
          >
            <LogOut size={20} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </>
  );
}