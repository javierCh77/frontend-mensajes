"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  BriefcaseMedical,
  BookUser,
  Inbox,
} from "lucide-react";
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
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const links: SidebarLink[] = [
    { label: "Inicio", icon: <Home size={20} />, href: "/dashboard" },
    { label: "Servicios", icon: <BriefcaseMedical size={20} />, href: "/dashboard/servicios" },
    { label: "Profesionales", icon: <BookUser size={20} />, href: "/dashboard/profesionales" },
    { label: "Solicitudes", icon: <Inbox size={20} />, href: "/dashboard/solicitudes" },
    { label: "Usuarios", icon: <FileText size={20} />, href: "/dashboard/usuarios" },
  ];

  return (
    <>
      {/* Sidebar móvil */}
      <div className="md:hidden p-4">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar mobile menu */}
      <div
        className={`md:hidden fixed top-0 left-0 z-30 h-screen w-52 bg-[#10B981] text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 font-bold text-lg border-b border-[#34d399]">Panel</div>
        <nav className="flex flex-col p-2 space-y-1 text-sm">
          {links.map(({ label, icon, href }) => {
            const isActive = pathname === href;
            return (
              <button
                key={label}
                onClick={() => {
                  router.push(href);
                  setIsOpen(false); // cerrar en mobile
                }}
                className={`flex items-center gap-3 w-full text-left rounded-md p-2 font-medium transition-colors ${
                  isActive
                    ? "bg-[#059669] text-white"
                    : "text-white/80 hover:bg-[#34D399] hover:text-[#065f46]"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#34d399]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left rounded-md p-2 font-medium text-white/80 hover:bg-[#34D399] hover:text-[#065f46]"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Sidebar escritorio */}
      <div
        className={`hidden md:flex flex-col justify-between h-screen transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-52"
        } bg-[#10B981] text-white`}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#34d399]">
            {!collapsed && <h2 className="text-lg font-bold text-white">Panel</h2>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="bg-[#059669] text-white p-1 rounded-full"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <nav className="flex flex-col p-2 space-y-1 text-sm">
            {links.map(({ label, icon, href }) => {
              const isActive = pathname === href;
              return (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className={`flex items-center gap-3 w-full text-left rounded-md p-2 font-medium transition-colors ${
                    isActive
                      ? "bg-[#059669] text-white"
                      : "text-white/80 hover:bg-[#34D399] hover:text-[#065f46]"
                  }`}
                >
                  <span>{icon}</span>
                  {!collapsed && <span>{label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#34d399]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left rounded-md p-2 font-medium text-white/80 hover:bg-[#34D399] hover:text-[#065f46]"
          >
            <LogOut size={20} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </>
  );
}
