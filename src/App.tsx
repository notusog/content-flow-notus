import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ContentEngine from "./pages/ContentEngine";
import InsightExtractor from "./pages/InsightExtractor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="content" element={<ContentEngine />} />
        <Route path="insights" element={<InsightExtractor />} />
        <Route path="pipeline" element={<div className="text-center py-12 text-muted-foreground">Pipeline Generator - Coming Soon</div>} />
        <Route path="channels" element={<div className="text-center py-12 text-muted-foreground">Multi-Channel Hub - Coming Soon</div>} />
        <Route path="vlogs" element={<div className="text-center py-12 text-muted-foreground">YouTube Vlogs - Coming Soon</div>} />
        <Route path="newsletters" element={<div className="text-center py-12 text-muted-foreground">Newsletters - Coming Soon</div>} />
        <Route path="lead-magnets" element={<div className="text-center py-12 text-muted-foreground">Lead Magnets - Coming Soon</div>} />
        <Route path="analytics" element={<div className="text-center py-12 text-muted-foreground">Analytics - Coming Soon</div>} />
        <Route path="team" element={<div className="text-center py-12 text-muted-foreground">Team Management - Coming Soon</div>} />
        <Route path="settings" element={<div className="text-center py-12 text-muted-foreground">Settings - Coming Soon</div>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProtectedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
