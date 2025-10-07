import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import Problem from "./pages/Problem";
import Solution from "./pages/Solution";
import Personalize from "./pages/Personalize";
import Register from "./pages/Register";
import Details from "./pages/Details";
import Inventory from "./pages/Inventory";
import Today from "./pages/Today";
import Guide from "./pages/Guide";
import Article from "./pages/Article";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/solution" element={<Solution />} />
            <Route path="/personalize" element={<Personalize />} />
            <Route path="/register" element={<Register />} />
            <Route path="/details" element={<Details />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/today" element={<Today />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
