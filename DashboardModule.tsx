import React from 'react';
import {
  Car,
  CheckCircle,
  CalendarCheck,
  ShoppingBag,
  Users,
  Compass,
  DollarSign,
  TrendingUp,
  Percent,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { Vehicle, Client, Sale, Reservation, ImportRequest, Commission, UserRole } from '../../types';
import { formatGs } from '../../utils/formatters';

interface DashboardModuleProps {
  vehicles: Vehicle[];
  clients: Client[];
  sales: Sale[];
  reservations: Reservation[];
  importRequests: ImportRequest[];
  commissions: Commission[];
  currentRole: UserRole;
  onNavigateModule: (mod: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  vehicles,
  clients,
  sales,
  reservations,
  importRequests,
  commissions,
  currentRole,
  onNavigateModule
}) => {
  const isSeller = currentRole === 'VENDEDOR';
  const isMarketing = currentRole === 'MARKETING';

  // Metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'disponible').length;
  const reservedVehicles = vehicles.filter(v => v.status === 'reservado').length;
  const soldVehicles = vehicles.filter(v => v.status === 'vendido').length;
  const inPreparation = vehicles.filter(v => v.status === 'en_preparacion').length;

  const totalClients = clients.length;
  const activeImports = importRequests.filter(r => r.status === 'Activa').length;

  const totalSalesRevenueGs = sales.reduce((acc, s) => acc + s.finalPriceGs, 0);
  const pendingCommissionsGs = commissions
    .filter(c => c.status === 'Pendiente')
    .reduce((acc, c) => acc + c.commissionAmountGs, 0);

  // Group by Make
  const makeCounts: Record<string, number> = {};
  vehicles.forEach(v => {
    makeCounts[v.make] = (makeCounts[v.make] || 0) + 1;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1420] border border-neutral-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            Resumen General de Operaciones
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Panel de Control · Shery Automotores
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Indicadores en tiempo real sincronizados con la base de datos de Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateModule('inventario')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
          >
            <Plus size={16} />
            <span>Nuevo Vehículo</span>
          </button>

          {!isMarketing && (
            <button
              onClick={() => onNavigateModule('crm')}
              className="flex items-center gap-1.5 bg-[#172233] hover:bg-[#1E2C42] border border-neutral-700 text-neutral-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              <Users size={15} />
              <span>Nuevo Cliente</span>
            </button>
          )}

          {!isMarketing && (
            <button
              onClick={() => onNavigateModule('reservas')}
              className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              <CalendarCheck size={15} />
              <span>Registrar Reserva</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <div
          onClick={() => onNavigateModule('inventario')}
          className="bg-[#121824] border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl cursor-pointer transition-all hover:bg-[#151D2C] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-semibold">Total Vehículos</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Car size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">{totalVehicles}</p>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{availableVehicles} disp.</span>
            <span>·</span>
            <span className="text-amber-400 font-bold">{reservedVehicles} res.</span>
          </div>
        </div>

        {/* Solicitudes de Importación */}
        <div
          onClick={() => onNavigateModule('importaciones')}
          className="bg-[#121824] border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl cursor-pointer transition-all hover:bg-[#151D2C] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-semibold">Importaciones por Pedido</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Compass size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{activeImports}</p>
          <p className="mt-2 text-[11px] text-neutral-400">Solicitudes activas en seguimiento</p>
        </div>

        {/* Clientes CRM */}
        <div
          onClick={() => onNavigateModule('crm')}
          className="bg-[#121824] border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl cursor-pointer transition-all hover:bg-[#151D2C] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-semibold">Clientes en CRM</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">{totalClients}</p>
          <p className="mt-2 text-[11px] text-neutral-400">Prospectos y compradores</p>
        </div>

        {/* Ventas o Comisiones según rol */}
        <div
          onClick={() => onNavigateModule(!isSeller ? 'finanzas' : 'comisiones')}
          className="bg-[#121824] border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl cursor-pointer transition-all hover:bg-[#151D2C] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400 font-semibold">
              {!isSeller ? 'Ingresos por Ventas' : 'Comisiones Pendientes'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#007BFF]/10 text-[#38BDF8] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#38BDF8] font-mono truncate">
            {!isSeller ? formatGs(totalSalesRevenueGs) : formatGs(pendingCommissionsGs)}
          </p>
          <p className="mt-2 text-[11px] text-neutral-400">
            {!isSeller ? `${sales.length} operaciones confirmadas` : 'Aprobación sujeta a gerencia'}
          </p>
        </div>
      </div>

      {/* Secondary Status Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fleet Distribution by Status (6 cols) */}
        <div className="lg:col-span-6 bg-[#121824] border border-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Estado de la Flota e Inventario</h3>
            <span className="text-xs text-neutral-500 font-mono">{totalVehicles} unidades</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Disponibles en Catálogo
                </span>
                <span className="font-mono text-white font-bold">
                  {availableVehicles} ({Math.round((availableVehicles / (totalVehicles || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${(availableVehicles / (totalVehicles || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Reservados con Seña
                </span>
                <span className="font-mono text-white font-bold">
                  {reservedVehicles} ({Math.round((reservedVehicles / (totalVehicles || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${(reservedVehicles / (totalVehicles || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Vendidos y Entregados
                </span>
                <span className="font-mono text-white font-bold">
                  {soldVehicles} ({Math.round((soldVehicles / (totalVehicles || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(soldVehicles / (totalVehicles || 1)) * 100}%` }}
                />
              </div>
            </div>

            {inPreparation > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    En Preparación / Taller
                  </span>
                  <span className="font-mono text-white font-bold">{inPreparation}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-neutral-500 rounded-full"
                    style={{ width: `${(inPreparation / (totalVehicles || 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vehicles by Make (6 cols) */}
        <div className="lg:col-span-6 bg-[#121824] border border-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Vehículos por Marca</h3>
            <button
              onClick={() => onNavigateModule('inventario')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(makeCounts).map(([make, count]) => (
              <div
                key={make}
                className="bg-[#0E1420] border border-neutral-800/80 p-3 rounded-xl flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-neutral-300">{make}</span>
                <span className="text-xs font-black text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded-md">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Import Requests & Reservations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Import Requests (6 cols) */}
        <div className="lg:col-span-6 bg-[#121824] border border-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass size={16} className="text-amber-400" />
              <span>Últimos Pedidos de Importación</span>
            </h3>
            <button
              onClick={() => onNavigateModule('importaciones')}
              className="text-xs text-blue-400 hover:underline"
            >
              Ver todas ({importRequests.length})
            </button>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {importRequests.slice(0, 4).map(req => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">{req.requestCode}</span>
                    <span className="font-semibold text-white">{req.clientName}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    {req.desiredMake} {req.desiredModel} · Presupuesto: {formatGs(req.budgetGs)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full block mb-0.5">
                    Etapa {req.stage}/13
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">{req.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Active Reservations (6 cols) */}
        <div className="lg:col-span-6 bg-[#121824] border border-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarCheck size={16} className="text-emerald-400" />
              <span>Reservas Vigentes</span>
            </h3>
            <button
              onClick={() => onNavigateModule('reservas')}
              className="text-xs text-blue-400 hover:underline"
            >
              Ver todas ({reservations.length})
            </button>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {reservations.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">No hay reservas activas en este momento.</p>
            ) : (
              reservations.slice(0, 4).map(res => (
                <div key={res.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-white">{res.vehicleName}</h4>
                    <p className="text-neutral-400 text-[11px]">
                      Cliente: {res.clientName} · Vence: {res.expiryDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono font-bold block">
                      {formatGs(res.downPaymentGs)}
                    </span>
                    <span className="text-[10px] text-neutral-400">{res.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
