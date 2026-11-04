import React, { useState } from 'react';
import { Percent, CheckCircle2, DollarSign, Clock, ShieldCheck, Filter } from 'lucide-react';
import { Commission, Seller, UserRole } from '../../types';
import { formatGs, formatDate, formatDateTime } from '../../utils/formatters';
import { updateCommissionStatus, saveSeller } from '../../services/db';

interface CommissionsModuleProps {
  commissions: Commission[];
  sellers: Seller[];
  onRefresh: () => Promise<void>;
  currentRole: UserRole;
}

export const CommissionsModule: React.FC<CommissionsModuleProps> = ({
  commissions,
  sellers,
  onRefresh,
  currentRole
}) => {
  const canManage = currentRole === 'SUPERADMIN' || currentRole === 'GERENTE' || currentRole === 'ADMINISTRADOR';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sellerFilter, setSellerFilter] = useState<string>('all');

  // Seller commission rate config modal
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [newRate, setNewRate] = useState<number>(3.0);

  const filteredCommissions = commissions.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSeller = sellerFilter === 'all' || c.sellerId === sellerFilter;
    return matchesStatus && matchesSeller;
  });

  const totalCommissionsGs = commissions.reduce((acc, c) => acc + c.commissionAmountGs, 0);
  const pendingCommissionsGs = commissions
    .filter(c => c.status === 'Pendiente')
    .reduce((acc, c) => acc + c.commissionAmountGs, 0);
  const paidCommissionsGs = commissions
    .filter(c => c.status === 'Pagada')
    .reduce((acc, c) => acc + c.commissionAmountGs, 0);

  const handleUpdateStatus = async (id: string, newStatus: Commission['status']) => {
    await updateCommissionStatus(id, newStatus);
    await onRefresh();
  };

  const handleSaveRate = async () => {
    if (!editingSeller) return;
    await saveSeller({ ...editingSeller, commissionRate: Number(newRate) });
    await onRefresh();
    setEditingSeller(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Comisiones Porcentuales por Vendedor</h2>
          <p className="text-xs text-neutral-400">
            Cálculo automatizado sobre base de venta, aprobación y registro de liquidación.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold block mb-1">Total Comisiones Generadas</span>
          <p className="text-2xl font-black text-white font-mono">{formatGs(totalCommissionsGs)}</p>
          <span className="text-[11px] text-neutral-500 font-mono">{commissions.length} registros</span>
        </div>

        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl">
          <span className="text-xs text-amber-400 font-semibold block mb-1">Pendientes de Aprobación</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{formatGs(pendingCommissionsGs)}</p>
          <span className="text-[11px] text-neutral-500 font-mono">
            {commissions.filter(c => c.status === 'Pendiente').length} operaciones
          </span>
        </div>

        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl">
          <span className="text-xs text-emerald-400 font-semibold block mb-1">Comisiones Pagadas</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{formatGs(paidCommissionsGs)}</p>
          <span className="text-[11px] text-neutral-500 font-mono">
            {commissions.filter(c => c.status === 'Pagada').length} liquidadas
          </span>
        </div>
      </div>

      {/* Seller Rates Config Strip */}
      {canManage && (
        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Percent size={14} className="text-amber-400" />
              <span>Porcentajes Configurados por Asesor Comercial</span>
            </h3>
            <span className="text-[11px] text-neutral-400">Modalidad acordada: Porcentual individual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sellers.map(s => (
              <div
                key={s.id}
                className="bg-[#0E1420] border border-neutral-800 p-3.5 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{s.name}</h4>
                  <p className="text-neutral-400 text-[11px]">{s.salesCount} ventas registradas</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                    {s.commissionRate}%
                  </span>
                  <button
                    onClick={() => {
                      setEditingSeller(s);
                      setNewRate(s.commissionRate);
                    }}
                    className="text-[11px] text-blue-400 hover:underline font-bold"
                  >
                    Ajustar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter row */}
      <div className="bg-[#121824] border border-neutral-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-neutral-400" />
          <span className="font-bold text-neutral-300">Filtrar Comisiones:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0E1420] text-neutral-300 py-2 px-3 rounded-xl border border-neutral-700"
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Pagada">Pagada</option>
            <option value="Anulada">Anulada</option>
          </select>

          <select
            value={sellerFilter}
            onChange={e => setSellerFilter(e.target.value)}
            className="bg-[#0E1420] text-neutral-300 py-2 px-3 rounded-xl border border-neutral-700"
          >
            <option value="all">Todos los vendedores</option>
            {sellers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-[#121824] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0E1420] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Operación</th>
                <th className="py-3 px-3">Vendedor</th>
                <th className="py-3 px-3">Vehículo</th>
                <th className="py-3 px-3">Precio Venta (Gs.)</th>
                <th className="py-3 px-3">%</th>
                <th className="py-3 px-3">Comisión (Gs.)</th>
                <th className="py-3 px-3">Estado</th>
                {canManage && <th className="py-3 px-4 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No se encontraron comisiones para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCommissions.map(com => (
                  <tr key={com.id} className="hover:bg-[#161F2E] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-300">
                      {com.saleId}
                    </td>

                    <td className="py-3 px-3 font-semibold text-white">
                      {com.sellerName}
                    </td>

                    <td className="py-3 px-3 text-neutral-300">
                      {com.vehicleName}
                    </td>

                    <td className="py-3 px-3 font-mono text-neutral-300">
                      {formatGs(com.salePriceGs)}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-amber-400">
                      {com.percentage}%
                    </td>

                    <td className="py-3 px-3 font-mono font-black text-emerald-400">
                      {formatGs(com.commissionAmountGs)}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          com.status === 'Pagada'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : com.status === 'Aprobada'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : com.status === 'Pendiente'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}
                      >
                        {com.status}
                      </span>
                    </td>

                    {canManage && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {com.status === 'Pendiente' && (
                            <button
                              onClick={() => handleUpdateStatus(com.id, 'Aprobada')}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg transition-colors"
                            >
                              Aprobar
                            </button>
                          )}
                          {com.status === 'Aprobada' && (
                            <button
                              onClick={() => handleUpdateStatus(com.id, 'Pagada')}
                              className="bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-black py-1 px-2.5 rounded-lg transition-colors"
                            >
                              Registrar Pago
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Rate Modal */}
      {editingSeller && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1420] border border-neutral-700 p-6 rounded-2xl max-w-sm w-full space-y-4 text-xs text-white">
            <h3 className="font-bold text-base">Ajustar Porcentaje de Comisión</h3>
            <p className="text-neutral-400">
              Vendedor: <strong className="text-white">{editingSeller.name}</strong>
            </p>

            <div>
              <label className="font-bold text-neutral-400 block mb-1">Porcentaje de Comisión (%)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                value={newRate}
                onChange={e => setNewRate(Number(e.target.value))}
                className="w-full bg-[#141C2A] text-amber-400 font-bold text-base py-2 px-3 rounded-xl border border-neutral-700 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingSeller(null)}
                className="border border-neutral-700 px-3 py-1.5 rounded-lg text-neutral-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRate}
                className="bg-amber-400 text-black font-bold px-4 py-1.5 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
