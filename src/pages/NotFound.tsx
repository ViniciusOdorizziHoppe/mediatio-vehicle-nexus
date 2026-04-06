import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] relative overflow-hidden">
      <AnimatedBackground />
      <div className="text-center relative z-10">
        <h1 className="mb-4 text-8xl font-bold text-gradient">404</h1>
        <p className="mb-6 text-xl text-slate-400">Página não encontrada</p>
        <Link
          to="/"
          className="btn-brand inline-flex items-center gap-2"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
