import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import { isAuthenticated } from "@/lib/auth";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleForm from "./pages/VehicleForm";
import VehicleDetail from "./pages/VehicleDetail";
import MorphPhotos from "./pages/MorphPhotos";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import Pipeline from "./pages/Pipeline";
import Anuncios from "./pages/Anuncios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Concessionarias from "./pages/Concessionarias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="/vehicles" element={<ErrorBoundary><Vehicles /></ErrorBoundary>} />
            <Route path="/vehicles/new" element={<ErrorBoundary><VehicleForm /></ErrorBoundary>} />
            <Route path="/vehicles/:id" element={<ErrorBoundary><VehicleDetail /></ErrorBoundary>} />
            <Route path="/vehicles/:id/edit" element={<ErrorBoundary><VehicleForm /></ErrorBoundary>} />
            <Route path="/nexus-chat" element={<ErrorBoundary><MorphPhotos /></ErrorBoundary>} />
            <Route path="/morph" element={<ErrorBoundary><MorphPhotos /></ErrorBoundary>} />
            <Route path="/schedule" element={<ErrorBoundary><Schedule /></ErrorBoundary>} />
            <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
            <Route path="/leads" element={<ErrorBoundary><Leads /></ErrorBoundary>} />
            <Route path="/pipeline" element={<ErrorBoundary><Pipeline /></ErrorBoundary>} />
            <Route path="/anuncios" element={<ErrorBoundary><Anuncios /></ErrorBoundary>} />
            <Route path="/concessionarias" element={<ErrorBoundary><Concessionarias /></ErrorBoundary>} />
            <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
