import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { title: "Inventory", href: "/inventory", icon: <Package2 className="w-5 h-5" /> },
  { title: "Analytics", href: "/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { title: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        "border-r border-border bg-card transition-all duration-300 ease-in-out h-screen flex flex-col",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <h1 className={cn(
          "text-xl font-bold font-poppins transition-opacity duration-200",
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}>
          <span className="text-primary">Game</span>
          <span className="text-secondary">Admin</span>
        </h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      <div className="p-4">
        <div className={cn(
          "flex items-center space-x-3 mb-6 transition-opacity duration-200",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <UserCircle className="w-6 h-6" />
          </div>
          <div className={cn(
            "transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            <p className="font-medium">{user?.username || "Admin"}</p>
            <p className="text-xs text-muted-foreground">{user?.role || "Admin"}</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-colors cursor-pointer",
                    collapsed ? "justify-center" : "space-x-3",
                    location === item.href 
                      ? "bg-primary/20 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  <span className={cn(
                    "transition-opacity duration-200",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  )}>
                    {item.title}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-border">
        <Button 
          variant="ghost" 
          onClick={logout}
          className={cn(
            "w-full text-muted-foreground hover:text-red-500",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className={cn(
            "transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            Logout
          </span>
        </Button>
      </div>
    </aside>
  );
}
