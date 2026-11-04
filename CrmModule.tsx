import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  Edit2,
  Send,
  X
} from 'lucide-react';
import { Client, ClientStatus, ClientOrigin, Seller, Vehicle, UserRole } from '../../types';
import { saveClient, addClientNote } from '../../services/db';
import { formatDate, formatDateTime, getWhatsAppLink } from '../../utils/formatters';

interface CrmModuleProps {
  clients: Client[];
  sellers: Seller[];
  vehicles: Vehicle[];
  onRefresh: () => Promise<void>;
  currentRole: UserRole;
}

export const CrmModule: React.FC<CrmModuleProps> = ({
  clients,
  sellers,
  vehicles,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Selected client for timeline & notes drawer
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState<'Llamada' | 'WhatsApp' | 'Reunión' | 'Visita' | 'Nota'>('WhatsApp');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesOrigin = originFilter === 'all' || c.origin === originFilter;
    return matchesSearch && matchesStatus && matchesOrigin;
  });

  const handleOpenCreate = () => {
    setEditingClient({
      name: '',
      phone: '',
      email: '',
      city: 'Asunción',
      origin: 'Presencial',
      status: 'Nuevo',
      assignedSellerId: sellers[0]?.id || '',
      assignedSellerName: sellers[0]?.name || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient({ ...c });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient.name || !editingClient.phone) return;

    setIsSaving(true);
    try {
      const assignedSeller = sellers.find(s => s.id === editingClient.assignedSellerId);
      await saveClient({
        ...editingClient,
        assignedSellerName: assignedSeller ? assignedSeller.name : editingClient.assignedSellerName
      });
      await onRefresh();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newNoteText.trim()) return;

    setIsAddingNote(true);
    try {
      await addClientNote(selectedClient.id, newNoteText.trim(), newNoteType, 'Asesor Comercial');
      await onRefresh();
      // Update selected client view
      const updatedClients = await onRefresh();
      setNewNoteText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const statusColors: Record<ClientStatus, string> = {
    Nuevo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Contactado: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Interesado: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Cotizacion_enviada: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    En_negociacion: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Reservado: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Ganado: 'bg-green-500/20 text-green-400 border-green-500/30',
    Perdido: 'bg-neutral-700 text-neutral-400 border-neutral-600'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">CRM & Gestión de Clientes</h2>
          <p className="text-xs text-neutral-400">
            Seguimiento de prospectos, asignación de vendedores y registro comercial.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Registrar Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121824] border border-neutral-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#0E1420] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-700/80 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0E1420] text-xs text-neutral-300 py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Contactado">Contactado</option>
            <option value="Interesado">Interesado</option>
            <option value="Cotizacion_enviada">Cotización enviada</option>
            <option value="En_negociacion">En negociación</option>
            <option value="Reservado">Reservado</option>
            <option value="Ganado">Ganado</option>
            <option value="Perdido">Perdido</option>
          </select>

          <select
            value={originFilter}
            onChange={e => setOriginFilter(e.target.value)}
            className="bg-[#0E1420] text-xs text-neutral-300 py-2.5 px-3 rounded-xl border border-neutral-700 focus:outline-none"
          >
            <option value="all">Todos los orígenes</option>
            <option value="Web">Web</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Referido">Referido</option>
            <option value="Presencial">Presencial</option>
          </select>
        </div>
      </div>

      {/* Main CRM Grid: Clients Table (7 cols) + Follow-up Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Clients Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#121824] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0E1420] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-3.5">Cliente</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Vehículo de Interés</th>
                  <th className="py-3 px-3">Asesor</th>
                  <th className="py-3 px-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No hay clientes registrados con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map(c => {
                    const isSelected = selectedClient?.id === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedClient(c)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#182335]' : 'hover:bg-[#151D2C]'
                        }`}
                      >
                        <td className="py-3 px-3.5">
                          <span className="font-bold text-white block">{c.name}</span>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <span className="font-mono">{c.phone}</span>
                            <span>· {c.origin}</span>
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              statusColors[c.status] || 'bg-neutral-700 text-white'
                            }`}
                          >
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-neutral-300">
                          <span className="truncate max-w-[140px] block">
                            {c.interestVehicleName || 'Sin asignar'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-neutral-400 text-[11px]">
                          {c.assignedSellerName || 'Sin asesor'}
                        </td>

                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                            <a
                              href={getWhatsAppLink(c.phone, `Hola ${c.name}, te contacto desde Shery Automotores...`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              title="Contactar WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                            <button
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                              title="Editar cliente"
                            >
                              <Edit2 size={13} />
                            </button>
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

        {/* Client Detail & Follow-up Timeline Right (5 cols) */}
        <div className="lg:col-span-5 bg-[#121824] border border-neutral-800 rounded-2xl p-5 space-y-5">
          {selectedClient ? (
            <>
              {/* Selected Client Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-base font-extrabold text-white">{selectedClient.name}</h3>
                  <div className="text-xs text-neutral-400 space-y-0.5 mt-1 font-mono">
                    <p>Tel: {selectedClient.phone}</p>
                    {selectedClient.email && <p>Email: {selectedClient.email}</p>}
                    <p>Origen: {selectedClient.origin} · Ciudad: {selectedClient.city || 'Asunción'}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    statusColors[selectedClient.status]
                  }`}
                >
                  {selectedClient.status.replace('_', ' ')}
                </span>
              </div>

              {/* Interest Vehicle */}
              <div className="bg-[#0E1420] p-3 rounded-xl border border-neutral-800 text-xs">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-0.5">
                  Vehículo de Interés
                </span>
                <p className="font-bold text-amber-400">
                  {selectedClient.interestVehicleName || 'No especificado'}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Asesor asignado: <strong className="text-white">{selectedClient.assignedSellerName || 'Sin asignar'}</strong>
                </p>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">Registrar Seguimiento</span>
                  <div className="flex gap-1 text-[10px]">
                    {(['WhatsApp', 'Llamada', 'Visita', 'Reunión', 'Nota'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewNoteType(t)}
                        className={`px-2 py-0.5 rounded ${
                          newNoteType === t ? 'bg-amber-400 text-black font-bold' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={`Escribir detalle de ${newNoteType}...`}
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    className="flex-1 bg-[#0E1420] text-white text-xs py-2 px-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isAddingNote}
                    className="bg-amber-400 hover:bg-amber-300 text-black px-3.5 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    Guardar
                  </button>
                </div>
              </form>

              {/* Follow-up Timeline History */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Historial de Interacciones ({selectedClient.notes?.length || 0})
                </h4>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {!selectedClient.notes || selectedClient.notes.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No hay notas de seguimiento registradas.</p>
                  ) : (
                    selectedClient.notes.map(note => (
                      <div
                        key={note.id}
                        className="bg-[#0E1420] border border-neutral-800/80 p-3 rounded-xl text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="font-bold text-blue-400">{note.type}</span>
                          <span className="font-mono">{formatDateTime(note.date)}</span>
                        </div>
                        <p className="text-neutral-200">{note.text}</p>
                        <span className="text-[10px] text-neutral-500 block">Por: {note.author}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-neutral-500 text-xs">
              <Users size={32} className="mx-auto mb-2 opacity-40" />
              <p>Selecciona un cliente de la lista para ver su expediente y registrar seguimientos.</p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT CLIENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-[#0E1420] border border-neutral-700 rounded-3xl max-w-xl w-full p-6 space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold">
                {editingClient.id ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-neutral-400 mb-1 block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Nombre y Apellido"
                  value={editingClient.name || ''}
                  onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full bg-[#141C2A] text-white py-2.5 px-3 rounded-xl border border-neutral-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-400 mb-1 block">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0981 123 456"
                    value={editingClient.phone || ''}
                    onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2.5 px-3 rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-400 mb-1 block">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={editingClient.email || ''}
                    onChange={e => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2.5 px-3 rounded-xl border border-neutral-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-400 mb-1 block">Origen del Contacto</label>
                  <select
                    value={editingClient.origin || 'Presencial'}
                    onChange={e => setEditingClient({ ...editingClient, origin: e.target.value as ClientOrigin })}
                    className="w-full bg-[#141C2A] text-white py-2.5 px-3 rounded-xl border border-neutral-700"
                  >
                    <option value="Web">Web</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referido">Referido</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-400 mb-1 block">Estado en Pipeline</label>
                  <select
                    value={editingClient.status || 'Nuevo'}
                    onChange={e => setEditingClient({ ...editingClient, status: e.target.value as ClientStatus })}
                    className="w-full bg-[#141C2A] text-white py-2.5 px-3 rounded-xl border border-neutral-700 capitalize"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Interesado">Interesado</option>
                    <option value="Cotizacion_enviada">Cotización enviada</option>
                    <option value="En_negociacion">En negociación</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Ganado">Ganado</option>
                    <option value="Perdido">Perdido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-400 mb-1 block">Vehículo de Interés</label>
                  <select
                    value={editingClient.interestVehicleId || ''}
                    onChange={e => {
                      const veh = vehicles.find(v => v.id === e.target.value);
                      setEditingClient({
                        ...editingClient,
                        interestVehicleId: e.target.value,
                        interestVehicleName: veh ? `${veh.make} ${veh.model} ${veh.year}` : ''
                      });
                    }}
                    className="w-full bg-[#141C2A] text-white py-2.5 px-3 rounded-xl border border-neutral-700"
                  >
                    <option value="">Seleccionar vehículo...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} {v.year} ({v.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-400 mb-1 block">Vendedor Asignado</label>
                  <select
                    value={editingClient.assignedSellerId || ''}
                    onChange={e => setEditingClient({ ...editingClient, assignedSellerId: e.target.value })}
                    className="w-full bg-[#141C2A] text-white py-2.5 px-3 rounded-xl border border-neutral-700"
                  >
                    <option value="">Seleccionar vendedor...</option>
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
                  onClick={() => setIsModalOpen(false)}
                  className="border border-neutral-700 px-4 py-2 rounded-xl text-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-400 text-black font-extrabold px-5 py-2 rounded-xl disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
