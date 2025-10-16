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
import WiseBloomOnboarding from "./pages/WiseBloomOnboarding";
import Register from "./pages/Register";
import Details from "./pages/Details";
import SkinConcerns from "./pages/SkinConcerns";
import Inventory from "./pages/Inventory";
import PushNotification from "./pages/PushNotification";
import Integrations from "./pages/Integrations";
import Today from "./pages/Today";
import Guide from "./pages/Guide";
import Article from "./pages/Article";
import Products from "./pages/Products";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import Scanner from "./pages/Scanner";
import Sisterhood from "./pages/Sisterhood";
import LegacyPoints from "./pages/LegacyPoints";
import LegacyTreasury from "./pages/LegacyTreasury";
import ProductRating from "./pages/ProductRating";
import RDPanel from "./pages/RDPanel";
import LegacyFundVote from "./pages/LegacyFundVote";
import PodChat from "./pages/PodChat";
import BountyBoard from "./pages/BountyBoard";
import Profile from "./pages/Profile";
import Aura from "./pages/Aura";
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
            <Route path="/wise-bloom" element={<WiseBloomOnboarding />} />
            <Route path="/register" element={<Register />} />
            <Route path="/details" element={<Details />} />
            <Route path="/skin-concerns" element={<SkinConcerns />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/push-notification" element={<PushNotification />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/today" element={<Today />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/products" element={<Products />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/sisterhood" element={<Sisterhood />} />
            <Route path="/legacy-points" element={<LegacyPoints />} />
            <Route path="/legacy-treasury" element={<LegacyTreasury />} />
            <Route path="/product-rating" element={<ProductRating />} />
            <Route path="/rd-panel" element={<RDPanel />} />
            <Route path="/legacy-fund-vote" element={<LegacyFundVote />} />
            <Route path="/pod-chat" element={<PodChat />} />
            <Route path="/bounty-board" element={<BountyBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/aura" element={<Aura />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
