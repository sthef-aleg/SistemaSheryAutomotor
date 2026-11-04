import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldCheck,
  RefreshCw,
  Save,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CompanyConfig, AuditLog, UserRole } from '../../types';
import { saveCompanyConfig, getAuditLogs, seedDemoData } from '../../services/db';
import { formatDateTime } from '../../utils/formatters';

interface AuditSettingsModuleProps {
  config: CompanyConfig;
  onRefresh: () => Promise<void>;
  currentRole: UserRole;
}

export const AuditSettingsModule: React.FC<AuditSettingsModuleProps> = ({
  config,
  onRefresh,
  currentRole
}) => {
  const [formConfig, setFormConfig] = useState<CompanyConfig>(config);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const logs = await getAuditLogs();
    setAuditLogs(logs);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveCompanyConfig(formConfig);
      await onRefresh();
      await loadLogs();
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeed = async () => {
    if (window.confirm('¿Deseas inicializar los datos de demostración en Firestore (12 vehículos, 5 clientes, vendedores, importaciones y ventas)?')) {
      setIsSeeding(true);
      try {
        await seedDemoData();
        await onRefresh();
        await loadLogs();
        alert('Datos de demostración sembrados con éxito.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsSeeding(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white">Auditoría & Configuración del Sistema</h2>
        <p className="text-xs text-neutral-400">
          Trazabilidad de modificaciones, datos comerciales y restauración de datos demo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Company Settings (6 cols) */}
        <div className="lg:col-span-6 bg-[#121824] border border-neutral-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders size={16} className="text-amber-400" />
              <span>Datos Comerciales de Shery Automotores</span>
            </h3>
            {savedFeedback && (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> Guardado
              </span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={formConfig.companyName}
                onChange={e => setFormConfig({ ...formConfig, companyName: e.target.value })}
                className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Teléfono Principal</label>
                <input
                  type="text"
                  value={formConfig.phone}
                  onChange={e => setFormConfig({ ...formConfig, phone: e.target.value })}
                  className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Número de WhatsApp</label>
                <input
                  type="text"
                  value={formConfig.whatsapp}
                  onChange={e => setFormConfig({ ...formConfig, whatsapp: e.target.value })}
                  className="w-full bg-[#0E1420] text-emerald-400 font-bold py-2 px-3 rounded-xl border border-neutral-700 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Correo Electrónico Oficial</label>
              <input
                type="email"
                value={formConfig.email}
                onChange={e => setFormConfig({ ...formConfig, email: e.target.value })}
                className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Dirección del Showroom</label>
                <input
                  type="text"
                  value={formConfig.address}
                  onChange={e => setFormConfig({ ...formConfig, address: e.target.value })}
                  className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Ciudad / País</label>
                <input
                  type="text"
                  value={formConfig.city}
                  onChange={e => setFormConfig({ ...formConfig, city: e.target.value })}
                  className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Horarios Semana</label>
                <input
                  type="text"
                  value={formConfig.hoursWeekday}
                  onChange={e => setFormConfig({ ...formConfig, hoursWeekday: e.target.value })}
                  className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Horarios Sábado</label>
                <input
                  type="text"
                  value={formConfig.hoursSaturday}
                  onChange={e => setFormConfig({ ...formConfig, hoursSaturday: e.target.value })}
                  className="w-full bg-[#0E1420] text-white py-2 px-3 rounded-xl border border-neutral-700"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Save size={15} />
                <span>{isSaving ? 'Guardando...' : 'Guardar Configuración'}</span>
              </button>
            </div>
          </form>

          {/* Seed Demo Data Tool */}
          <div className="mt-6 pt-5 border-t border-neutral-800 space-y-3 bg-[#0E1420] p-4 rounded-xl border border-neutral-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Inicializador Controlado de Datos Ficticios
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Carga instantáneamente 12 vehículos reales en Guaraníes, 5 clientes con historial, 3 vendedores con porcentajes de comisión, reservas, ventas y solicitudes de importación en Firestore.
            </p>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSeeding ? 'animate-spin' : ''} />
              <span>{isSeeding ? 'Sembrando en Firestore...' : 'Restaurar / Sembrar Datos Demo'}</span>
            </button>
          </div>
        </div>

        {/* Audit Log Timeline (6 cols) */}
        <div className="lg:col-span-6 bg-[#121824] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Registro de Auditoría en Tiempo Real</span>
            </h3>
            <button onClick={loadLogs} className="text-neutral-400 hover:text-white p-1">
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-neutral-500 py-10 text-center italic">No hay registros de auditoría aún.</p>
            ) : (
              auditLogs.map(log => (
                <div
                  key={log.id}
                  className="bg-[#0E1420] border border-neutral-800/80 p-3 rounded-xl text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-400">{log.action}</span>
                    <span className="text-neutral-500 font-mono">{formatDateTime(log.timestamp)}</span>
                  </div>
                  <p className="text-neutral-300 text-[11px]">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-0.5">
                    <span>Usuario: {log.userEmail}</span>
                    <span className="font-mono bg-neutral-800 px-1.5 py-0.2 rounded text-neutral-400">
                      {log.userRole}
                    </span>
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
