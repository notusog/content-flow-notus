import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlobalSearch } from "@/components/GlobalSearch";
import Dashboard from "./pages/Dashboard";
import ContentEngine from "./pages/ContentEngine";
import InsightExtractor from "./pages/InsightExtractor";
import PipelineGenerator from "./pages/PipelineGenerator";
import MultiChannelHub from "./pages/MultiChannelHub";
import Analytics from "./pages/Analytics";
import LeadMagnets from "./pages/LeadMagnets";
import YouTube from "./pages/YouTube";
import CRM from "./pages/CRM";
import LinkedIn from "./pages/LinkedIn";
import Newsletters from "./pages/Newsletters";
import TeamManagement from "./pages/TeamManagement";
import Settings from "./pages/Settings";
import ContentLibrary from "./pages/ContentLibrary";
import DigitalTwins from "./pages/DigitalTwins";
import PersonalBrands from "./pages/PersonalBrands";
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
    <>
      <GlobalSearch />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentEngine />} />
          <Route path="insights" element={<InsightExtractor />} />
          <Route path="pipeline" element={<PipelineGenerator />} />
          <Route path="channels" element={<MultiChannelHub />} />
          <Route path="youtube" element={<YouTube />} />
          <Route path="crm" element={<CRM />} />
          <Route path="linkedin" element={<LinkedIn />} />
          <Route path="newsletters" element={<Newsletters />} />
          <Route path="lead-magnets" element={<LeadMagnets />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="library" element={<ContentLibrary />} />
          <Route path="digital-twins" element={<DigitalTwins />} />
          <Route path="personal-brands" element={<PersonalBrands />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
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
