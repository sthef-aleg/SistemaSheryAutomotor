import React from 'react';
import { Shield } from 'lucide-react';
import { CompanyConfig } from '../../types';

interface FooterProps {
  config: CompanyConfig;
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigate, onOpenAdmin }) => {
  return (
    <footer className="bg-[#05070B] text-white pt-12 pb-8 border-t border-neutral-900 relative overflow-hidden">
      {/* Decorative Brand Accent Arc matching reference mockup */}
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 px-4 mb-8">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-blue-500/80" />
        <div className="flex items-center gap-2 px-3">
          <span className="text-xs font-black tracking-[0.25em] text-white uppercase font-sans">
            {config.companyName}
          </span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400/40 to-blue-500/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col items-center text-center space-y-6">
        {/* Navigation Mirror */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-medium">
          <button onClick={() => onNavigate('inicio')} className="hover:text-amber-400 transition-colors">
            Inicio
          </button>
          <button onClick={() => onNavigate('stock')} className="hover:text-amber-400 transition-colors">
            Nuestro Stock
          </button>
          <button onClick={() => onNavigate('importacion')} className="hover:text-amber-400 transition-colors">
            Importación por Pedido
          </button>
          <button onClick={() => onNavigate('nosotros')} className="hover:text-amber-400 transition-colors">
            Nosotros
          </button>
          <button onClick={() => onNavigate('contacto')} className="hover:text-amber-400 transition-colors">
            Contacto
          </button>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-amber-400/80 hover:text-amber-300 font-bold transition-colors"
          >
            <Shield size={12} />
            <span>Sistema Privado</span>
          </button>
        </div>

        {/* Social Media Circular Links */}
        <div className="flex items-center gap-3">
          <a
            href={config.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-[#121824] hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <a
            href={config.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-[#121824] hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-blue-400 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.65 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>

          <a
            href={config.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="w-10 h-10 rounded-full bg-[#121824] hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.84 3.49 2.64 1.39-.08 2.6-1.07 2.95-2.42.11-.47.16-.96.16-1.45V.02z" />
            </svg>
          </a>
        </div>

        {/* Legal & Location Notice */}
        <div className="text-[11px] text-neutral-500 space-y-1">
          <p>© {new Date().getFullYear()} SHERY AUTOMOTORES S.A. Todos los derechos reservados.</p>
          <p>{config.address} · {config.city}</p>
        </div>
      </div>
    </footer>
  );
};
