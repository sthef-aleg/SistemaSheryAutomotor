import React, { useState } from 'react';
import { UserCheck, Plus, Edit2, Phone, Mail, Award, TrendingUp, X } from 'lucide-react';
import { Seller, UserRole } from '../../types';
import { formatGs } from '../../utils/formatters';
import { saveSeller } from '../../services/db';

interface SellersModuleProps {
  sellers: Seller[];
  onRefresh: () => Promise<void>;
  currentRole: UserRole;
}

export const SellersModule: React.FC<SellersModuleProps> = ({
  sellers,
  onRefresh,
  currentRole
}) => {
  const canManage = currentRole === 'SUPERADMIN' || currentRole === 'GERENTE';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Partial<Seller>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingSeller({
      name: '',
      email: '',
      phone: '',
      active: true,
      commissionRate: 3.0,
      salesCount: 0,
      totalSoldGs: 0,
      targetGs: 800000000
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Seller) => {
    setEditingSeller({ ...s });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeller.name || !editingSeller.email) return;

    setIsSaving(true);
    try {
      await saveSeller(editingSeller);
      await onRefresh();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Equipo Comercial de Vendedores</h2>
          <p className="text-xs text-neutral-400">
            Control de asesores, porcentajes de comisión individual, metas comerciales y rendimiento.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Nuevo Vendedor</span>
          </button>
        )}
      </div>

      {/* Sellers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sellers.map(seller => {
          const progressPercent = Math.min(
            100,
            Math.round((seller.totalSoldGs / (seller.targetGs || 1)) * 100)
          );

          return (
            <div
              key={seller.id}
              className="bg-[#121824] border border-neutral-800 rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition-colors shadow-xl relative"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">{seller.name}</h3>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        seller.active ? 'bg-emerald-400' : 'bg-neutral-600'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{seller.email}</p>
                  <p className="text-xs text-neutral-400 font-mono">{seller.phone}</p>
                </div>

                {canManage && (
                  <button
                    onClick={() => handleOpenEdit(seller)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  >
                    <Edit2 size={13} />
                  </button>
                )}
              </div>

              {/* Commission Rate Badge */}
              <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">Comisión pactada:</span>
                <span className="font-mono font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/25">
                  {seller.commissionRate}% por venta
                </span>
              </div>

              {/* Sales Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase block mb-0.5">Operaciones</span>
                  <span className="font-mono font-black text-white text-base">{seller.salesCount}</span>
                </div>

                <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase block mb-0.5">Total Vendido</span>
                  <span className="font-mono font-black text-blue-400 text-xs truncate block">
                    {formatGs(seller.totalSoldGs)}
                  </span>
                </div>
              </div>

              {/* Progress towards target */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400">Meta: {formatGs(seller.targetGs)}</span>
                  <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1420] border border-neutral-700 p-6 rounded-2xl max-w-md w-full space-y-4 text-xs text-white">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-base">
                {editingSeller.id ? 'Editar Vendedor' : 'Registrar Nuevo Asesor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-neutral-400 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editingSeller.name || ''}
                  onChange={e => setEditingSeller({ ...editingSeller, name: e.target.value })}
                  className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-400 block mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={editingSeller.email || ''}
                  onChange={e => setEditingSeller({ ...editingSeller, email: e.target.value })}
                  className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-400 block mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={editingSeller.phone || ''}
                  onChange={e => setEditingSeller({ ...editingSeller, phone: e.target.value })}
                  className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Comisión % *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="15"
                    required
                    value={editingSeller.commissionRate || 3.0}
                    onChange={e => setEditingSeller({ ...editingSeller, commissionRate: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-amber-400 font-bold py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Meta Mensual (Gs.)</label>
                  <input
                    type="number"
                    step="50000000"
                    value={editingSeller.targetGs || 800000000}
                    onChange={e => setEditingSeller({ ...editingSeller, targetGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeSeller"
                  checked={editingSeller.active !== false}
                  onChange={e => setEditingSeller({ ...editingSeller, active: e.target.checked })}
                  className="accent-amber-400"
                />
                <label htmlFor="activeSeller" className="text-neutral-300">
                  Asesor activo (habilitado para asignar clientes)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-neutral-700 py-1.5 px-3 rounded-lg text-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-400 text-black font-bold py-1.5 px-4 rounded-lg disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
