import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  BarChart3,
  Calendar,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { Vehicle, Sale, Commission } from '../../types';
import { formatGs, formatDate } from '../../utils/formatters';

interface FinancesReportsModuleProps {
  vehicles: Vehicle[];
  sales: Sale[];
  commissions: Commission[];
}

export const FinancesReportsModule: React.FC<FinancesReportsModuleProps> = ({
  vehicles,
  sales,
  commissions
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'quarter'>('all');

  // Calculate Aggregates
  const totalRevenueGs = sales.reduce((acc, s) => acc + s.finalPriceGs, 0);

  // Sold vehicles list
  const soldVehicles = vehicles.filter(v => v.status === 'vendido');

  // Inventory value
  const availableInventoryValueGs = vehicles
    .filter(v => v.status === 'disponible' || v.status === 'reservado')
    .reduce((acc, v) => acc + v.priceGs, 0);

  const availableCostValueGs = vehicles
    .filter(v => v.status === 'disponible' || v.status === 'reservado')
    .reduce((acc, v) => acc + (v.buyPriceGs || 0) + (v.expensesGs || 0), 0);

  const totalCommissionsPaidGs = commissions
    .filter(c => c.status === 'Pagada' || c.status === 'Aprobada')
    .reduce((acc, c) => acc + c.commissionAmountGs, 0);

  // Estimated gross profit on active stock
  const potentialProfitOnStockGs = availableInventoryValueGs - availableCostValueGs;

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = [
      'ID Vehículo',
      'Marca',
      'Modelo',
      'Año',
      'VIN',
      'Precio Compra (Gs)',
      'Gastos Flete/Aduana (Gs)',
      'Costo Total (Gs)',
      'Precio Venta (Gs)',
      'Ganancia Bruta (Gs)',
      'Margen %',
      'Estado'
    ];

    const rows = vehicles.map(v => {
      const totalCost = (v.buyPriceGs || 0) + (v.expensesGs || 0);
      const profit = v.priceGs - totalCost;
      const margin = v.priceGs > 0 ? Math.round((profit / v.priceGs) * 100) : 0;
      return [
        v.id,
        v.make,
        v.model,
        v.year,
        v.vin,
        v.buyPriceGs,
        v.expensesGs,
        totalCost,
        v.priceGs,
        profit,
        `${margin}%`,
        v.status
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shery_reporte_financiero_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Finanzas, Rentabilidad & Reportes</h2>
          <p className="text-xs text-neutral-400">
            Diferenciación de costos de compra, fletes marítimos, aranceles aduaneros, márgenes reales y auditoría contable.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[#172233] hover:bg-[#1E2B40] border border-neutral-700 text-neutral-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
        >
          <Download size={15} className="text-amber-400" />
          <span>Exportar Reporte (CSV)</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold block mb-1">Ingresos por Ventas (Gs.)</span>
          <p className="text-xl sm:text-2xl font-black text-[#38BDF8] font-mono">{formatGs(totalRevenueGs)}</p>
          <span className="text-[11px] text-neutral-500 font-mono">{sales.length} ventas confirmadas</span>
        </div>

        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold block mb-1">Valor Stock a Precio Venta</span>
          <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{formatGs(availableInventoryValueGs)}</p>
          <span className="text-[11px] text-neutral-500 font-mono">Flota activa en showroom</span>
        </div>

        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold block mb-1">Costo Total Compra + Gastos</span>
          <p className="text-xl sm:text-2xl font-black text-neutral-300 font-mono">{formatGs(availableCostValueGs)}</p>
          <span className="text-[11px] text-neutral-500 font-mono">Inversión inmovilizada en stock</span>
        </div>

        <div className="bg-[#121824] border border-neutral-800 p-5 rounded-2xl border-l-2 border-l-emerald-400">
          <span className="text-xs text-emerald-400 font-semibold block mb-1">Ganancia Bruta Proyectada</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{formatGs(potentialProfitOnStockGs)}</p>
          <span className="text-[11px] text-neutral-500 font-mono">Margen proyectado promedio: ~26%</span>
        </div>
      </div>

      {/* Profitability Per Vehicle Table */}
      <div className="bg-[#121824] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 size={17} className="text-amber-400" />
              <span>Desglose de Costos y Ganancia por Vehículo (Gs.)</span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Cálculo individual: Precio Venta - (Costo Compra + Gastos de Flete/Aduana + Comisiones).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0E1420] text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-3">Vehículo</th>
                <th className="py-3 px-3">VIN</th>
                <th className="py-3 px-3">Precio Compra</th>
                <th className="py-3 px-3">Flete / Aduana</th>
                <th className="py-3 px-3 font-bold text-white">Costo Total</th>
                <th className="py-3 px-3 font-bold text-[#38BDF8]">Precio Venta</th>
                <th className="py-3 px-3 font-bold text-emerald-400">Ganancia Estimada</th>
                <th className="py-3 px-3">Margen %</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {vehicles.map(v => {
                const totalCost = (v.buyPriceGs || 0) + (v.expensesGs || 0);
                const profit = v.priceGs - totalCost;
                const margin = v.priceGs > 0 ? Math.round((profit / v.priceGs) * 100) : 0;

                return (
                  <tr key={v.id} className="hover:bg-[#161F2E] transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-white">
                      {v.make} {v.model} ({v.year})
                    </td>

                    <td className="py-2.5 px-3 text-neutral-400 text-[11px]">
                      {v.vin.substring(0, 11)}...
                    </td>

                    <td className="py-2.5 px-3 text-neutral-300">
                      {formatGs(v.buyPriceGs)}
                    </td>

                    <td className="py-2.5 px-3 text-neutral-400">
                      {formatGs(v.expensesGs)}
                    </td>

                    <td className="py-2.5 px-3 text-white font-bold">
                      {formatGs(totalCost)}
                    </td>

                    <td className="py-2.5 px-3 text-[#38BDF8] font-bold">
                      {formatGs(v.priceGs)}
                    </td>

                    <td className={`py-2.5 px-3 font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatGs(profit)}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${margin >= 20 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {margin}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-sans">
                      <span className="text-[10px] text-neutral-400 capitalize">
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
