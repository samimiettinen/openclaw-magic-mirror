import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import DeckLibrary from "./pages/DeckLibrary";
import DeckEditor from "./pages/DeckEditor";
import PresentationViewer from "./pages/PresentationViewer";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SamanthaArtifact from "./pages/SamanthaArtifact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DeckLibrary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/decks/:id" element={<DeckEditor />} />
            <Route path="/decks/:id/present" element={<PresentationViewer />} />
            <Route path="/artifacts/samantha" element={<SamanthaArtifact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
