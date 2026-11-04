import React, { useState } from 'react';
import { Compass, CheckCircle2, ShieldCheck, Globe, DollarSign, Send } from 'lucide-react';
import { createImportRequest } from '../../services/db';

export const ImportRequestSection: React.FC = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    desiredMake: '',
    desiredModel: '',
    desiredYearRange: '2021 - 2024',
    desiredVersion: '',
    desiredColor: '',
    desiredKm: 'Menos de 40.000 km',
    budgetGs: 120000000,
    preferredCountry: 'Estados Unidos (Miami / Florida)',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientPhone || !formData.desiredMake || !formData.desiredModel) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createImportRequest({
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        desiredMake: formData.desiredMake,
        desiredModel: formData.desiredModel,
        desiredYearRange: formData.desiredYearRange,
        desiredVersion: formData.desiredVersion,
        desiredColor: formData.desiredColor,
        desiredKm: formData.desiredKm,
        budgetGs: Number(formData.budgetGs),
        preferredCountry: formData.preferredCountry,
        comments: formData.comments
      });

      setSubmittedCode(result.requestCode);
    } catch (err) {
      console.error('Error submitting import request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="seccion-importacion" className="py-20 bg-gradient-to-b from-[#070A0F] via-[#0D131F] to-[#070A0F] border-t border-b border-neutral-900 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Proposition & Process */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full">
              <Compass size={14} />
              <span>Servicio Exclusivo Por Encargo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-sans">
              ¿No encontraste el auto que buscás? <br />
              <span className="text-amber-400">¡Lo traemos por pedido!</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              En <strong className="text-white">SHERY AUTOMOTORES</strong> contamos con una red consolidada de proveedores e inspectores en puertos clave internacionales. Buscamos, verificamos, transportamos y nacionalizamos el vehículo exacto de tus sueños con presupuesto transparente y garantía total.
            </p>

            {/* Guarantees List */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 bg-[#111723] p-3.5 rounded-2xl border border-neutral-800">
                <Globe size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Importación Multiorigen</h4>
                  <p className="text-[11px] text-neutral-400">Estados Unidos, Japón, Corea del Sur, Alemania o Chile.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#111723] p-3.5 rounded-2xl border border-neutral-800">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Inspección Mecánica Previa en Origen</h4>
                  <p className="text-[11px] text-neutral-400">Revisión técnica de chasis, motor, transmisión e historial de colisiones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#111723] p-3.5 rounded-2xl border border-neutral-800">
                <DollarSign size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Presupuesto Cerrado en Guaraníes</h4>
                  <p className="text-[11px] text-neutral-400">Desglose íntegro: vehículo, flete marítimo, despacho aduanero y entrega llave en mano.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#121824] border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative">
              {submittedCode ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white">¡Solicitud Registrada con Éxito!</h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto">
                    Hemos generado tu número de solicitud oficial en nuestro sistema de importaciones:
                  </p>
                  <div className="bg-[#0B1019] border border-amber-400/50 p-4 rounded-2xl inline-block px-8">
                    <span className="text-xs text-neutral-400 block mb-1 uppercase font-semibold">Código de Seguimiento</span>
                    <span className="text-2xl font-black text-amber-400 font-mono tracking-wider">{submittedCode}</span>
                  </div>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Un asesor especializado de Shery Automotores te enviará las primeras opciones con cotización estimada a tu WhatsApp o correo.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedCode(null);
                      setFormData({
                        clientName: '',
                        clientPhone: '',
                        clientEmail: '',
                        desiredMake: '',
                        desiredModel: '',
                        desiredYearRange: '2021 - 2024',
                        desiredVersion: '',
                        desiredColor: '',
                        desiredKm: 'Menos de 40.000 km',
                        budgetGs: 120000000,
                        preferredCountry: 'Estados Unidos (Miami / Florida)',
                        comments: ''
                      });
                    }}
                    className="mt-4 border border-neutral-700 hover:border-neutral-500 bg-neutral-800 text-neutral-200 text-xs font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white">Formulario de Pedido de Importación</h3>
                    <p className="text-xs text-neutral-400">
                      Completa los detalles del vehículo deseado para recibir una cotización personalizada sin compromiso.
                    </p>
                  </div>

                  {/* Personal info row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Marcelo Gómez"
                        value={formData.clientName}
                        onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
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
                        value={formData.clientPhone}
                        onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.clientEmail}
                        onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Desired Vehicle row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Marca Deseada *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Toyota, BMW, Ford..."
                        value={formData.desiredMake}
                        onChange={e => setFormData({ ...formData, desiredMake: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Modelo Deseado *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Hilux, X5, Mustang..."
                        value={formData.desiredModel}
                        onChange={e => setFormData({ ...formData, desiredModel: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Rango de Años
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 2020 - 2023"
                        value={formData.desiredYearRange}
                        onChange={e => setFormData({ ...formData, desiredYearRange: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Version, Color, Km row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Versión / Motor
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 2.8 Turbo Diésel 4x4"
                        value={formData.desiredVersion}
                        onChange={e => setFormData({ ...formData, desiredVersion: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Color Preferido
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Negro, Blanco, Gris..."
                        value={formData.desiredColor}
                        onChange={e => setFormData({ ...formData, desiredColor: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Kilometraje Deseado
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Menos de 50.000 km"
                        value={formData.desiredKm}
                        onChange={e => setFormData({ ...formData, desiredKm: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Budget & Country row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 flex justify-between">
                        <span>Presupuesto Aproximado (Gs.):</span>
                        <span className="text-amber-400 font-mono font-bold">
                          Gs. {Number(formData.budgetGs).toLocaleString('es-PY')}
                        </span>
                      </label>
                      <input
                        type="number"
                        step="5000000"
                        min="40000000"
                        max="800000000"
                        value={formData.budgetGs}
                        onChange={e => setFormData({ ...formData, budgetGs: Number(e.target.value) })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        País de Origen Preferido
                      </label>
                      <select
                        value={formData.preferredCountry}
                        onChange={e => setFormData({ ...formData, preferredCountry: e.target.value })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                      >
                        <option value="Estados Unidos (Miami / Florida)">Estados Unidos (Miami / Florida)</option>
                        <option value="Japón (Subastas oficiales)">Japón (Subastas oficiales)</option>
                        <option value="Corea del Sur (Seúl / Busan)">Corea del Sur (Seúl / Busan)</option>
                        <option value="Alemania / Europa">Alemania / Europa</option>
                        <option value="Chile (Zona Franca Iquique)">Chile (Zona Franca Iquique)</option>
                        <option value="Sin preferencia / Lo que convenga">Sin preferencia / Lo que convenga</option>
                      </select>
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                      Observaciones o Requisitos Específicos
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Deseo que tenga techo solar panorámico, tapizado de cuero y llantas aro 19..."
                      value={formData.comments}
                      onChange={e => setFormData({ ...formData, comments: e.target.value })}
                      className="w-full bg-[#0E1420] text-white text-xs p-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Registrando solicitud en sistema...' : 'Enviar Solicitud de Importación'}</span>
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
