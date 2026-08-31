import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./i18n";
import "./app/globals.css";
import { ThemeProvider } from "./theme";

const HomeApp = lazy(() => import("./home-app"));
const CaseApp = lazy(() => import("./case-app"));
const ServicePageApp = lazy(() => import("./service-page-app"));

function VercelApp() {
  const localizedPath = window.location.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const projectMatch = localizedPath.match(/^\/projects\/([^/]+)\/?$/);
  const isHome = localizedPath === "/";
  return (
    <Suspense fallback={<div className="route-loader" aria-label="Loading" />}>
      {projectMatch ? <CaseApp slug={projectMatch[1]} /> : isHome ? <HomeApp /> : <ServicePageApp slug={localizedPath.slice(1)} />}
    </Suspense>
  );
}

document.documentElement.style.setProperty("--font-geist", '"Manrope"');
document.documentElement.style.setProperty("--font-geist-mono", '"Manrope"');
document.documentElement.style.setProperty("--font-cyrillic", '"Manrope"');

createRoot(document.getElementById("root")!).render(
  <StrictMode><ThemeProvider><LanguageProvider><VercelApp /></LanguageProvider></ThemeProvider></StrictMode>,
);
