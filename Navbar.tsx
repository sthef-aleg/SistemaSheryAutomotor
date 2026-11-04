import React from 'react';
import { Phone, Car, Users, Mail, Compass, Shield, Sparkles, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
  onOpenContactModal: () => void;
  whatsappNumber: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenAdmin,
  onOpenContactModal,
  whatsappNumber
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#070A0F]/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 lg:px-16 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('inicio')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <img
            src="/public/assets/aistudio/image_c96a00bb.png"
            alt="Shery Automotores Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-wider text-white uppercase leading-none font-sans">
              Shery
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-amber-400 uppercase leading-tight mt-0.5">
              Automotores
            </span>
          </div>
        </button>

        {/* Desktop Nav Pills */}
        <nav className="hidden lg:flex items-center bg-[#101622] p-1.5 rounded-full border border-neutral-800/90 shadow-inner">
          <button
            onClick={() => onNavigate('inicio')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeSection === 'inicio'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <span>Inicio</span>
          </button>

          <button
            onClick={() => onNavigate('stock')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeSection === 'stock'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Car size={14} />
            <span>Nuestro Stock</span>
          </button>

          <button
            onClick={() => onNavigate('importacion')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeSection === 'importacion'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Compass size={14} />
            <span>Importación por Pedido</span>
          </button>

          <button
            onClick={() => onNavigate('nosotros')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeSection === 'nosotros'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Users size={14} />
            <span>Nosotros</span>
          </button>

          <button
            onClick={() => onNavigate('contacto')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeSection === 'contacto'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Mail size={14} />
            <span>Contacto</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={getWhatsAppLink(whatsappNumber, 'Hola Shery Automotores, me gustaría consultar por los vehículos disponibles.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 border border-neutral-700/80 bg-[#101622] hover:bg-neutral-800/70 text-neutral-200 px-3.5 py-2 rounded-full text-xs font-medium transition-all"
          >
            <MessageCircle size={15} className="text-emerald-400" />
            <span className="font-mono">{whatsappNumber}</span>
          </a>

          <button
            onClick={onOpenContactModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-4 sm:px-5 py-2 rounded-full text-xs tracking-wide shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles size={14} />
            <span>Consultar</span>
          </button>

          <button
            onClick={onOpenAdmin}
            title="Ingreso al Sistema Administrativo Privado"
            className="flex items-center gap-1.5 border border-amber-400 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-extrabold px-3 sm:px-4 py-2 rounded-full text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Shield size={14} />
            <span>Sistema Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
