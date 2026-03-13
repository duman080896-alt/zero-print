import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingButtons from "@/components/shared/FloatingButtons";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Poshiv from "@/pages/Poshiv";
import Poligrafiya from "@/pages/Poligrafiya";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Catalog from "@/pages/Catalog";
import ProductPage from "@/pages/ProductPage";
import Landing from "@/pages/Landing";
import Vyshivka from "@/pages/uslugi/Vyshivka";
import Pechat from "@/pages/uslugi/Pechat";
import PoshivUslugi from "@/pages/uslugi/PoshivUslugi";
import Brendirovanie from "@/pages/uslugi/Brendirovanie";
import Cart from "@/pages/Cart";
import AccountLogin from "@/pages/account/Login";
import AccountRegister from "@/pages/account/Register";
import AccountDashboard from "@/pages/account/Dashboard";
import ManagerLogin from "@/pages/manager/Login";
import ManagerDashboard from "@/pages/manager/Dashboard";
import KpCreate from "@/pages/manager/KpCreate";
import KpView from "@/pages/KpView";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/landing" component={Landing} />
      <Route path="/poshiv" component={Poshiv} />
      <Route path="/poligrafiya" component={Poligrafiya} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/about" component={About} />
      <Route path="/kontakty" component={Contact} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/catalog/product/:id" component={ProductPage} />
      <Route path="/uslugi/vyshivka" component={Vyshivka} />
      <Route path="/uslugi/pechat" component={Pechat} />
      <Route path="/uslugi/poshiv" component={PoshivUslugi} />
      <Route path="/uslugi/brendirovanie" component={Brendirovanie} />
      <Route path="/cart" component={Cart} />
      <Route path="/kp/:id" component={KpView} />
      <Route path="/account/login" component={AccountLogin} />
      <Route path="/account/register" component={AccountRegister} />
      <Route path="/account" component={AccountDashboard} />
      <Route path="/manager/login" component={ManagerLogin} />
      <Route path="/manager/kp/create" component={KpCreate} />
      <Route path="/manager" component={ManagerDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <FloatingButtons />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
