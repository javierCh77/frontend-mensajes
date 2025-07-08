"use client";

import Sidebar from "@/components/Sidebar";
import TopMenu from "@/components/TopMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
  <Sidebar />

  <div className="flex-1 flex flex-col min-w-0"> {/* 👈 clave para scroll */}
    <TopMenu />
    <div className="flex-1 overflow-auto p-4 bg-gray-50">
      <div className="min-w-[1024px]">{children}</div> {/* 👈 tabla grande */}
    </div>
  </div>
</div>
  );
}
