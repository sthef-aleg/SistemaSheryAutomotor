import React from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  UserCheck,
  CalendarCheck,
  ShoppingBag,
  Percent,
  Compass,
  BarChart3,
  ShieldAlert,
  Sliders,
  ExternalLink,
  LogOut,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

interface AdminLayoutProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onReturnToWeb: () => void;
  onSeedData: () => void;
  isSeeding: boolean;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentModule,
  onSelectModule,
  currentRole,
  onChangeRole,
  onReturnToWeb,
  onSeedData,
  isSeeding,
  children
}) => {
  // Role permission filters
  const canSeeFinances = currentRole === 'SUPERADMIN' || currentRole === 'GERENTE';
  const canSeeCommissions = currentRole !== 'MARKETING';
  const canSeeInventory = true;
  const canSeeCRM = currentRole !== 'MARKETING';
  const canSeeImports = currentRole !== 'MARKETING';
  const canSeeSettings = currentRole === 'SUPERADMIN' || currentRole === 'GERENTE';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, visible: true },
    { id: 'inventario', label: 'Inventario', icon: Car, visible: canSeeInventory },
    { id: 'importaciones', label: 'Importación 13 Etapas', icon: Compass, visible: canSeeImports },
    { id: 'crm', label: 'Clientes & CRM', icon: Users, visible: canSeeCRM },
    { id: 'vendedores', label: 'Vendedores', icon: UserCheck, visible: canSeeCommissions },
    { id: 'reservas', label: 'Reservas', icon: CalendarCheck, visible: canSeeCRM },
    { id: 'ventas', label: 'Ventas Realizadas', icon: ShoppingBag, visible: canSeeCRM },
    { id: 'comisiones', label: 'Comisiones %', icon: Percent, visible: canSeeCommissions },
    { id: 'finanzas', label: 'Finanzas & Reportes', icon: BarChart3, visible: canSeeFinances },
    { id: 'configuracion', label: 'Auditoría & Ajustes', icon: Sliders, visible: canSeeSettings }
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col lg:flex-row font-sans">
      {/* Sidebar Left */}
      <aside className="w-full lg:w-72 bg-[#0C111A] border-r border-neutral-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/public/assets/aistudio/image_c96a00bb.png"
                alt="Shery Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-extrabold text-sm text-white tracking-wider uppercase leading-none">
                  Shery Automotores
                </h1>
                <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
                  Gestión Concesionaria
                </span>
              </div>
            </div>

            <button
              onClick={onReturnToWeb}
              title="Volver a la web pública"
              className="lg:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg bg-neutral-800"
            >
              <ExternalLink size={16} />
            </button>
          </div>

          {/* Role Simulator Switcher */}
          <div className="p-4 bg-[#111723] border-b border-neutral-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Rol Activo (Simulador):
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <select
              value={currentRole}
              onChange={e => onChangeRole(e.target.value as UserRole)}
              className="w-full bg-[#182233] text-amber-400 text-xs font-bold py-2 px-2.5 rounded-lg border border-neutral-700/80 focus:outline-none cursor-pointer"
            >
              <option value="SUPERADMIN">1. Superadministrador (Total)</option>
              <option value="GERENTE">2. Dueño / Gerente (Supervisión)</option>
              <option value="ADMINISTRADOR">3. Administrador (Operativo)</option>
              <option value="VENDEDOR">4. Vendedor (Comercial)</option>
              <option value="MARKETING">5. Marketing (Catálogo & Fotos)</option>
            </select>
            <p className="text-[10px] text-neutral-400 mt-1 italic">
              {currentRole === 'VENDEDOR' && 'Restricción activa: No accede a costos internos ni márgenes confidenciales.'}
              {currentRole === 'MARKETING' && 'Restricción activa: Solo gestión de fotos y publicación en catálogo.'}
              {(currentRole === 'SUPERADMIN' || currentRole === 'GERENTE') && 'Acceso total a finanzas, costos reales y auditoría.'}
              {currentRole === 'ADMINISTRADOR' && 'Gestión completa de stock, CRM, reservas y ventas.'}
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {menuItems.filter(m => m.visible).map(item => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-black' : 'text-neutral-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          {/* Seed Demo Data Button */}
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSeeding ? 'animate-spin' : ''} />
            <span>{isSeeding ? 'Sembrando datos...' : 'Sembrar Datos Demo'}</span>
          </button>

          {/* Return to Public Web */}
          <button
            onClick={onReturnToWeb}
            className="w-full flex items-center justify-center gap-2 border border-neutral-700 hover:border-neutral-500 bg-neutral-800/40 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer"
          >
            <ExternalLink size={14} />
            <span>Ver Web Pública</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-[#0C111A]/80 backdrop-blur-md border-b border-neutral-800/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-white capitalize">
              {menuItems.find(m => m.id === currentModule)?.label || currentModule}
            </h2>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">
              · Shery Automotores Sistema Central
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#121824] border border-neutral-700/80 px-3 py-1.5 rounded-full text-xs">
              <span className="text-neutral-400">Usuario:</span>
              <span className="font-bold text-amber-400">{currentRole}</span>
            </div>

            <button
              onClick={onReturnToWeb}
              className="text-xs bg-amber-400 text-black font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-amber-300 transition-colors shadow-sm"
            >
              <ExternalLink size={13} />
              <span>Web Pública</span>
            </button>
          </div>
        </header>

        {/* Dynamic Module Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#07090E]">
          {children}
        </main>
      </div>
    </div>
  );
};
