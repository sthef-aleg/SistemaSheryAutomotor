import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { CompanyConfig } from '../../types';
import { saveClient, logAudit } from '../../services/db';
import { getWhatsAppLink } from '../../utils/formatters';

interface ContactSectionProps {
  config: CompanyConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      await saveClient({
        name,
        phone,
        email,
        origin: 'Web',
        status: 'Nuevo',
        notes: [
          {
            id: 'NOTE-CONT-' + Date.now(),
            date: new Date().toISOString(),
            author: 'Formulario Contacto Web',
            type: 'Nota',
            text: `Mensaje de contacto: "${message || 'Sin mensaje'}"`
          }
        ]
      });

      await logAudit(
        'Mensaje de Contacto Web',
        `Cliente: ${name} (${phone}) envió un mensaje desde la web.`,
        'Cliente'
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="seccion-contacto" className="py-20 bg-[#070A0F] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Atención Directa
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
                Visítanos o Contáctanos
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-2">
                Estamos a tu disposición para asesorarte sobre disponibilidad, importaciones por pedido y planes de pago en guaraníes.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-start gap-3.5 bg-[#121824] p-4 rounded-2xl border border-neutral-800">
                <MapPin size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Showroom Principal</h4>
                  <p className="text-neutral-400">{config.address}</p>
                  <p className="text-neutral-400">{config.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#121824] p-4 rounded-2xl border border-neutral-800">
                <Phone size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Línea Telefónica & WhatsApp</h4>
                  <p className="text-neutral-300 font-mono">{config.phone}</p>
                  <a
                    href={getWhatsAppLink(config.whatsapp, 'Hola Shery Automotores, me gustaría hacer una consulta.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline mt-1"
                  >
                    <MessageCircle size={14} />
                    <span>Iniciar chat directo de WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#121824] p-4 rounded-2xl border border-neutral-800">
                <Mail size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Correo Electrónico</h4>
                  <p className="text-neutral-300 font-mono">{config.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#121824] p-4 rounded-2xl border border-neutral-800">
                <Clock size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Horarios de Atención</h4>
                  <p className="text-neutral-400">{config.hoursWeekday}</p>
                  <p className="text-neutral-400">{config.hoursSaturday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Message Form Right Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#121824] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-1">Envíanos un Mensaje</h3>
              <p className="text-xs text-neutral-400 mb-6">
                Te responderemos a la brevedad por llamada telefónica o WhatsApp.
              </p>

              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">¡Mensaje Enviado con Éxito!</h4>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                    Gracias por comunicarte con Shery Automotores. Un asesor te responderá a la brevedad al {phone}.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="border border-neutral-700 text-xs font-semibold py-2 px-5 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Laura Benítez"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#0E1420] text-white text-xs py-3 px-3.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0981 123 456"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-[#0E1420] text-white text-xs py-3 px-3.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="laura@ejemplo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#0E1420] text-white text-xs py-3 px-3.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                      ¿En qué vehículo o servicio estás interesado?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Escribe tu consulta aquí..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full bg-[#0E1420] text-white text-xs p-3.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar Consulta'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
