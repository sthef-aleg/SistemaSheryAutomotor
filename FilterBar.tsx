import React from 'react';
import { Search, Car, Tag, Calendar, Fuel, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { FuelType } from '../../types';

export interface FilterState {
  make: string;
  model: string;
  year: string;
  fuel: string;
  transmission: string;
  maxPrice: number;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableMakes: string[];
  availableModels: string[];
  availableYears: number[];
  availableFuels: FuelType[];
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableMakes,
  availableModels,
  availableYears,
  availableFuels,
  totalResultsCount
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleReset = () => {
    onFilterChange({
      make: '',
      model: '',
      year: '',
      fuel: '',
      transmission: '',
      maxPrice: 0
    });
  };

  const isFiltered = Boolean(
    filters.make || filters.model || filters.year || filters.fuel || filters.transmission || filters.maxPrice > 0
  );

  return (
    <div className="relative -mt-8 sm:-mt-10 max-w-6xl mx-auto px-4 z-30">
      <div className="bg-[#101622]/95 backdrop-blur-xl border border-neutral-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80">
        {/* Main 4 + 1 Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Marca */}
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5 px-1">
              <Car size={13} className="text-amber-400" />
              <span>Marca</span>
            </label>
            <div className="relative">
              <select
                value={filters.make}
                onChange={e => onFilterChange({ ...filters, make: e.target.value, model: '' })}
                className="w-full bg-[#182233] hover:bg-[#1E2B40] text-white text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-neutral-700/70 focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Todas las marcas</option>
                {availableMakes.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Modelo */}
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5 px-1">
              <Tag size={13} className="text-amber-400" />
              <span>Modelo</span>
            </label>
            <div className="relative">
              <select
                value={filters.model}
                onChange={e => onFilterChange({ ...filters, model: e.target.value })}
                className="w-full bg-[#182233] hover:bg-[#1E2B40] text-white text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-neutral-700/70 focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Todos los modelos</option>
                {availableModels.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Año */}
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5 px-1">
              <Calendar size={13} className="text-amber-400" />
              <span>Año</span>
            </label>
            <div className="relative">
              <select
                value={filters.year}
                onChange={e => onFilterChange({ ...filters, year: e.target.value })}
                className="w-full bg-[#182233] hover:bg-[#1E2B40] text-white text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-neutral-700/70 focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Cualquier año</option>
                {availableYears.map(y => (
                  <option key={y} value={y.toString()}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Combustible */}
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5 px-1">
              <Fuel size={13} className="text-amber-400" />
              <span>Combustible</span>
            </label>
            <div className="relative">
              <select
                value={filters.fuel}
                onChange={e => onFilterChange({ ...filters, fuel: e.target.value })}
                className="w-full bg-[#182233] hover:bg-[#1E2B40] text-white text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-neutral-700/70 focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Todos los tipos</option>
                {availableFuels.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col justify-end pt-1 sm:pt-0">
            <button
              onClick={() => {
                const stockSection = document.getElementById('seccion-stock');
                if (stockSection) {
                  stockSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold py-3 px-5 rounded-xl text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Search size={17} />
              <span>Buscar</span>
            </button>
          </div>
        </div>

        {/* Secondary Bar: Active Filters count + Reset + Advanced Toggle */}
        <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Resultados:</span>
            <span className="font-bold text-white bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-md font-mono">
              {totalResultsCount} vehículos
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
            >
              <SlidersHorizontal size={13} />
              <span>{showAdvanced ? 'Ocultar filtros avanzados' : 'Más filtros (Transmisión / Precio)'}</span>
            </button>

            {isFiltered && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <RotateCcw size={12} />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                Transmisión
              </label>
              <select
                value={filters.transmission}
                onChange={e => onFilterChange({ ...filters, transmission: e.target.value })}
                className="w-full bg-[#182233] text-white text-xs py-2 px-3 rounded-lg border border-neutral-700 focus:outline-none"
              >
                <option value="">Cualquier transmisión</option>
                <option value="Automático">Automático</option>
                <option value="Mecánico">Mecánico</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 flex justify-between">
                <span>Precio máximo</span>
                <span className="text-blue-400 font-mono">
                  {filters.maxPrice > 0 ? `Hasta Gs. ${filters.maxPrice.toLocaleString('es-PY')}` : 'Sin límite'}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="300000000"
                step="10000000"
                value={filters.maxPrice}
                onChange={e => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
