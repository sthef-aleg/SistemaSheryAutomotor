import React from 'react';
import { ShieldCheck, Handshake, Car, Clock, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

interface TrustStripProps {
  whatsappNumber: string;
}

export const TrustStrip: React.FC<TrustStripProps> = ({ whatsappNumber }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 my-12">
      <div className="bg-[#121824] border border-neutral-800 rounded-3xl p-5 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
        {/* 4 Feature Items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full lg:w-auto flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">Compra segura</h4>
              <p className="text-[11px] text-neutral-400">Contratos con validez jurídica</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Handshake size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">Asesoramiento</h4>
              <p className="text-[11px] text-neutral-400">Atención personalizada 1 a 1</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Car size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">Vehículos verificados</h4>
              <p className="text-[11px] text-neutral-400">Inspección de 120 puntos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">Entrega inmediata</h4>
              <p className="text-[11px] text-neutral-400">Stock con despacho pagado</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Call to action pill */}
        <div className="w-full lg:w-auto shrink-0">
          <a
            href={getWhatsAppLink(whatsappNumber, 'Hola Shery Automotores, me gustaría recibir asesoramiento para la compra de un vehículo.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold px-6 py-3.5 rounded-full text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <MessageCircle size={20} />
            <span>Contáctanos por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
