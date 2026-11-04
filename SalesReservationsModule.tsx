import React, { useState } from 'react';
import {
  CalendarCheck,
  ShoppingBag,
  Plus,
  CheckCircle2,
  Clock,
  Ban,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { Reservation, Sale, Vehicle, Client, Seller, PaymentMethod, UserRole } from '../../types';
import { formatGs, formatDate } from '../../utils/formatters';
import { createReservation, updateReservationStatus, confirmSale } from '../../services/db';

interface SalesReservationsModuleProps {
  reservations: Reservation[];
  sales: Sale[];
  vehicles: Vehicle[];
  clients: Client[];
  sellers: Seller[];
  onRefresh: () => Promise<void>;
  currentRole: UserRole;
}

export const SalesReservationsModule: React.FC<SalesReservationsModuleProps> = ({
  reservations,
  sales,
  vehicles,
  clients,
  sellers,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'reservas' | 'ventas'>('reservas');

  // Reservation Modal state
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [resForm, setResForm] = useState({
    vehicleId: '',
    clientId: '',
    sellerId: sellers[0]?.id || '',
    downPaymentGs: 10000000,
    expiryDays: 7,
    notes: ''
  });

  // Sale Modal state
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleForm, setSaleForm] = useState<{
    vehicleId: string;
    clientId: string;
    sellerId: string;
    salePriceGs: number;
    discountGs: number;
    finalPriceGs: number;
    downPaymentGs: number;
    paymentMethod: PaymentMethod;
    notes: string;
  }>({
    vehicleId: '',
    clientId: '',
    sellerId: sellers[0]?.id || '',
    salePriceGs: 0,
    discountGs: 0,
    finalPriceGs: 0,
    downPaymentGs: 0,
    paymentMethod: 'Contado',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Available vehicles for reservation or sale (status 'disponible')
  const availableVehicles = vehicles.filter(v => v.status === 'disponible');

  const handleCreateReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.vehicleId || !resForm.clientId) {
      setFeedbackMsg({ type: 'error', text: 'Seleccione vehículo y cliente.' });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    const vehicle = vehicles.find(v => v.id === resForm.vehicleId);
    const client = clients.find(c => c.id === resForm.clientId);
    const seller = sellers.find(s => s.id === resForm.sellerId);

    const expiryDate = new Date(Date.now() + resForm.expiryDays * 86400000)
      .toISOString()
      .split('T')[0];

    const res = await createReservation({
      vehicleId: resForm.vehicleId,
      vehicleName: vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : 'Vehículo',
      clientId: resForm.clientId,
      clientName: client ? client.name : 'Cliente',
      sellerId: resForm.sellerId,
      sellerName: seller ? seller.name : 'Vendedor',
      date: new Date().toISOString().split('T')[0],
      expiryDate,
      downPaymentGs: Number(resForm.downPaymentGs),
      status: 'Confirmada',
      notes: resForm.notes
    });

    setIsSubmitting(false);

    if (res.success) {
      await onRefresh();
      setIsResModalOpen(false);
      setFeedbackMsg({ type: 'success', text: res.message });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  const handleConfirmSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleForm.vehicleId || !saleForm.clientId) {
      setFeedbackMsg({ type: 'error', text: 'Seleccione vehículo y cliente.' });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    const res = await confirmSale(saleForm);

    setIsSubmitting(false);

    if (res.success) {
      await onRefresh();
      setIsSaleModalOpen(false);
      setFeedbackMsg({ type: 'success', text: res.message });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Reservas y Ventas Comerciales</h2>
          <p className="text-xs text-neutral-400">
            Control de señas, vencimientos, prevención de colisiones y liquidación de operaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#121824] p-1 rounded-xl border border-neutral-800 flex text-xs">
            <button
              onClick={() => setActiveTab('reservas')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'reservas' ? 'bg-amber-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Reservas ({reservations.length})
            </button>
            <button
              onClick={() => setActiveTab('ventas')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'ventas' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Ventas Confirmadas ({sales.length})
            </button>
          </div>

          {activeTab === 'reservas' ? (
            <button
              onClick={() => setIsResModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all"
            >
              <Plus size={16} />
              <span>Nueva Reserva</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSaleModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus size={16} />
              <span>Confirmar Venta</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* RESERVAS TAB */}
      {activeTab === 'reservas' && (
        <div className="bg-[#121824] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0E1420] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3.5 px-4">Vehículo</th>
                  <th className="py-3.5 px-3">Cliente</th>
                  <th className="py-3.5 px-3">Asesor</th>
                  <th className="py-3.5 px-3">Seña / Anticipo (Gs.)</th>
                  <th className="py-3.5 px-3">Vencimiento</th>
                  <th className="py-3.5 px-3">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-neutral-500">
                      No hay reservas registradas en el sistema.
                    </td>
                  </tr>
                ) : (
                  reservations.map(res => (
                    <tr key={res.id} className="hover:bg-[#161F2E] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {res.vehicleName}
                      </td>

                      <td className="py-3 px-3 text-neutral-300">
                        {res.clientName}
                      </td>

                      <td className="py-3 px-3 text-neutral-400 text-[11px]">
                        {res.sellerName}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {formatGs(res.downPaymentGs)}
                      </td>

                      <td className="py-3 px-3 font-mono text-neutral-300">
                        {res.expiryDate}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            res.status === 'Confirmada'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : res.status === 'Pendiente'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {res.status === 'Confirmada' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const veh = vehicles.find(v => v.id === res.vehicleId);
                                setSaleForm({
                                  vehicleId: res.vehicleId,
                                  clientId: res.clientId,
                                  sellerId: res.sellerId,
                                  salePriceGs: veh?.priceGs || 0,
                                  discountGs: 0,
                                  finalPriceGs: veh?.priceGs || 0,
                                  downPaymentGs: res.downPaymentGs,
                                  paymentMethod: 'Contado',
                                  notes: `Convertido desde reserva ${res.id}`
                                });
                                setIsSaleModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg transition-colors"
                            >
                              Convertir a Venta
                            </button>

                            <button
                              onClick={() => updateReservationStatus(res.id, 'Cancelada')}
                              title="Cancelar reserva y liberar vehículo"
                              className="text-neutral-400 hover:text-red-400 p-1"
                            >
                              <Ban size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VENTAS TAB */}
      {activeTab === 'ventas' && (
        <div className="bg-[#121824] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0E1420] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3.5 px-4">Operación</th>
                  <th className="py-3.5 px-3">Vehículo</th>
                  <th className="py-3.5 px-3">Cliente</th>
                  <th className="py-3.5 px-3">Precio Final (Gs.)</th>
                  <th className="py-3.5 px-3">Forma de Pago</th>
                  <th className="py-3.5 px-3">Comisión Asesor</th>
                  <th className="py-3.5 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-neutral-500">
                      No hay ventas registradas aún.
                    </td>
                  </tr>
                ) : (
                  sales.map(s => (
                    <tr key={s.id} className="hover:bg-[#161F2E] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {s.id}
                      </td>

                      <td className="py-3 px-3 font-bold text-white">
                        {s.vehicleName}
                      </td>

                      <td className="py-3 px-3 text-neutral-300">
                        {s.clientName}
                      </td>

                      <td className="py-3 px-3 font-mono font-black text-[#38BDF8]">
                        {formatGs(s.finalPriceGs)}
                      </td>

                      <td className="py-3 px-3 text-neutral-300">
                        {s.paymentMethod}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-emerald-400 font-bold block">
                          {formatGs(s.commissionAmountGs)}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {s.sellerName} ({s.commissionPercentage}%)
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-400">
                        {formatDate(s.date)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE RESERVATION MODAL */}
      {isResModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0E1420] border border-neutral-700 rounded-3xl max-w-lg w-full p-6 space-y-4 text-white text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CalendarCheck size={18} className="text-amber-400" />
                <span>Registrar Reserva de Vehículo</span>
              </h3>
              <button onClick={() => setIsResModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReservationSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-neutral-400 block mb-1">Vehículo Disponible *</label>
                <select
                  required
                  value={resForm.vehicleId}
                  onChange={e => setResForm({ ...resForm, vehicleId: e.target.value })}
                  className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                >
                  <option value="">Seleccione vehículo disponible...</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} {v.year} - {formatGs(v.priceGs)}
                    </option>
                  ))}
                </select>
                {availableVehicles.length === 0 && (
                  <p className="text-[11px] text-red-400 mt-1">No hay vehículos en estado disponible para reservar.</p>
                )}
              </div>

              <div>
                <label className="font-bold text-neutral-400 block mb-1">Cliente *</label>
                <select
                  required
                  value={resForm.clientId}
                  onChange={e => setResForm({ ...resForm, clientId: e.target.value })}
                  className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                >
                  <option value="">Seleccione cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Vendedor Asignado</label>
                  <select
                    value={resForm.sellerId}
                    onChange={e => setResForm({ ...resForm, sellerId: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  >
                    {sellers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Vigencia (Días)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={resForm.expiryDays}
                    onChange={e => setResForm({ ...resForm, expiryDays: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-400 block mb-1">Monto de Seña / Anticipo (Gs.) *</label>
                <input
                  type="number"
                  required
                  step="1000000"
                  value={resForm.downPaymentGs}
                  onChange={e => setResForm({ ...resForm, downPaymentGs: Number(e.target.value) })}
                  className="w-full bg-[#141C2A] text-emerald-400 font-bold py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-400 block mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalle de recibo de seña, condiciones..."
                  value={resForm.notes}
                  onChange={e => setResForm({ ...resForm, notes: e.target.value })}
                  className="w-full bg-[#141C2A] text-white p-2.5 rounded-xl border border-neutral-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsResModalOpen(false)}
                  className="border border-neutral-700 py-2 px-4 rounded-xl text-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || availableVehicles.length === 0}
                  className="bg-amber-400 text-black font-extrabold py-2 px-5 rounded-xl disabled:opacity-50"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM SALE MODAL */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0E1420] border border-neutral-700 rounded-3xl max-w-xl w-full p-6 space-y-4 text-white text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag size={18} className="text-blue-400" />
                <span>Confirmar Venta y Generar Comisión</span>
              </h3>
              <button onClick={() => setIsSaleModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmSaleSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-neutral-400 block mb-1">Vehículo a Vender *</label>
                <select
                  required
                  value={saleForm.vehicleId}
                  onChange={e => {
                    const veh = vehicles.find(v => v.id === e.target.value);
                    const price = veh?.priceGs || 0;
                    setSaleForm({
                      ...saleForm,
                      vehicleId: e.target.value,
                      salePriceGs: price,
                      finalPriceGs: price - saleForm.discountGs,
                      downPaymentGs: price - saleForm.discountGs
                    });
                  }}
                  className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                >
                  <option value="">Seleccione vehículo...</option>
                  {vehicles.filter(v => v.status !== 'vendido').map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} {v.year} - {formatGs(v.priceGs)} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Cliente Comprador *</label>
                  <select
                    required
                    value={saleForm.clientId}
                    onChange={e => setSaleForm({ ...saleForm, clientId: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  >
                    <option value="">Seleccione cliente...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Vendedor Responsable</label>
                  <select
                    value={saleForm.sellerId}
                    onChange={e => setSaleForm({ ...saleForm, sellerId: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  >
                    {sellers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.commissionRate}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Precio de Lista (Gs.)</label>
                  <input
                    type="number"
                    value={saleForm.salePriceGs}
                    onChange={e => {
                      const p = Number(e.target.value);
                      setSaleForm({ ...saleForm, salePriceGs: p, finalPriceGs: p - saleForm.discountGs });
                    }}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Descuento Autorizado (Gs.)</label>
                  <input
                    type="number"
                    value={saleForm.discountGs}
                    onChange={e => {
                      const d = Number(e.target.value);
                      setSaleForm({ ...saleForm, discountGs: d, finalPriceGs: saleForm.salePriceGs - d });
                    }}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#141C2A] p-3 rounded-xl border border-neutral-800">
                <div>
                  <label className="font-bold text-blue-400 block mb-1 uppercase">Precio Final Cerrado (Gs.) *</label>
                  <input
                    type="number"
                    required
                    value={saleForm.finalPriceGs}
                    onChange={e => setSaleForm({ ...saleForm, finalPriceGs: Number(e.target.value) })}
                    className="w-full bg-[#0E1420] text-blue-300 font-black py-2 px-3 rounded-xl border border-blue-500/40 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Forma de Pago</label>
                  <select
                    value={saleForm.paymentMethod}
                    onChange={e => setSaleForm({ ...saleForm, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  >
                    <option value="Contado">Contado</option>
                    <option value="Financiado Propio">Financiado Propio</option>
                    <option value="Financiado Bancario">Financiado Bancario</option>
                    <option value="Entrega + Cuotas">Entrega + Cuotas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-400 block mb-1">Observaciones de Entrega & Factura</label>
                <textarea
                  rows={2}
                  placeholder="Número de factura, transferencia bancaria, fecha de entrega pactada..."
                  value={saleForm.notes}
                  onChange={e => setSaleForm({ ...saleForm, notes: e.target.value })}
                  className="w-full bg-[#141C2A] text-white p-2.5 rounded-xl border border-neutral-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSaleModalOpen(false)}
                  className="border border-neutral-700 py-2 px-4 rounded-xl text-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2 px-5 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
