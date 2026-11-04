import React, { useState } from 'react';
import {
  X,
  Share2,
  Phone,
  MessageCircle,
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  CheckCircle2,
  Calculator,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Vehicle } from '../../types';
import { formatGs, formatKm, getWhatsAppLink } from '../../utils/formatters';
import { saveClient, logAudit } from '../../services/db';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  whatsappNumber: string;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  whatsappNumber
}) => {
  if (!vehicle) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  // Lead Form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [requestType, setRequestType] = useState<'info' | 'reserva' | 'visita'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Financing calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [installmentsCount, setInstallmentsCount] = useState(36);

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'];

  const downPaymentGs = Math.round((vehicle.priceGs * downPaymentPercent) / 100);
  const financedAmountGs = vehicle.priceGs - downPaymentGs;
  // Estimated monthly interest ~1.1%
  const monthlyRate = 0.011;
  const estimatedMonthlyGs = Math.round(
    (financedAmountGs * (monthlyRate * Math.pow(1 + monthlyRate, installmentsCount))) /
      (Math.pow(1 + monthlyRate, installmentsCount) - 1)
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    setIsSubmitting(true);
    try {
      await saveClient({
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
        origin: 'Web',
        status: requestType === 'reserva' ? 'Reservado' : 'Interesado',
        interestVehicleId: vehicle.id,
        interestVehicleName: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
        notes: [
          {
            id: 'NOTE-' + Date.now(),
            date: new Date().toISOString(),
            author: 'Web Lead Form',
            type: requestType === 'reserva' ? 'Nota' : 'Visita',
            text: `El cliente solicitó ${requestType === 'reserva' ? 'RESERVA' : requestType === 'visita' ? 'AGENDAR VISITA' : 'INFORMACIÓN'} para ${vehicle.make} ${vehicle.model} ${vehicle.year}. Precio: ${formatGs(vehicle.priceGs)}.`
          }
        ]
      });

      await logAudit(
        'Lead Web Captado',
        `Cliente ${clientName} (${clientPhone}) interesado en ${vehicle.make} ${vehicle.model} (${requestType})`,
        'Cliente'
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const waMessage = `Hola Shery Automotores, estoy viendo la ficha del ${vehicle.make} ${vehicle.model} ${vehicle.year} (${formatGs(vehicle.priceGs)}). Quisiera coordinar una visita y conocer planes de financiación.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#0E1420] border border-neutral-700/80 rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-white">
        {/* Top Header sticky bar */}
        <div className="sticky top-0 z-20 bg-[#0E1420]/95 backdrop-blur-md border-b border-neutral-800 px-5 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
              Ficha Técnica Oficial
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {vehicle.make} {vehicle.model} <span className="text-neutral-400 font-normal">{vehicle.year}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-neutral-700 hover:border-neutral-500 bg-neutral-800/40 text-neutral-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 px-3"
            >
              <Share2 size={15} />
              <span className="hidden sm:inline">{copiedShare ? '¡Copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 space-y-8">
          {/* Main Gallery + Highlight Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Gallery Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                <img
                  src={images[activeImageIdx]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-neutral-200">
                  Foto {activeImageIdx + 1} de {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIdx === idx ? 'border-amber-400 scale-95' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs & Direct CTAs (5 cols) */}
            <div className="lg:col-span-5 bg-[#141C2A] border border-neutral-800 rounded-2xl p-5 space-y-5">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold block mb-1">
                  Precio Contado / Financiado
                </span>
                <p className="text-3xl font-black text-[#38BDF8] font-mono tracking-tight">
                  {formatGs(vehicle.priceGs)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {vehicle.status === 'disponible' ? '✓ Disponible para entrega' : vehicle.status}
                  </span>
                  <span className="text-xs text-neutral-400">· Despacho incluido</span>
                </div>
              </div>

              {/* Quick Specs Icons */}
              <div className="grid grid-cols-2 gap-2.5 text-xs text-neutral-300">
                <div className="bg-[#0E1420] p-2.5 rounded-xl border border-neutral-800 flex items-center gap-2">
                  <Calendar size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Año</span>
                    <span className="font-bold">{vehicle.year}</span>
                  </div>
                </div>

                <div className="bg-[#0E1420] p-2.5 rounded-xl border border-neutral-800 flex items-center gap-2">
                  <Gauge size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Kilometraje</span>
                    <span className="font-bold">{formatKm(vehicle.km)}</span>
                  </div>
                </div>

                <div className="bg-[#0E1420] p-2.5 rounded-xl border border-neutral-800 flex items-center gap-2">
                  <Fuel size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Combustible</span>
                    <span className="font-bold">{vehicle.fuel}</span>
                  </div>
                </div>

                <div className="bg-[#0E1420] p-2.5 rounded-xl border border-neutral-800 flex items-center gap-2">
                  <MapPin size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Ubicación</span>
                    <span className="font-bold truncate max-w-[100px]">{vehicle.location.split('-')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={getWhatsAppLink(whatsappNumber, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20"
                >
                  <MessageCircle size={18} />
                  <span>Consultar por WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    const formElement = document.getElementById('modal-lead-form');
                    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold py-3 px-4 rounded-xl text-sm transition-all"
                >
                  <span>Solicitar Reserva / Visita</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Description & Technical Specifications Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-neutral-800">
            {/* Description & Features (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2">Descripción del Vehículo</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {vehicle.description || 'Vehículo importado en excelentes condiciones mecánicas y estéticas, verificado bajo estrictos controles de calidad.'}
                </p>
              </div>

              {/* Features List */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h4 className="text-base font-bold text-white mb-3">Equipamiento y Confort</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vehicle.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulator of Cuotas Estimadas */}
              <div className="bg-[#141C2A] border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Calculator size={17} />
                  <span>Simulador Estimado de Financiación (Gs.)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">
                      Entrega Inicial ({downPaymentPercent}%): <span className="text-white font-mono font-bold">{formatGs(downPaymentGs)}</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      step="5"
                      value={downPaymentPercent}
                      onChange={e => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">
                      Plazo: <span className="text-white font-bold">{installmentsCount} meses</span>
                    </label>
                    <div className="flex gap-2">
                      {[12, 24, 36, 48].map(m => (
                        <button
                          key={m}
                          onClick={() => setInstallmentsCount(m)}
                          className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${
                            installmentsCount === m
                              ? 'bg-blue-600 text-white'
                              : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-700/80 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Cuota mensual estimada:</span>
                  <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                    {formatGs(estimatedMonthlyGs)} / mes
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 italic">
                  * Valores referenciales sujetos a aprobación crediticia. Consulte opciones en guaraníes o dólares.
                </p>
              </div>
            </div>

            {/* Technical Sheet & Lead Form (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Detailed Specs Table */}
              <div className="bg-[#141C2A] border border-neutral-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-3">
                  Especificaciones Detalladas
                </h4>
                <div className="divide-y divide-neutral-800/80 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-400">VIN / Chasis:</span>
                    <span className="font-mono text-neutral-200">{vehicle.vin}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-400">Cilindrada:</span>
                    <span className="text-neutral-200">{vehicle.cylinder}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-400">Color:</span>
                    <span className="text-neutral-200">{vehicle.color}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-400">Transmisión:</span>
                    <span className="text-neutral-200">{vehicle.transmission}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-400">Combustible:</span>
                    <span className="text-neutral-200">{vehicle.fuel}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-400">Ubicación:</span>
                    <span className="text-neutral-200">{vehicle.location}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-neutral-400">Documentación:</span>
                    <span className="text-emerald-400 font-semibold">Despacho listo para transferir</span>
                  </div>
                </div>
              </div>

              {/* Lead Request / Reserve Form */}
              <div id="modal-lead-form" className="bg-[#141C2A] border border-neutral-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-1">
                  ¿Te interesa este {vehicle.make} {vehicle.model}?
                </h4>
                <p className="text-xs text-neutral-400 mb-4">
                  Completa tus datos y un asesor se comunicará contigo de inmediato.
                </p>

                {submitted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2">
                    <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                    <p className="text-sm font-bold text-white">¡Solicitud recibida con éxito!</p>
                    <p className="text-xs text-neutral-300">
                      Un asesor de Shery Automotores te contactará al {clientPhone}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <div className="flex gap-2 p-1 bg-[#0E1420] rounded-xl text-xs">
                      <button
                        type="button"
                        onClick={() => setRequestType('info')}
                        className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                          requestType === 'info' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Más info
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestType('visita')}
                        className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                          requestType === 'visita' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Agendar test drive
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestType('reserva')}
                        className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                          requestType === 'reserva' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Solicitar reserva
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Nombre y Apellido *"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700/80 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Teléfono / WhatsApp (ej: 0981 123 456) *"
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700/80 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Correo electrónico (opcional)"
                        value={clientEmail}
                        onChange={e => setClientEmail(e.target.value)}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700/80 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
