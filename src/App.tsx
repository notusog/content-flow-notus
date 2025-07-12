import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { PersonalBrandProvider } from "@/contexts/PersonalBrandContext";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlobalSearch } from "@/components/GlobalSearch";
import Dashboard from "./pages/Dashboard";
import ContentEngine from "./pages/ContentEngine";
import Analytics from "./pages/Analytics";
import YouTube from "./pages/YouTube";
import LinkedIn from "./pages/LinkedIn";
import ContentLibrary from "./pages/ContentLibrary";
import PersonalBrands from "./pages/PersonalBrands";
import AIChat from "./pages/AIChat";
import WorkspaceSetup from "./pages/WorkspaceSetup";
import ContentCalendar from "./pages/ContentCalendar";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user, profile, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (!profile?.onboarding_completed) {
    return <Onboarding />;
  }

  return (
    <>
      <GlobalSearch />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="workspace-setup" element={<WorkspaceSetup />} />
          <Route path="content" element={<ContentEngine />} />
          <Route path="youtube" element={<YouTube />} />
          <Route path="linkedin" element={<LinkedIn />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="library" element={<ContentLibrary />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="personal-brands" element={<PersonalBrands />} />
          <Route path="content-calendar" element={<ContentCalendar />} />
          <Route path="client-portal" element={<ClientPortal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <WorkspaceProvider>
          <PersonalBrandProvider>
            <ContentProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ProtectedRoutes />
              </BrowserRouter>
            </ContentProvider>
          </PersonalBrandProvider>
        </WorkspaceProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
