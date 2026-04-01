import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { isAuthenticated } from "@/lib/auth";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleForm from "./pages/VehicleForm";
import VehicleDetail from "./pages/VehicleDetail";
import NexusChat from "./pages/NexusChat";
import MorphPhotos from "./pages/MorphPhotos";
import Analytics from "./pages/Analytics";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import WhatsApp from "./pages/WhatsApp";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/new" element={<VehicleForm />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/nexus" element={<NexusChat />} />
            <Route path="/morph" element={<MorphPhotos />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
