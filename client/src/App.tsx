import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

// Protected Route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, [key: string]: any }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  return <Component {...rest} />;
}

// Admin layout wrapper
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        <AdminLayout>
          <ProtectedRoute component={Dashboard} />
        </AdminLayout>
      </Route>
      
      <Route path="/dashboard">
        <AdminLayout>
          <ProtectedRoute component={Dashboard} />
        </AdminLayout>
      </Route>
      
      <Route path="/inventory">
        <AdminLayout>
          <ProtectedRoute component={Inventory} />
        </AdminLayout>
      </Route>
      
      <Route path="/analytics">
        <AdminLayout>
          <ProtectedRoute component={Analytics} />
        </AdminLayout>
      </Route>
      
      <Route path="/settings">
        <AdminLayout>
          <ProtectedRoute component={Settings} />
        </AdminLayout>
      </Route>
      
      <Route>
        <AdminLayout>
          <NotFound />
        </AdminLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
