interface Props {
  children: React.ReactNode;
}
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./ui/components/dashboard-sidebar";
import DashboardUserButton from "./ui/components/Dashboard-user-button";

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {/* Header left side content if any */}
          </div>
          <div className="flex items-center gap-4">
            {/* User button removed from here */}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};


export default Layout;

