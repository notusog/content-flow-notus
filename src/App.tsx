import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { PersonalBrandProvider } from "@/contexts/PersonalBrandContext";
import Auth from "./pages/Auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlobalSearch } from "@/components/GlobalSearch";
import Dashboard from "./pages/Dashboard";
import ContentEngine from "./pages/ContentEngine";
import Analytics from "./pages/Analytics";
import YouTube from "./pages/YouTube";
import LinkedIn from "./pages/LinkedIn";
import ContentLibrary from "./pages/ContentLibrary";
import PersonalBrands from "./pages/PersonalBrands";
import WorkspaceSetup from "./pages/WorkspaceSetup";
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
    return <Auth />;
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
          <Route path="personal-brands" element={<PersonalBrands />} />
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
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
