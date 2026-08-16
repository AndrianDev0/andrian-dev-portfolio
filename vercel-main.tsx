import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./i18n";
import "./app/globals.css";
import { ThemeProvider } from "./theme";

const HomeApp = lazy(() => import("./home-app"));
const CaseApp = lazy(() => import("./case-app"));

function VercelApp() {
  const projectMatch = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  return (
    <Suspense fallback={<div className="route-loader" aria-label="Loading" />}>
      {projectMatch ? <CaseApp slug={projectMatch[1]} /> : <HomeApp />}
    </Suspense>
  );
}

document.documentElement.style.setProperty("--font-geist", '"Manrope"');
document.documentElement.style.setProperty("--font-geist-mono", '"Manrope"');
document.documentElement.style.setProperty("--font-cyrillic", '"Manrope"');

createRoot(document.getElementById("root")!).render(
  <StrictMode><ThemeProvider><LanguageProvider><VercelApp /></LanguageProvider></ThemeProvider></StrictMode>,
);
