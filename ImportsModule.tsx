import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  ShieldCheck,
  Ship,
  Eye,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';
import { ImportRequest, ImportStage, ImportQuotation, Seller } from '../../types';
import { formatGs, formatDate, formatDateTime } from '../../utils/formatters';
import { updateImportRequest, createImportRequest, saveVehicle } from '../../services/db';

interface ImportsModuleProps {
  importRequests: ImportRequest[];
  sellers: Seller[];
  onRefresh: () => Promise<void>;
}

export const STAGES_CONFIG: { stage: ImportStage; title: string; desc: string }[] = [
  { stage: 1, title: '1. Solicitud Recibida', desc: 'Datos del cliente y especificaciones cargadas.' },
  { stage: 2, title: '2. Búsqueda Activa', desc: 'Rastreo en subastas y concesionarias del exterior.' },
  { stage: 3, title: '3. Vehículo Encontrado', desc: 'Opciones preseleccionadas con reporte técnico Carfax/origen.' },
  { stage: 4, title: '4. Cotización Preparada', desc: 'Desglose de costos: compra, flete, aduana y honorarios.' },
  { stage: 5, title: '5. Cotización Enviada', desc: 'Propuesta formal presentada al cliente con plazo de vigencia.' },
  { stage: 6, title: '6. Cotización Aceptada', desc: 'Cliente acepta los términos y condiciones de importación.' },
  { stage: 7, title: '7. Anticipo Solicitado', desc: 'Solicitud formal del 30% de seña para autorizar compra.' },
  { stage: 8, title: '8. Anticipo Confirmado', desc: '¡Pago de seña verificado! Autorización de compra liberada.' },
  { stage: 9, title: '9. Compra Realizada', desc: 'Vehículo adquirido formalmente a nombre de Shery Automotores.' },
  { stage: 10, title: '10. En Tránsito Marítimo/Terrestre', desc: 'Embarque con número de contenedor y tracking en ruta.' },
  { stage: 11, title: '11. Llegada a Paraguay', desc: 'Arribo a puerto / aduana nacional para liquidación.' },
  { stage: 12, title: '12. Inspección & Despacho', desc: 'Verificación técnica en Asunción y pago de aranceles.' },
  { stage: 13, title: '13. Entregado al Cliente', desc: 'Vehículo transferido con cédula verde y entrega llave en mano.' }
];

export const ImportsModule: React.FC<ImportsModuleProps> = ({
  importRequests,
  sellers,
  onRefresh
}) => {
  const [selectedRequest, setSelectedRequest] = useState<ImportRequest | null>(
    importRequests[0] || null
  );

  // Quotation editor modal
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [quotationForm, setQuotationForm] = useState<ImportQuotation>({
    vehicleEstimatedPriceGs: 180000000,
    transportCostGs: 22000000,
    importTaxesGs: 42000000,
    otherCostsGs: 8000000,
    serviceFeeGs: 20000000,
    totalEstimatedGs: 272000000,
    advanceRequiredGs: 81600000,
    validityDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    commercialTerms: 'Tiempo estimado de arribo a Asunción: 45 a 60 días tras confirmación de compra.',
    clientAccepted: false,
    advanceConfirmed: false
  });

  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState<Partial<ImportRequest>>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    desiredMake: 'Toyota',
    desiredModel: 'Hilux',
    desiredYearRange: '2022 - 2024',
    budgetGs: 180000000,
    preferredCountry: 'Estados Unidos',
    assignedSellerId: sellers[0]?.id || ''
  });

  // Advance to next stage handler
  const handleAdvanceStage = async (req: ImportRequest, nextStage: ImportStage) => {
    // If moving to stage 9 (Compra realizada), enforce that advance is confirmed (Stage 8)
    if (nextStage >= 9 && (!req.quotation || !req.quotation.advanceConfirmed)) {
      alert('REGLA COMERCIAL ESTRICTA: No se puede autorizar la compra sin que el anticipo/seña haya sido confirmado formalmente.');
      return;
    }

    const updated = {
      ...req,
      stage: nextStage,
      status: nextStage === 13 ? ('Completada' as const) : req.status
    };

    await updateImportRequest(updated);
    await onRefresh();
    setSelectedRequest(updated);
  };

  // Confirm quotation saving
  const handleSaveQuotation = async () => {
    if (!selectedRequest) return;
    const total =
      Number(quotationForm.vehicleEstimatedPriceGs) +
      Number(quotationForm.transportCostGs) +
      Number(quotationForm.importTaxesGs) +
      Number(quotationForm.otherCostsGs) +
      Number(quotationForm.serviceFeeGs);

    const advance = Math.round(total * 0.3); // 30% advance standard

    const updatedQuotation: ImportQuotation = {
      ...quotationForm,
      totalEstimatedGs: total,
      advanceRequiredGs: advance
    };

    const nextStage = selectedRequest.stage < 4 ? 4 : selectedRequest.stage;

    const updatedRequest: ImportRequest = {
      ...selectedRequest,
      quotation: updatedQuotation,
      stage: nextStage as ImportStage
    };

    await updateImportRequest(updatedRequest);
    await onRefresh();
    setSelectedRequest(updatedRequest);
    setIsQuotationModalOpen(false);
  };

  // Client accepts quotation action
  const handleClientAcceptQuotation = async () => {
    if (!selectedRequest || !selectedRequest.quotation) return;

    const updated: ImportRequest = {
      ...selectedRequest,
      stage: 6, // Cotización aceptada
      quotation: {
        ...selectedRequest.quotation,
        clientAccepted: true,
        clientAcceptedDate: new Date().toISOString()
      }
    };

    await updateImportRequest(updated);
    await onRefresh();
    setSelectedRequest(updated);
  };

  // Confirm Advance payment (Allows proceeding to buy)
  const handleConfirmAdvance = async () => {
    if (!selectedRequest || !selectedRequest.quotation) return;

    const updated: ImportRequest = {
      ...selectedRequest,
      stage: 8, // Anticipo confirmado
      quotation: {
        ...selectedRequest.quotation,
        advanceConfirmed: true,
        advanceConfirmedDate: new Date().toISOString()
      }
    };

    await updateImportRequest(updated);
    await onRefresh();
    setSelectedRequest(updated);
  };

  // Incorporate to public vehicle inventory once delivered
  const handleIncorporateToInventory = async (req: ImportRequest) => {
    if (window.confirm(`¿Deseas dar de alta este vehículo (${req.desiredMake} ${req.desiredModel}) en el inventario general?`)) {
      const price = req.quotation?.totalEstimatedGs || req.budgetGs;
      await saveVehicle({
        vin: 'IMP-' + Math.floor(10000000 + Math.random() * 90000000),
        make: req.desiredMake,
        model: req.desiredModel,
        version: req.desiredVersion || 'Importado por Pedido',
        year: 2022,
        km: 30000,
        fuel: 'Nafta',
        transmission: 'Automático',
        color: req.desiredColor || 'Blanco',
        priceGs: price,
        buyPriceGs: req.quotation?.vehicleEstimatedPriceGs || Math.round(price * 0.75),
        expensesGs: (req.quotation?.transportCostGs || 0) + (req.quotation?.importTaxesGs || 0),
        status: 'vendido', // Already client-owned
        published: false,
        location: 'Entregado al cliente ' + req.clientName,
        description: `Vehículo importado bajo pedido oficial ${req.requestCode} para el cliente ${req.clientName}.`
      });

      const updated = { ...req, stage: 13 as ImportStage, status: 'Completada' as const };
      await updateImportRequest(updated);
      await onRefresh();
      setSelectedRequest(updated);
      alert('Vehículo incorporado al inventario con éxito como venta entregada.');
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestForm.clientName || !newRequestForm.clientPhone) return;

    const assignedSeller = sellers.find(s => s.id === newRequestForm.assignedSellerId);

    const created = await createImportRequest({
      ...newRequestForm,
      assignedSellerName: assignedSeller ? assignedSeller.name : 'Asesor'
    });

    await onRefresh();
    setSelectedRequest(created);
    setIsNewRequestModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Importaciones por Pedido</h2>
          <p className="text-xs text-neutral-400">
            Seguimiento visual del ciclo de importación de 13 etapas, cotizador y control de anticipos.
          </p>
        </div>

        <button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Nueva Solicitud Manual</span>
        </button>
      </div>

      {/* Main Grid: Requests List (4 cols) + 13-Stage Visual Tracker & Details (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Requests List (4 cols) */}
        <div className="lg:col-span-4 bg-[#121824] border border-neutral-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Solicitudes ({importRequests.length})
            </span>
            <span className="text-[11px] text-amber-400 font-mono font-bold">
              {importRequests.filter(r => r.status === 'Activa').length} Activas
            </span>
          </div>

          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {importRequests.map(req => {
              const isSelected = selectedRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#182335] border-amber-400/80 shadow-md'
                      : 'bg-[#0E1420] border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-black text-amber-400">{req.requestCode}</span>
                    <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      Etapa {req.stage}/13
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs leading-snug">
                    {req.desiredMake} {req.desiredModel}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate">Cliente: {req.clientName}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-400">
                    <span className="font-mono font-bold text-neutral-300">
                      {formatGs(req.quotation?.totalEstimatedGs || req.budgetGs)}
                    </span>
                    <span>{formatDate(req.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Request 13-Stage Tracker & Actions (8 cols) */}
        <div className="lg:col-span-8 bg-[#121824] border border-neutral-800 rounded-2xl p-6 space-y-6">
          {selectedRequest ? (
            <>
              {/* Selected Request Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs bg-amber-400 text-black font-extrabold px-2.5 py-0.5 rounded">
                      {selectedRequest.requestCode}
                    </span>
                    <h3 className="text-xl font-black text-white">
                      {selectedRequest.desiredMake} {selectedRequest.desiredModel}{' '}
                      <span className="text-neutral-400 font-normal text-sm">
                        ({selectedRequest.desiredYearRange})
                      </span>
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Cliente: <strong className="text-white">{selectedRequest.clientName}</strong> · Tel: {selectedRequest.clientPhone} · Asesor: {selectedRequest.assignedSellerName || 'Sin asignar'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (selectedRequest.quotation) {
                        setQuotationForm(selectedRequest.quotation);
                      }
                      setIsQuotationModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
                  >
                    <FileText size={14} />
                    <span>{selectedRequest.quotation ? 'Editar Cotización' : 'Preparar Cotización'}</span>
                  </button>
                </div>
              </div>

              {/* 13-STAGE VISUAL PROGRESS TRACKER */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Compass size={14} className="text-amber-400" />
                    <span>Flujo Comercial de Importación (13 Etapas)</span>
                  </h4>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    Etapa Actual: {selectedRequest.stage} de 13
                  </span>
                </div>

                {/* Stepper Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {STAGES_CONFIG.map(st => {
                    const isCompleted = selectedRequest.stage > st.stage;
                    const isCurrent = selectedRequest.stage === st.stage;

                    return (
                      <div
                        key={st.stage}
                        className={`p-2.5 rounded-xl border text-xs transition-all relative ${
                          isCurrent
                            ? 'bg-amber-400/15 border-amber-400 text-white font-bold ring-1 ring-amber-400'
                            : isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-neutral-200'
                            : 'bg-[#0E1420] border-neutral-800 text-neutral-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-mono font-bold">
                            {isCompleted ? '✓ ' : ''}{st.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-normal leading-tight">
                          {st.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Stage Action Controls */}
                <div className="bg-[#0E1420] p-4 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-400">Acción sugerida:</span>
                    <strong className="text-white">
                      {STAGES_CONFIG.find(s => s.stage === selectedRequest.stage)?.title}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedRequest.stage < 13 && (
                      <button
                        onClick={() => handleAdvanceStage(selectedRequest, (selectedRequest.stage + 1) as ImportStage)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        <span>Avanzar a Etapa {selectedRequest.stage + 1}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}

                    {selectedRequest.stage === 12 && (
                      <button
                        onClick={() => handleIncorporateToInventory(selectedRequest)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs px-4 py-2 rounded-xl"
                      >
                        Finalizar e Incorporar al Inventario
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quotation Breakdown Box */}
              {selectedRequest.quotation ? (
                <div className="bg-[#141C2A] border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Cotización Oficial Desglosada</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedRequest.quotation.clientAccepted ? (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          ✓ Cotización Aceptada
                        </span>
                      ) : (
                        <button
                          onClick={handleClientAcceptQuotation}
                          className="bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold px-3 py-1 rounded-lg border border-blue-500/40"
                        >
                          Marcar como Aceptada
                        </button>
                      )}

                      {selectedRequest.quotation.advanceConfirmed ? (
                        <span className="bg-amber-400/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                          ✓ Anticipo Confirmado (Compra Liberada)
                        </span>
                      ) : (
                        <button
                          onClick={handleConfirmAdvance}
                          className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold px-3 py-1 rounded-lg"
                        >
                          Confirmar Anticipo Seña
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Financial items */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Vehículo en Origen</span>
                      <span className="font-mono font-bold text-white">
                        {formatGs(selectedRequest.quotation.vehicleEstimatedPriceGs)}
                      </span>
                    </div>

                    <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Flete y Seguro</span>
                      <span className="font-mono font-bold text-white">
                        {formatGs(selectedRequest.quotation.transportCostGs)}
                      </span>
                    </div>

                    <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Despacho & Aduanas</span>
                      <span className="font-mono font-bold text-white">
                        {formatGs(selectedRequest.quotation.importTaxesGs)}
                      </span>
                    </div>

                    <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Honorarios de Servicio</span>
                      <span className="font-mono font-bold text-white">
                        {formatGs(selectedRequest.quotation.serviceFeeGs)}
                      </span>
                    </div>

                    <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Anticipo Requerido (30%)</span>
                      <span className="font-mono font-bold text-amber-400">
                        {formatGs(selectedRequest.quotation.advanceRequiredGs)}
                      </span>
                    </div>

                    <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800 border-l-2 border-l-blue-400">
                      <span className="text-[10px] text-blue-400 uppercase block mb-0.5 font-bold">Total Cotizado</span>
                      <span className="font-mono font-black text-base text-blue-300">
                        {formatGs(selectedRequest.quotation.totalEstimatedGs)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 italic">
                    {selectedRequest.quotation.commercialTerms}
                  </p>
                </div>
              ) : (
                <div className="bg-[#141C2A] border border-dashed border-neutral-700 p-6 rounded-2xl text-center space-y-3">
                  <AlertCircle size={28} className="text-amber-400 mx-auto" />
                  <p className="text-sm text-neutral-300 font-bold">Esta solicitud aún no cuenta con cotización desglosada.</p>
                  <button
                    onClick={() => setIsQuotationModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-5 rounded-xl transition-colors"
                  >
                    Preparar Cotización de Costos
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-neutral-500 py-20 text-xs">
              Selecciona una solicitud para visualizar el seguimiento de 13 etapas y cotizaciones.
            </p>
          )}
        </div>
      </div>

      {/* QUOTATION PREPARATION MODAL */}
      {isQuotationModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0E1420] border border-neutral-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold">Preparar Cotización · {selectedRequest.requestCode}</h3>
              <button onClick={() => setIsQuotationModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Precio Estimado en Origen (Gs.) *</label>
                  <input
                    type="number"
                    step="5000000"
                    value={quotationForm.vehicleEstimatedPriceGs}
                    onChange={e => setQuotationForm({ ...quotationForm, vehicleEstimatedPriceGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Costo de Transporte y Flete (Gs.) *</label>
                  <input
                    type="number"
                    step="1000000"
                    value={quotationForm.transportCostGs}
                    onChange={e => setQuotationForm({ ...quotationForm, transportCostGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Despacho & Aranceles (Gs.)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={quotationForm.importTaxesGs}
                    onChange={e => setQuotationForm({ ...quotationForm, importTaxesGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Otros Gastos y Trámites (Gs.)</label>
                  <input
                    type="number"
                    step="500000"
                    value={quotationForm.otherCostsGs}
                    onChange={e => setQuotationForm({ ...quotationForm, otherCostsGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Honorarios Shery (Gs.)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={quotationForm.serviceFeeGs}
                    onChange={e => setQuotationForm({ ...quotationForm, serviceFeeGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-400 block mb-1">Condiciones Comerciales y Plazos</label>
                <textarea
                  rows={2}
                  value={quotationForm.commercialTerms}
                  onChange={e => setQuotationForm({ ...quotationForm, commercialTerms: e.target.value })}
                  className="w-full bg-[#141C2A] text-white p-2.5 rounded-xl border border-neutral-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="border border-neutral-700 text-neutral-300 py-2 px-4 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuotation}
                  className="bg-amber-400 text-black font-extrabold py-2 px-6 rounded-xl"
                >
                  Guardar Cotización
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW REQUEST MODAL */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0E1420] border border-neutral-700 rounded-3xl max-w-xl w-full p-6 space-y-4 text-white text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold">Cargar Solicitud de Importación</h3>
              <button onClick={() => setIsNewRequestModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={newRequestForm.clientName || ''}
                    onChange={e => setNewRequestForm({ ...newRequestForm, clientName: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={newRequestForm.clientPhone || ''}
                    onChange={e => setNewRequestForm({ ...newRequestForm, clientPhone: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Marca Deseada *</label>
                  <input
                    type="text"
                    required
                    value={newRequestForm.desiredMake || ''}
                    onChange={e => setNewRequestForm({ ...newRequestForm, desiredMake: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Modelo Deseado *</label>
                  <input
                    type="text"
                    required
                    value={newRequestForm.desiredModel || ''}
                    onChange={e => setNewRequestForm({ ...newRequestForm, desiredModel: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Presupuesto (Gs.)</label>
                  <input
                    type="number"
                    step="5000000"
                    value={newRequestForm.budgetGs || 0}
                    onChange={e => setNewRequestForm({ ...newRequestForm, budgetGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Asesor Responsable</label>
                  <select
                    value={newRequestForm.assignedSellerId || ''}
                    onChange={e => setNewRequestForm({ ...newRequestForm, assignedSellerId: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                  >
                    {sellers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="border border-neutral-700 text-neutral-300 py-2 px-4 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 text-black font-extrabold py-2 px-5 rounded-xl"
                >
                  Registrar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
