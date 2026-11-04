import React from 'react';
import { ArrowRight, Compass, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExploreStock: () => void;
  onRequestImport: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreStock, onRequestImport }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#070A0F] via-[#0B1019] to-[#070A0F] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-neutral-900">
      {/* Background radial luxury lighting effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[450px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Quiet quality badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-full mb-5">
              <ShieldCheck size={14} />
              <span>Garantía de Importación Directa · Paraguay</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5 font-sans">
              Tu próximo auto, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400">
                está acá
              </span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-xl font-normal">
              Autos importados seleccionados · Calidad garantizada · La mejor atención personalizada de Asunción.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreStock}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-7 py-3.5 rounded-full text-sm sm:text-base tracking-wide shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Ver catálogo</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onRequestImport}
                className="flex items-center justify-center gap-2 border border-blue-500/50 hover:border-blue-400 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 hover:text-white font-semibold px-6 py-3.5 rounded-full text-sm sm:text-base transition-all"
              >
                <Compass size={18} />
                <span>Solicitar importación</span>
              </button>
            </div>

            {/* Micro proof points */}
            <div className="flex flex-wrap items-center gap-6 mt-10 pt-6 border-t border-neutral-800/80 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Despacho 100% pagado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Kilometraje certificado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Financiación propia y bancaria</span>
              </div>
            </div>
          </div>

          {/* Right Showroom Car Hero Display */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800/90 shadow-2xl bg-gradient-to-br from-neutral-900 to-[#0A0D14] group">
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-70" />

              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80"
                alt="Automóvil deportivo de lujo en showroom Shery Automotores"
                className="w-full h-[320px] sm:h-[400px] lg:h-[430px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dealership Floating Badge */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between bg-black/60 backdrop-blur-md border border-neutral-700/60 p-3.5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-400 font-black text-xs">
                    SA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Showroom Oficial Shery</p>
                    <p className="text-[11px] text-neutral-400">Vehículos en exhibición listos para entrega</p>
                  </div>
                </div>
                <button
                  onClick={onExploreStock}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Ver Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
