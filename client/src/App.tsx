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
import Horeca from "@/pages/uslugi/Horeca";
import Stroitelstvo from "@/pages/uslugi/Stroitelstvo";
import Shkoly from "@/pages/uslugi/Shkoly";
import ItOfis from "@/pages/uslugi/ItOfis";
import Proizvodstvo from "@/pages/uslugi/Proizvodstvo";
import Cart from "@/pages/Cart";
import AccountLogin from "@/pages/account/Login";
import AccountRegister from "@/pages/account/Register";
import AccountDashboard from "@/pages/account/Dashboard";
import ManagerLogin from "@/pages/manager/Login";
import ManagerDashboard from "@/pages/manager/Dashboard";
import KpCreate from "@/pages/manager/KpCreate";
import KpView from "@/pages/KpView";
import { useEffect } from "react";

function AnalyticsInjector() {
  useEffect(() => {
    fetch("/api/public/analytics")
      .then((r) => r.json())
      .then((codes: Record<string, string>) => {
        if (!codes || typeof codes !== "object") return;

        // GA4
        if (codes.ga4Id) {
          const s1 = document.createElement("script");
          s1.async = true;
          s1.src = `https://www.googletagmanager.com/gtag/js?id=${codes.ga4Id}`;
          document.head.appendChild(s1);
          const s2 = document.createElement("script");
          s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${codes.ga4Id}');`;
          document.head.appendChild(s2);
        }

        // GTM
        if (codes.gtmId) {
          const s = document.createElement("script");
          s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${codes.gtmId}');`;
          document.head.appendChild(s);
        }

        // Meta Pixel
        if (codes.metaPixelId) {
          const s = document.createElement("script");
          s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${codes.metaPixelId}');fbq('track','PageView');`;
          document.head.appendChild(s);
        }

        // Yandex Metrika
        if (codes.yandexId) {
          const s = document.createElement("script");
          s.textContent = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${codes.yandexId},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`;
          document.head.appendChild(s);
        }

        // Custom head code
        if (codes.customHead) {
          const div = document.createElement("div");
          div.innerHTML = codes.customHead;
          Array.from(div.childNodes).forEach((node) => {
            if (node.nodeName === "SCRIPT") {
              const orig = node as HTMLScriptElement;
              const fresh = document.createElement("script");
              if (orig.src) fresh.src = orig.src;
              else fresh.textContent = orig.textContent;
              fresh.async = orig.async;
              Array.from(orig.attributes).forEach((a) => fresh.setAttribute(a.name, a.value));
              document.head.appendChild(fresh);
            } else {
              document.head.appendChild(node.cloneNode(true));
            }
          });
        }
      })
      .catch(() => {});
  }, []);
  return null;
}

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
      <Route path="/uslugi/horeca" component={Horeca} />
      <Route path="/uslugi/stroitelstvo" component={Stroitelstvo} />
      <Route path="/uslugi/shkoly" component={Shkoly} />
      <Route path="/uslugi/it-ofis" component={ItOfis} />
      <Route path="/uslugi/proizvodstvo" component={Proizvodstvo} />
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
        <AnalyticsInjector />
        <Toaster />
        <Router />
        <FloatingButtons />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
