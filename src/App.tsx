import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClaimProvider } from "@/context/ClaimContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import DiscoverPage from "./pages/DiscoverPage";
import RoleSelection from "./pages/RoleSelection";
import InstitutionSelection from "./pages/InstitutionSelection";
import UserDashboard from "./pages/UserDashboard";
import BankDashboard from "./pages/BankDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PricingPage from "./pages/PricingPage";
import BlockchainExplorer from "./pages/BlockchainExplorer";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <ClaimProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/roles" element={<RoleSelection />} />
              <Route path="/institution-select" element={<InstitutionSelection />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/bank-dashboard" element={<BankDashboard />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/blockchain-verification" element={<BlockchainExplorer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            
          </BrowserRouter>
        </ClaimProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
