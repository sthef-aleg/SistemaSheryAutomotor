import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const defaultOptions = [
    'Hola, me gustaría consultar por los vehículos en stock.',
    'Quiero solicitar una cotización de importación por encargo.',
    'Quisiera agendar una visita en el showroom de Asunción.'
  ];

  const handleSend = (text: string) => {
    const link = getWhatsAppLink(whatsappNumber, text);
    window.open(link, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-[#101622] border border-neutral-700/80 rounded-2xl shadow-2xl p-4 text-white animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                <MessageCircle size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Shery Automotores</h4>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Asesores en línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-md"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick choices */}
          <div className="py-3 space-y-1.5">
            <p className="text-[11px] text-neutral-400 font-medium mb-1">Preguntas frecuentes:</p>
            {defaultOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSend(opt)}
                className="w-full text-left text-xs bg-[#172132] hover:bg-[#1E2B40] text-neutral-200 p-2.5 rounded-xl transition-colors border border-neutral-800 hover:border-neutral-700 block"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Custom message input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (customText.trim()) handleSend(customText);
            }}
            className="flex items-center gap-1.5 pt-2 border-t border-neutral-800"
          >
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              className="flex-1 bg-[#0A0E17] text-xs py-2 px-3 rounded-lg border border-neutral-700 text-white focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-black p-2 rounded-lg transition-colors font-bold"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat de WhatsApp"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer relative"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-black rounded-full" />
        <MessageCircle size={28} />
      </button>
    </div>
  );
};
