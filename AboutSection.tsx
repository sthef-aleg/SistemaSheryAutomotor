import React from 'react';
import { Award, Shield, ThumbsUp, Sparkles, Building2, Car } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="seccion-nosotros" className="py-20 bg-[#070A0F] border-b border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image & Trust Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80"
                alt="Showroom Shery Automotores Asunción"
                className="w-full h-[380px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-neutral-700/70 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-sm">
                    SA
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Pasión Automotriz & Excelencia</h4>
                    <p className="text-xs text-neutral-300">Asunción · Gran Asunción · Envíos a todo el país</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-full">
              <Award size={14} />
              <span>Concesionaria Líder en Importados</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-sans">
              Compromiso, Calidad y Transparencia en <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                SHERY AUTOMOTORES
              </span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Nacimos con la misión de transformar la experiencia de compra de vehículos importados en Paraguay. Creemos que adquirir un automóvil debe ser un proceso seguro, transparente y emocionante, libre de incertidumbres aduaneras o mecánicas.
            </p>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Trabajamos con dos pilares comerciales: nuestro <strong className="text-white">Stock Propio Permanente</strong> listo para entrega inmediata en nuestro showroom de Asunción, y nuestro exclusivo servicio de <strong className="text-white">Importación por Encargo</strong>, donde traemos el vehículo configurado a la medida de tus expectativas directamente de Estados Unidos, Japón, Corea, Alemania o Chile.
            </p>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div className="bg-[#121824] p-4 rounded-2xl border border-neutral-800">
                <Shield size={20} className="text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Inspección Rigurosa</h4>
                <p className="text-[11px] text-neutral-400">Verificamos historial mecánico, estructural y electrónico antes de comprar.</p>
              </div>

              <div className="bg-[#121824] p-4 rounded-2xl border border-neutral-800">
                <ThumbsUp size={20} className="text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Documentación Al Día</h4>
                <p className="text-[11px] text-neutral-400">Despacho aduanero pagado, transferencias inmediatas y título garantizado.</p>
              </div>

              <div className="bg-[#121824] p-4 rounded-2xl border border-neutral-800">
                <Sparkles size={20} className="text-blue-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-1">Precios Reales en Gs.</h4>
                <p className="text-[11px] text-neutral-400">Presupuestos sin sorpresas, cotizaciones justas y planes a tu medida.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
