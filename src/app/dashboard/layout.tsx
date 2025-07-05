import Sidebar from "@/components/Sidebar";
import TopMenu from "@/components/TopMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* TopMenu ya maneja internamente el usuario */}
        <TopMenu />

        <div className="">
          {children}
        </div>
      </div>
    </div>
  );
}
