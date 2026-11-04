import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// Types
import {
  Vehicle,
  Client,
  Seller,
  Reservation,
  Sale,
  Commission,
  ImportRequest,
  CompanyConfig,
  UserRole
} from './types';

// Data & Services
import {
  getVehicles,
  getClients,
  getSellers,
  getReservations,
  getSales,
  getCommissions,
  getImportRequests,
  getCompanyConfig,
  seedDemoData
} from './services/db';

import {
  initialVehicles,
  initialCompanyConfig
} from './data/mockData';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { FilterBar, FilterState } from './components/public/FilterBar';
import { VehicleCard } from './components/public/VehicleCard';
import { VehicleDetailModal } from './components/public/VehicleDetailModal';
import { ImportRequestSection } from './components/public/ImportRequestSection';
import { TrustStrip } from './components/public/TrustStrip';
import { AboutSection } from './components/public/AboutSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { FloatingWhatsApp } from './components/public/FloatingWhatsApp';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardModule } from './components/admin/DashboardModule';
import { InventoryModule } from './components/admin/InventoryModule';
import { CrmModule } from './components/admin/CrmModule';
import { SellersModule } from './components/admin/SellersModule';
import { ImportsModule } from './components/admin/ImportsModule';
import { SalesReservationsModule } from './components/admin/SalesReservationsModule';
import { CommissionsModule } from './components/admin/CommissionsModule';
import { FinancesReportsModule } from './components/admin/FinancesReportsModule';
import { AuditSettingsModule } from './components/admin/AuditSettingsModule';

// Icons
import {
  Car,
  ArrowRight,
  ShieldAlert,
  ArrowUpDown,
  Compass,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  X
} from 'lucide-react';

export default function App() {
  // Navigation & View Mode: Default to true so user immediately sees the system module
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#web') return false;
      if (window.location.hash === '#admin') return true;
    }
    return true; // Show the system module as requested
  });
  const [adminModule, setAdminModule] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPERADMIN');
  const [activePublicSection, setActivePublicSection] = useState('inicio');

  // Application Data States
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [clients, setClients] = useState<Client[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [importRequests, setImportRequests] = useState<ImportRequest[]>([]);
  const [config, setConfig] = useState<CompanyConfig>(initialCompanyConfig);

  // UI Interactive States
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    make: '',
    model: '',
    year: '',
    fuel: '',
    transmission: '',
    maxPrice: 0
  });

  // Stock Pagination & Sort
  const [sortBy, setSortBy] = useState<'recientes' | 'precio_menor' | 'precio_mayor' | 'km_menor'>('recientes');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load all data on mount
  const refreshAllData = async () => {
    try {
      const [vList, cList, sList, rList, slList, comList, impList, cfg] = await Promise.all([
        getVehicles(),
        getClients(),
        getSellers(),
        getReservations(),
        getSales(),
        getCommissions(),
        getImportRequests(),
        getCompanyConfig()
      ]);

      if (vList && vList.length > 0) setVehicles(vList);
      if (cList) setClients(cList);
      if (sList) setSellers(sList);
      if (rList) setReservations(rList);
      if (slList) setSales(slList);
      if (comList) setCommissions(comList);
      if (impList) setImportRequests(impList);
      if (cfg) setConfig(cfg);
    } catch (err) {
      console.warn('Data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();

    // Check if initial seeding is needed
    getVehicles().then(v => {
      if (!v || v.length <= 3) {
        seedDemoData().then(() => refreshAllData());
      }
    });

    // Optional Firestore live listener for inventory with error handler
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'inventory'),
        snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
            setVehicles(list);
          }
        },
        error => {
          // Gracefully continue with cached or initial data if offline
          console.warn('Firestore live listener notice (operating with local cache):', error.message);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Live listener not available, operating in cache mode', e);
    }
  }, []);

  // Handle Seeding Action
  const handleSeedAction = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await refreshAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Public Catalog Filtered & Sorted List
  // Rules (§3.2): Only show published vehicles with status 'disponible' in public stock
  const availablePublicStock = useMemo(() => {
    return vehicles.filter(v => v.published && v.status === 'disponible');
  }, [vehicles]);

  const filteredStock = useMemo(() => {
    return availablePublicStock.filter(v => {
      const matchMake = !filters.make || v.make.toLowerCase() === filters.make.toLowerCase();
      const matchModel = !filters.model || v.model.toLowerCase() === filters.model.toLowerCase();
      const matchYear = !filters.year || v.year.toString() === filters.year;
      const matchFuel = !filters.fuel || v.fuel === filters.fuel;
      const matchTrans = !filters.transmission || v.transmission === filters.transmission;
      const matchPrice = !filters.maxPrice || v.priceGs <= filters.maxPrice;

      return matchMake && matchModel && matchYear && matchFuel && matchTrans && matchPrice;
    });
  }, [availablePublicStock, filters]);

  const sortedStock = useMemo(() => {
    const list = [...filteredStock];
    if (sortBy === 'precio_menor') return list.sort((a, b) => a.priceGs - b.priceGs);
    if (sortBy === 'precio_mayor') return list.sort((a, b) => b.priceGs - a.priceGs);
    if (sortBy === 'km_menor') return list.sort((a, b) => a.km - b.km);
    // 'recientes' default
    return list.sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [filteredStock, sortBy]);

  // Paginated vehicles
  const totalPages = Math.ceil(sortedStock.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStock.slice(start, start + itemsPerPage);
  }, [sortedStock, currentPage]);

  // Unique options for FilterBar
  const uniqueMakes = useMemo(() => Array.from(new Set(availablePublicStock.map(v => v.make))), [availablePublicStock]);
  const uniqueModels = useMemo(() => {
    const scope = filters.make
      ? availablePublicStock.filter(v => v.make.toLowerCase() === filters.make.toLowerCase())
      : availablePublicStock;
    return Array.from(new Set(scope.map(v => v.model)));
  }, [availablePublicStock, filters.make]);
  const uniqueYears = useMemo(() => Array.from(new Set(availablePublicStock.map(v => v.year))).sort((a, b) => b - a), [availablePublicStock]);
  const uniqueFuels = useMemo(() => Array.from(new Set(availablePublicStock.map(v => v.fuel))), [availablePublicStock]);

  // Smooth scroll helper
  const handleScrollTo = (sectionId: string) => {
    setActivePublicSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(`seccion-${sectionId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* =========================================================================
     ADMINISTRATIVE VIEW
     ========================================================================= */
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans">
        {/* Global Platform Mode Switcher */}
        <div className="bg-[#05070B] border-b border-amber-500/25 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400 font-semibold">Plataforma Conectada:</span>
            <span className="text-amber-400 font-mono font-bold">
              💼 Sistema de Gestión Administrativo & Comercial (Firebase Firestore)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminMode(false)}
              className="px-3 py-1 rounded-full font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer bg-[#121824] text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500"
            >
              <span>🌐 Cambiar a Web Pública</span>
            </button>
            <span className="bg-amber-400 text-black px-3 py-1 rounded-full font-extrabold text-xs shadow-sm">
              ✓ Panel Administrativo Activo
            </span>
          </div>
        </div>

        <AdminLayout
          currentModule={adminModule}
          onSelectModule={setAdminModule}
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
          onReturnToWeb={() => setIsAdminMode(false)}
          onSeedData={handleSeedAction}
          isSeeding={isSeeding}
        >
          {adminModule === 'dashboard' && (
            <DashboardModule
              vehicles={vehicles}
              clients={clients}
              sales={sales}
              reservations={reservations}
              importRequests={importRequests}
              commissions={commissions}
              currentRole={currentRole}
              onNavigateModule={setAdminModule}
            />
          )}

          {adminModule === 'inventario' && (
            <InventoryModule
              vehicles={vehicles}
              onRefresh={refreshAllData}
              currentRole={currentRole}
            />
          )}

          {adminModule === 'importaciones' && (
            <ImportsModule
              importRequests={importRequests}
              sellers={sellers}
              onRefresh={refreshAllData}
            />
          )}

          {adminModule === 'crm' && (
            <CrmModule
              clients={clients}
              sellers={sellers}
              vehicles={vehicles}
              onRefresh={refreshAllData}
              currentRole={currentRole}
            />
          )}

          {adminModule === 'vendedores' && (
            <SellersModule
              sellers={sellers}
              onRefresh={refreshAllData}
              currentRole={currentRole}
            />
          )}

          {adminModule === 'reservas' && (
            <SalesReservationsModule
              reservations={reservations}
              sales={sales}
              vehicles={vehicles}
              clients={clients}
              sellers={sellers}
              onRefresh={refreshAllData}
              currentRole={currentRole}
            />
          )}

          {adminModule === 'ventas' && (
            <SalesReservationsModule
              reservations={reservations}
              sales={sales}
              vehicles={vehicles}
              clients={clients}
              sellers={sellers}
              onRefresh={refreshAllData}
              currentRole={currentRole}
            />
          )}

          {adminModule === 'comisiones' && (
            <CommissionsModule
              commissions={commissions}
              sellers={sellers}
              onRefresh={refreshAllData}
              currentRole={currentRole}
            />
          )}

          {adminModule === 'finanzas' && (
            <FinancesReportsModule
              vehicles={vehicles}
              sales={sales}
              commissions={commissions}
            />
          )}

          {adminModule === 'configuracion' && (
            <AuditSettingsModule
              config={config}
              onRefresh={refreshAllData}
              currentRole={currentRole}
            />
          )}
        </AdminLayout>
      </div>
    );
  }

  /* =========================================================================
     PUBLIC WEBSITE VIEW (Fidelidad Estricta a la Referencia)
     ========================================================================= */
  return (
    <div className="min-h-screen bg-[#070A0F] text-white font-sans selection:bg-amber-400 selection:text-black">
      {/* Global Platform Mode Switcher */}
      <div className="bg-[#05070B] border-b border-neutral-800 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-neutral-400 font-semibold">Plataforma Conectada:</span>
          <span className="text-white font-mono font-bold">
            🌐 Página Web Oficial Shery Automotores (Catálogo Público)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-sm">
            ✓ Web Pública Activa
          </span>
          <button
            onClick={() => setIsAdminMode(true)}
            className="px-3 py-1 rounded-full font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer bg-[#121824] hover:bg-[#1A2335] text-amber-400 hover:text-amber-300 border border-amber-500/30"
          >
            <span>💼 Cambiar al Sistema Administrativo</span>
          </button>
        </div>
      </div>

      {/* 1. Header & Navigation */}
      <Navbar
        activeSection={activePublicSection}
        onNavigate={handleScrollTo}
        onOpenAdmin={() => setIsAdminMode(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        whatsappNumber={config.whatsapp}
      />

      {/* 2. Hero Section matching reference image */}
      <Hero
        onExploreStock={() => handleScrollTo('stock')}
        onRequestImport={() => handleScrollTo('importacion')}
      />

      {/* 3. Floating Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={f => {
          setFilters(f);
          setCurrentPage(1);
        }}
        availableMakes={uniqueMakes}
        availableModels={uniqueModels}
        availableYears={uniqueYears}
        availableFuels={uniqueFuels}
        totalResultsCount={filteredStock.length}
      />

      {/* 4. Section: Nuestro Stock */}
      <section id="seccion-stock" className="py-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Header with Blue Accent Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-[#007BFF] rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Nuestro Stock
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#121824] border border-neutral-800 px-3 py-1.5 rounded-xl">
              <ArrowUpDown size={14} className="text-amber-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value="recientes" className="bg-[#121824]">Más recientes</option>
                <option value="precio_menor" className="bg-[#121824]">Menor precio</option>
                <option value="precio_mayor" className="bg-[#121824]">Mayor precio</option>
                <option value="km_menor" className="bg-[#121824]">Menor kilometraje</option>
              </select>
            </div>

            <button
              onClick={() => {
                setFilters({
                  make: '',
                  model: '',
                  year: '',
                  fuel: '',
                  transmission: '',
                  maxPrice: 0
                });
                setCurrentPage(1);
              }}
              className="text-[#38BDF8] hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver todos los vehículos</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Vehicles Cards Grid */}
        {paginatedVehicles.length === 0 ? (
          <div className="bg-[#121824] border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
            <Car size={48} className="mx-auto text-neutral-600" />
            <h3 className="text-lg font-bold text-white">No hay vehículos con los filtros seleccionados</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Intenta cambiar los criterios de búsqueda o consulta directamente por nuestro servicio de importación por encargo.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() =>
                  setFilters({
                    make: '',
                    model: '',
                    year: '',
                    fuel: '',
                    transmission: '',
                    maxPrice: 0
                  })
                }
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-2.5 px-5 rounded-full"
              >
                Restablecer filtros
              </button>
              <button
                onClick={() => handleScrollTo('importacion')}
                className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold py-2.5 px-5 rounded-full"
              >
                Pedir por encargo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={setSelectedVehicle}
                whatsappNumber={config.whatsapp}
              />
            ))}
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#121824] border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                    : 'bg-[#121824] border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#121824] border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>

      {/* 5. Benefits Trust Strip matching reference bottom */}
      <TrustStrip whatsappNumber={config.whatsapp} />

      {/* 6. Section: Importación por Pedido */}
      <ImportRequestSection />

      {/* 7. Section: Nosotros */}
      <AboutSection />

      {/* 8. Section: Contacto y Ubicación */}
      <ContactSection config={config} />

      {/* 9. Footer matching reference */}
      <Footer
        config={config}
        onNavigate={handleScrollTo}
        onOpenAdmin={() => setIsAdminMode(true)}
      />

      {/* 10. Floating WhatsApp Button */}
      <FloatingWhatsApp whatsappNumber={config.whatsapp} />

      {/* 11. Vehicle Full Details Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        whatsappNumber={config.whatsapp}
      />

      {/* 12. Quick Consultation Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0E1420] border border-neutral-700 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-4 text-xs text-white">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span>Consultar con un Asesor</span>
              </h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="text-neutral-400">
              Elige cómo deseas comunicarte con Shery Automotores:
            </p>
            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/595${config.whatsapp.replace(/\D/g, '')}?text=Hola%20Shery%20Automotores,%20quisiera%20recibir%20asesoramiento%20comercial.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 px-4 rounded-xl text-xs transition-colors"
              >
                <span>Chatear por WhatsApp ({config.whatsapp})</span>
              </a>
              <button
                onClick={() => {
                  setIsContactModalOpen(false);
                  handleScrollTo('contacto');
                }}
                className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
              >
                <span>Llenar Formulario de Contacto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
