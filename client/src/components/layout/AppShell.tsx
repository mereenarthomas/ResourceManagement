import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FolderKanban, PieChart, Menu, Search, Bell } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SidebarContent = () => {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Users, label: "Resources", href: "/resources" },
    { icon: FolderKanban, label: "Projects", href: "/projects" },
    { icon: PieChart, label: "Allocations", href: "/allocations" },
  ];

  return (
    <div className="flex flex-col h-full text-foreground/80">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-display font-bold tracking-wider text-primary">RMS<span className="text-white">.APP</span></h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Resource Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group ${
                location === item.href
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)]"
                  : "hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 ${location === item.href ? "text-primary" : "text-muted-foreground group-hover:text-white"}`} />
              <span className="font-medium tracking-wide">{item.label}</span>
              {location === item.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              )}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-panel p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="font-display font-bold text-primary">AD</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin User</p>
              <p className="text-xs text-muted-foreground">RMS Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r border-white/5 bg-black/20 backdrop-blur-md fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r border-white/10 bg-black/90 text-white w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 max-w-xl ml-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search resources, projects..." 
                className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary/50 transition-all text-sm rounded-full" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 relative z-10 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
