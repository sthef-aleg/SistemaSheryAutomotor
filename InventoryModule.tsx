import React, { useState } from 'react';
import {
  Car,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload
} from 'lucide-react';
import { Vehicle, VehicleStatus, FuelType, TransmissionType, UserRole } from '../../types';
import { formatGs, formatKm } from '../../utils/formatters';
import { saveVehicle, deleteVehicle } from '../../services/db';

interface InventoryModuleProps {
  vehicles: Vehicle[];
  onRefresh: () => Promise<void>;
  currentRole: UserRole;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  vehicles,
  onRefresh,
  currentRole
}) => {
  const isSeller = currentRole === 'VENDEDOR';
  const isMarketing = currentRole === 'MARKETING';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [makeFilter, setMakeFilter] = useState<string>('all');

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle>>({});
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesMake = makeFilter === 'all' || v.make === makeFilter;
    return matchesSearch && matchesStatus && matchesMake;
  });

  const uniqueMakes = Array.from(new Set(vehicles.map(v => v.make)));

  const handleOpenCreate = () => {
    setEditingVehicle({
      vin: '',
      make: 'Toyota',
      model: '',
      version: '',
      year: new Date().getFullYear(),
      km: 0,
      fuel: 'Nafta',
      transmission: 'Automático',
      color: 'Blanco',
      cylinder: '2.000 cc',
      buyPriceGs: 60000000,
      expensesGs: 5000000,
      priceGs: 85000000,
      status: 'disponible',
      published: true,
      location: 'Showroom Central - Asunción',
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ],
      description: '',
      features: ['Cámara de retroceso', 'Pantalla táctil', 'Llantas de aleación', 'Aire acondicionado digital']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle({ ...v });
    setIsModalOpen(true);
  };

  const handleDelete = async (v: Vehicle) => {
    if (window.confirm(`¿Estás seguro de eliminar el vehículo ${v.make} ${v.model} (VIN: ${v.vin})?`)) {
      await deleteVehicle(v.id);
      await onRefresh();
    }
  };

  const handleTogglePublish = async (v: Vehicle) => {
    await saveVehicle({ ...v, published: !v.published });
    await onRefresh();
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const currentImgs = editingVehicle.images || [];
    setEditingVehicle({
      ...editingVehicle,
      images: [...currentImgs, newImageUrl.trim()]
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (idx: number) => {
    const currentImgs = editingVehicle.images || [];
    setEditingVehicle({
      ...editingVehicle,
      images: currentImgs.filter((_, i) => i !== idx)
    });
  };

  const handleSetPrimaryImage = (idx: number) => {
    const currentImgs = [...(editingVehicle.images || [])];
    const [selected] = currentImgs.splice(idx, 1);
    setEditingVehicle({
      ...editingVehicle,
      images: [selected, ...currentImgs]
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        const currentImgs = editingVehicle.images || [];
        setEditingVehicle({
          ...editingVehicle,
          images: [dataUrl, ...currentImgs]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const currentFeats = editingVehicle.features || [];
    setEditingVehicle({
      ...editingVehicle,
      features: [...currentFeats, newFeatureText.trim()]
    });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    const currentFeats = editingVehicle.features || [];
    setEditingVehicle({
      ...editingVehicle,
      features: currentFeats.filter((_, i) => i !== idx)
    });
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle.make || !editingVehicle.model || !editingVehicle.vin) {
      alert('Por favor complete VIN, Marca y Modelo.');
      return;
    }

    setIsSaving(true);
    try {
      await saveVehicle(editingVehicle);
      await onRefresh();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar vehículo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Profit calculation helper
  const buyCost = editingVehicle.buyPriceGs || 0;
  const expCost = editingVehicle.expensesGs || 0;
  const salePrice = editingVehicle.priceGs || 0;
  const estimatedProfitGs = salePrice - (buyCost + expCost);
  const profitMarginPercent = salePrice > 0 ? Math.round((estimatedProfitGs / salePrice) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Inventario de Vehículos</h2>
          <p className="text-xs text-neutral-400">
            Control centralizado de flota, estados, precios en Guaraníes y fotografías.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Registrar Vehículo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121824] border border-neutral-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por VIN, Marca o Modelo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#0E1420] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-700/80 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={makeFilter}
            onChange={e => setMakeFilter(e.target.value)}
            className="bg-[#0E1420] text-xs text-neutral-300 py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none"
          >
            <option value="all">Todas las marcas</option>
            {uniqueMakes.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0E1420] text-xs text-neutral-300 py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="reservado">Reservados</option>
            <option value="vendido">Vendidos</option>
            <option value="en_preparacion">En preparación</option>
            <option value="no_disponible">No disponibles</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-[#121824] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0E1420] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-4">Vehículo</th>
                <th className="py-3.5 px-3">VIN / Chasis</th>
                <th className="py-3.5 px-3">Año & Km</th>
                <th className="py-3.5 px-3">Precio Venta (Gs.)</th>
                {!isSeller && !isMarketing && <th className="py-3.5 px-3">Costo & Margen</th>}
                <th className="py-3.5 px-3">Estado</th>
                <th className="py-3.5 px-3">Web</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-neutral-500">
                    No se encontraron vehículos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map(v => {
                  const img = v.images && v.images[0] ? v.images[0] : '';
                  const totalCost = (v.buyPriceGs || 0) + (v.expensesGs || 0);
                  const marginGs = v.priceGs - totalCost;

                  return (
                    <tr key={v.id} className="hover:bg-[#161F2E] transition-colors">
                      {/* Vehicle Info & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="w-12 h-9 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block">
                              {v.make} {v.model}
                            </span>
                            <span className="text-[11px] text-neutral-400 block truncate max-w-[140px]">
                              {v.version || `${v.fuel} · ${v.transmission}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* VIN */}
                      <td className="py-3 px-3 font-mono text-neutral-300">
                        {v.vin}
                      </td>

                      {/* Year & Km */}
                      <td className="py-3 px-3 text-neutral-300">
                        <span className="block font-semibold">{v.year}</span>
                        <span className="text-[11px] text-neutral-400">{formatKm(v.km)}</span>
                      </td>

                      {/* Sale Price */}
                      <td className="py-3 px-3 font-mono font-bold text-[#38BDF8]">
                        {formatGs(v.priceGs)}
                      </td>

                      {/* Confidential Cost & Margin (Hidden for Sellers) */}
                      {!isSeller && !isMarketing && (
                        <td className="py-3 px-3">
                          <span className="text-neutral-400 block text-[11px] font-mono">
                            Costo: {formatGs(totalCost)}
                          </span>
                          <span className={`text-[11px] font-mono font-bold ${marginGs > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            Margen: {formatGs(marginGs)}
                          </span>
                        </td>
                      )}

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            v.status === 'disponible'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : v.status === 'reservado'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : v.status === 'vendido'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-neutral-700 text-neutral-300'
                          }`}
                        >
                          {v.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleTogglePublish(v)}
                          title={v.published ? 'Publicado en la web' : 'Oculto de la web'}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            v.published
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                          }`}
                        >
                          {v.published ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(v)}
                            title="Editar vehículo"
                            className="p-1.5 rounded-lg border border-neutral-700 hover:border-neutral-500 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>

                          {!isSeller && !isMarketing && (
                            <button
                              onClick={() => handleDelete(v)}
                              title="Eliminar vehículo"
                              className="p-1.5 rounded-lg border border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-[#0E1420] border border-neutral-700 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Car size={20} className="text-amber-400" />
                <span>{editingVehicle.id ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-6">
              {/* Core identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    VIN / Número de Chasis *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2T1BURHE7NC..."
                    value={editingVehicle.vin || ''}
                    onChange={e => setEditingVehicle({ ...editingVehicle, vin: e.target.value.toUpperCase() })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Marca *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Toyota, Hyundai..."
                    value={editingVehicle.make || ''}
                    onChange={e => setEditingVehicle({ ...editingVehicle, make: e.target.value })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Corolla, Tucson..."
                    value={editingVehicle.model || ''}
                    onChange={e => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Version, Year, Km */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Versión
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: GLi 2.0, Limited..."
                    value={editingVehicle.version || ''}
                    onChange={e => setEditingVehicle({ ...editingVehicle, version: e.target.value })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Año *
                  </label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max="2030"
                    value={editingVehicle.year || 2022}
                    onChange={e => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Kilometraje
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingVehicle.km || 0}
                    onChange={e => setEditingVehicle({ ...editingVehicle, km: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Color
                  </label>
                  <input
                    type="text"
                    placeholder="Blanco, Negro, Gris..."
                    value={editingVehicle.color || ''}
                    onChange={e => setEditingVehicle({ ...editingVehicle, color: e.target.value })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Fuel, Transmission, Cylinder, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Combustible
                  </label>
                  <select
                    value={editingVehicle.fuel || 'Nafta'}
                    onChange={e => setEditingVehicle({ ...editingVehicle, fuel: e.target.value as FuelType })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none"
                  >
                    <option value="Nafta">Nafta</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Flex">Flex</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Transmisión
                  </label>
                  <select
                    value={editingVehicle.transmission || 'Automático'}
                    onChange={e => setEditingVehicle({ ...editingVehicle, transmission: e.target.value as TransmissionType })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none"
                  >
                    <option value="Automático">Automático</option>
                    <option value="Mecánico">Mecánico</option>
                    <option value="Secuencial">Secuencial</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Cilindrada
                  </label>
                  <input
                    type="text"
                    placeholder="2.000 cc, 1.6 Turbo..."
                    value={editingVehicle.cylinder || ''}
                    onChange={e => setEditingVehicle({ ...editingVehicle, cylinder: e.target.value })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.location || 'Showroom Central - Asunción'}
                    onChange={e => setEditingVehicle({ ...editingVehicle, location: e.target.value })}
                    className="w-full bg-[#141C2A] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status and Publish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#141C2A] p-4 rounded-2xl border border-neutral-800">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                    Estado Operativo
                  </label>
                  <select
                    value={editingVehicle.status || 'disponible'}
                    onChange={e => setEditingVehicle({ ...editingVehicle, status: e.target.value as VehicleStatus })}
                    className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none font-bold capitalize"
                  >
                    <option value="disponible">Disponible (Visible en catálogo)</option>
                    <option value="reservado">Reservado (Oculto de disponibles)</option>
                    <option value="vendido">Vendido (Retirado del catálogo)</option>
                    <option value="en_preparacion">En preparación (Taller / Aduana)</option>
                    <option value="no_disponible">No disponible</option>
                  </select>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 pt-4">
                  <label className="text-xs font-bold text-neutral-200">
                    ¿Publicar inmediatamente en Web?
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingVehicle({ ...editingVehicle, published: !editingVehicle.published })}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      editingVehicle.published ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        editingVehicle.published ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Financial Breakdown (Visible to Admin & Gerente, hidden for sellers) */}
              {!isSeller && (
                <div className="bg-[#141C2A] p-4 rounded-2xl border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Finanzas y Rentabilidad (Confidencial)
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Margen: <strong className={profitMarginPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>{profitMarginPercent}%</strong> ({formatGs(estimatedProfitGs)})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Precio de Compra / Costo Origen (Gs.)
                      </label>
                      <input
                        type="number"
                        step="1000000"
                        value={editingVehicle.buyPriceGs || 0}
                        onChange={e => setEditingVehicle({ ...editingVehicle, buyPriceGs: Number(e.target.value) })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">
                        Gastos Asociados (Flete, Aduana, Prep) (Gs.)
                      </label>
                      <input
                        type="number"
                        step="500000"
                        value={editingVehicle.expensesGs || 0}
                        onChange={e => setEditingVehicle({ ...editingVehicle, expensesGs: Number(e.target.value) })}
                        className="w-full bg-[#0E1420] text-white text-xs py-2.5 px-3 rounded-xl border border-neutral-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-amber-400 mb-1 block">
                        Precio Final de Venta al Público (Gs.) *
                      </label>
                      <input
                        type="number"
                        step="1000000"
                        required
                        value={editingVehicle.priceGs || 0}
                        onChange={e => setEditingVehicle({ ...editingVehicle, priceGs: Number(e.target.value) })}
                        className="w-full bg-[#0E1420] text-amber-400 font-bold text-xs py-2.5 px-3 rounded-xl border border-amber-400/50 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Seller Price Only view */}
              {isSeller && (
                <div>
                  <label className="text-xs font-bold text-amber-400 mb-1 block">
                    Precio de Venta al Público (Gs.) *
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    required
                    value={editingVehicle.priceGs || 0}
                    onChange={e => setEditingVehicle({ ...editingVehicle, priceGs: Number(e.target.value) })}
                    className="w-full bg-[#141C2A] text-amber-400 font-bold text-sm py-2.5 px-3 rounded-xl border border-amber-400/50 font-mono"
                  />
                </div>
              )}

              {/* Images Manager */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-neutral-300 block">
                  Galería de Fotografías ({editingVehicle.images?.length || 0})
                </label>

                {/* Thumbnail list */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(editingVehicle.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-amber-400 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="bg-neutral-800 text-white text-[10px] px-2 py-1 rounded"
                          >
                            Hacer Principal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="bg-red-600 text-white p-1 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Image Inputs */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input
                    type="url"
                    placeholder="Pegar URL de fotografía..."
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-[#141C2A] text-white text-xs py-2 px-3 rounded-xl border border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors"
                  >
                    Agregar URL
                  </button>

                  <label className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer justify-center">
                    <Upload size={14} />
                    <span>Subir archivo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Features Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300 block">
                  Equipamiento y Características Destacadas
                </label>
                <div className="flex flex-wrap gap-2">
                  {(editingVehicle.features || []).map((feat, idx) => (
                    <span
                      key={idx}
                      className="bg-[#141C2A] text-neutral-200 border border-neutral-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-neutral-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Techo solar, Tapizado de cuero, Control de carril..."
                    value={newFeatureText}
                    onChange={e => setNewFeatureText(e.target.value)}
                    className="flex-1 bg-[#141C2A] text-white text-xs py-2 px-3 rounded-xl border border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-2 px-4 rounded-xl"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase text-neutral-300 block mb-1">
                  Descripción Comercial
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre el estado del vehículo, antecedentes, mantenimiento..."
                  value={editingVehicle.description || ''}
                  onChange={e => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                  className="w-full bg-[#141C2A] text-white text-xs p-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Bottom Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-bold py-2.5 px-5 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSaving ? 'Guardando en base de datos...' : 'Guardar Vehículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
