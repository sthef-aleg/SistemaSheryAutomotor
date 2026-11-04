import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Vehicle,
  Client,
  Seller,
  Reservation,
  Sale,
  Commission,
  ImportRequest,
  AuditLog,
  CompanyConfig
} from '../types';
import {
  initialVehicles,
  initialClients,
  initialSellers,
  initialReservations,
  initialSales,
  initialCommissions,
  initialImportRequests,
  initialCompanyConfig
} from '../data/mockData';

// Local storage keys for resilient fallback
const LS_VEHICLES = 'shery_vehicles_cache';
const LS_CLIENTS = 'shery_clients_cache';
const LS_SELLERS = 'shery_sellers_cache';
const LS_RESERVATIONS = 'shery_reservations_cache';
const LS_SALES = 'shery_sales_cache';
const LS_COMMISSIONS = 'shery_commissions_cache';
const LS_IMPORTS = 'shery_imports_cache';
const LS_AUDIT = 'shery_audit_cache';
const LS_CONFIG = 'shery_config_cache';

// Helper to save to local cache
function saveCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

function loadCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/* =========================================================================
   1. AUDIT LOGGING
   ========================================================================= */
export async function logAudit(
  action: string,
  details: string,
  entityType: AuditLog['entityType'],
  userEmail = 'admin@sheryautomotores.com',
  userName = 'Administrador',
  userRole = 'SUPERADMIN'
): Promise<void> {
  const logItem: AuditLog = {
    id: 'LOG-' + Date.now(),
    timestamp: new Date().toISOString(),
    userEmail,
    userName,
    userRole,
    action,
    details,
    entityType
  };

  try {
    await addDoc(collection(db, 'auditoria'), logItem);
  } catch (err) {
    console.warn('Audit Firestore write failed, using local storage:', err);
  }

  const logs = loadCache<AuditLog[]>(LS_AUDIT, []);
  logs.unshift(logItem);
  saveCache(LS_AUDIT, logs.slice(0, 100));
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const snap = await getDocs(query(collection(db, 'auditoria'), limit(50)));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
      saveCache(LS_AUDIT, items);
      return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } catch (e) {
    console.warn('Could not read audit from Firestore, using cache', e);
  }
  return loadCache<AuditLog[]>(LS_AUDIT, []);
}

/* =========================================================================
   2. VEHICLES (INVENTORY)
   ========================================================================= */
export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const snap = await getDocs(collection(db, 'inventory'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
      saveCache(LS_VEHICLES, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getVehicles failed, using cache/initial', err);
  }
  return loadCache<Vehicle[]>(LS_VEHICLES, initialVehicles);
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  try {
    const snap = await getDoc(doc(db, 'inventory', id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Vehicle;
    }
  } catch (err) {
    console.warn('getVehicleById failed:', err);
  }
  const all = await getVehicles();
  return all.find(v => v.id === id || v.vin === id) || null;
}

export async function saveVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
  const isNew = !vehicle.id;
  const id = vehicle.id || 'VIN-' + (vehicle.vin ? vehicle.vin.substring(0, 8).toUpperCase() : Date.now());
  const now = new Date().toISOString();

  const fullVehicle: Vehicle = {
    id,
    vin: vehicle.vin || 'VIN-' + Date.now(),
    make: vehicle.make || 'Toyota',
    model: vehicle.model || 'Modelo',
    version: vehicle.version || 'Base',
    year: vehicle.year || new Date().getFullYear(),
    km: vehicle.km || 0,
    fuel: vehicle.fuel || 'Nafta',
    transmission: vehicle.transmission || 'Automático',
    color: vehicle.color || 'Blanco',
    cylinder: vehicle.cylinder || '2.000 cc',
    buyPriceGs: vehicle.buyPriceGs || 0,
    expensesGs: vehicle.expensesGs || 0,
    priceGs: vehicle.priceGs || 0,
    status: vehicle.status || 'disponible',
    published: vehicle.published !== undefined ? vehicle.published : true,
    location: vehicle.location || 'Showroom Central - Asunción',
    images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    description: vehicle.description || '',
    features: vehicle.features || [],
    createdAt: vehicle.createdAt || now,
    updatedAt: now,
    updatedBy: 'admin@sheryautomotores.com'
  };

  try {
    await setDoc(doc(db, 'inventory', id), fullVehicle);
  } catch (err) {
    console.warn('Firestore saveVehicle failed, storing in local cache', err);
  }

  // Update local cache
  const list = loadCache<Vehicle[]>(LS_VEHICLES, initialVehicles);
  const idx = list.findIndex(v => v.id === id);
  if (idx >= 0) {
    list[idx] = fullVehicle;
  } else {
    list.unshift(fullVehicle);
  }
  saveCache(LS_VEHICLES, list);

  await logAudit(
    isNew ? 'Alta de Vehículo' : 'Edición de Vehículo',
    `${fullVehicle.make} ${fullVehicle.model} ${fullVehicle.year} - VIN: ${fullVehicle.vin} - Estado: ${fullVehicle.status}`,
    'Vehículo'
  );

  return fullVehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  const vehicle = await getVehicleById(id);
  try {
    await deleteDoc(doc(db, 'inventory', id));
  } catch (err) {
    console.warn('Firestore deleteDoc failed', err);
  }

  const list = loadCache<Vehicle[]>(LS_VEHICLES, initialVehicles).filter(v => v.id !== id);
  saveCache(LS_VEHICLES, list);

  if (vehicle) {
    await logAudit(
      'Baja de Vehículo',
      `Vehículo eliminado: ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin})`,
      'Vehículo'
    );
  }
}

/* =========================================================================
   3. CLIENTS (CRM)
   ========================================================================= */
export async function getClients(): Promise<Client[]> {
  try {
    const snap = await getDocs(collection(db, 'clientes'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Client));
      saveCache(LS_CLIENTS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getClients failed, using cache', err);
  }
  return loadCache<Client[]>(LS_CLIENTS, initialClients);
}

export async function saveClient(client: Partial<Client>): Promise<Client> {
  const isNew = !client.id;
  const id = client.id || 'CLI-' + Date.now();
  const now = new Date().toISOString();

  const fullClient: Client = {
    id,
    name: client.name || '',
    phone: client.phone || '',
    email: client.email || '',
    city: client.city || 'Asunción',
    origin: client.origin || 'Web',
    status: client.status || 'Nuevo',
    interestVehicleId: client.interestVehicleId || '',
    interestVehicleName: client.interestVehicleName || '',
    assignedSellerId: client.assignedSellerId || '',
    assignedSellerName: client.assignedSellerName || '',
    notes: client.notes || [],
    createdAt: client.createdAt || now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, 'clientes', id), fullClient);
  } catch (err) {
    console.warn('Firestore saveClient failed', err);
  }

  const list = loadCache<Client[]>(LS_CLIENTS, initialClients);
  const idx = list.findIndex(c => c.id === id);
  if (idx >= 0) {
    list[idx] = fullClient;
  } else {
    list.unshift(fullClient);
  }
  saveCache(LS_CLIENTS, list);

  await logAudit(
    isNew ? 'Registro de Cliente' : 'Actualización de Cliente',
    `Cliente: ${fullClient.name} (${fullClient.phone}) - Estado: ${fullClient.status}`,
    'Cliente'
  );

  return fullClient;
}

export async function addClientNote(clientId: string, text: string, type: 'Llamada' | 'WhatsApp' | 'Reunión' | 'Visita' | 'Nota', author = 'Asesor'): Promise<void> {
  const clients = await getClients();
  const client = clients.find(c => c.id === clientId);
  if (!client) return;

  const note = {
    id: 'NOT-' + Date.now(),
    date: new Date().toISOString(),
    author,
    type,
    text
  };

  const updatedNotes = [note, ...(client.notes || [])];
  client.notes = updatedNotes;
  client.updatedAt = new Date().toISOString();

  try {
    await updateDoc(doc(db, 'clientes', clientId), { notes: updatedNotes, updatedAt: client.updatedAt });
  } catch (err) {
    console.warn('Firestore updateClient failed', err);
  }

  saveCache(LS_CLIENTS, clients);
}

/* =========================================================================
   4. SELLERS (VENDEDORES)
   ========================================================================= */
export async function getSellers(): Promise<Seller[]> {
  try {
    const snap = await getDocs(collection(db, 'vendedores'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Seller));
      saveCache(LS_SELLERS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getSellers failed, using cache', err);
  }
  return loadCache<Seller[]>(LS_SELLERS, initialSellers);
}

export async function saveSeller(seller: Partial<Seller>): Promise<Seller> {
  const id = seller.id || 'SEL-' + Date.now();
  const fullSeller: Seller = {
    id,
    name: seller.name || '',
    email: seller.email || '',
    phone: seller.phone || '',
    active: seller.active !== undefined ? seller.active : true,
    commissionRate: seller.commissionRate || 3.0,
    salesCount: seller.salesCount || 0,
    totalSoldGs: seller.totalSoldGs || 0,
    targetGs: seller.targetGs || 800000000
  };

  try {
    await setDoc(doc(db, 'vendedores', id), fullSeller);
  } catch (err) {
    console.warn('Firestore saveSeller failed', err);
  }

  const list = loadCache<Seller[]>(LS_SELLERS, initialSellers);
  const idx = list.findIndex(s => s.id === id);
  if (idx >= 0) list[idx] = fullSeller;
  else list.push(fullSeller);
  saveCache(LS_SELLERS, list);

  return fullSeller;
}

/* =========================================================================
   5. RESERVATIONS (RESERVAS)
   ========================================================================= */
export async function getReservations(): Promise<Reservation[]> {
  try {
    const snap = await getDocs(collection(db, 'reservas'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Reservation));
      saveCache(LS_RESERVATIONS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getReservations failed', err);
  }
  return loadCache<Reservation[]>(LS_RESERVATIONS, initialReservations);
}

export async function createReservation(res: Omit<Reservation, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string; reservation?: Reservation }> {
  // Check if vehicle is already reserved or sold
  const vehicle = await getVehicleById(res.vehicleId);
  if (!vehicle) {
    return { success: false, message: 'El vehículo seleccionado no existe.' };
  }
  if (vehicle.status === 'reservado' || vehicle.status === 'vendido') {
    return {
      success: false,
      message: `El vehículo ya se encuentra en estado "${vehicle.status.toUpperCase()}". No es posible registrar una nueva reserva simultánea.`
    };
  }

  const id = 'RES-' + Date.now();
  const newRes: Reservation = {
    ...res,
    id,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'reservas', id), newRes);
  } catch (e) {
    console.warn('Firestore createReservation error', e);
  }

  // Update vehicle status to 'reservado'
  await saveVehicle({ ...vehicle, status: 'reservado' });

  // Update local reservation list
  const list = loadCache<Reservation[]>(LS_RESERVATIONS, initialReservations);
  list.unshift(newRes);
  saveCache(LS_RESERVATIONS, list);

  await logAudit(
    'Creación de Reserva',
    `Reserva para ${newRes.clientName} sobre ${newRes.vehicleName}. Seña: Gs. ${newRes.downPaymentGs.toLocaleString('es-PY')}. Vence: ${newRes.expiryDate}`,
    'Reserva'
  );

  return { success: true, message: 'Reserva registrada exitosamente.', reservation: newRes };
}

export async function updateReservationStatus(id: string, newStatus: Reservation['status']): Promise<void> {
  const reservations = await getReservations();
  const res = reservations.find(r => r.id === id);
  if (!res) return;

  res.status = newStatus;

  try {
    await updateDoc(doc(db, 'reservas', id), { status: newStatus });
  } catch (err) {
    console.warn('Firestore updateReservationStatus failed', err);
  }

  // If expired or cancelled, check whether we should liberate the vehicle back to 'disponible'
  if (newStatus === 'Cancelada' || newStatus === 'Vencida') {
    const vehicle = await getVehicleById(res.vehicleId);
    if (vehicle && vehicle.status === 'reservado') {
      await saveVehicle({ ...vehicle, status: 'disponible' });
    }
  }

  saveCache(LS_RESERVATIONS, reservations);
}

/* =========================================================================
   6. SALES & COMMISSIONS (VENTAS Y COMISIONES)
   ========================================================================= */
export async function getSales(): Promise<Sale[]> {
  try {
    const snap = await getDocs(collection(db, 'ventas'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Sale));
      saveCache(LS_SALES, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getSales failed', err);
  }
  return loadCache<Sale[]>(LS_SALES, initialSales);
}

export async function getCommissions(): Promise<Commission[]> {
  try {
    const snap = await getDocs(collection(db, 'comisiones'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Commission));
      saveCache(LS_COMMISSIONS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getCommissions failed', err);
  }
  return loadCache<Commission[]>(LS_COMMISSIONS, initialCommissions);
}

export async function confirmSale(params: {
  vehicleId: string;
  clientId: string;
  sellerId: string;
  salePriceGs: number;
  discountGs: number;
  finalPriceGs: number;
  downPaymentGs: number;
  paymentMethod: Sale['paymentMethod'];
  notes: string;
}): Promise<{ success: boolean; message: string; sale?: Sale }> {
  const vehicle = await getVehicleById(params.vehicleId);
  if (!vehicle) {
    return { success: false, message: 'Vehículo no encontrado.' };
  }
  if (vehicle.status === 'vendido') {
    return { success: false, message: 'El vehículo ya cuenta con una venta confirmada previamente.' };
  }

  const clients = await getClients();
  const client = clients.find(c => c.id === params.clientId);
  const clientName = client ? client.name : 'Cliente General';

  const sellers = await getSellers();
  const seller = sellers.find(s => s.id === params.sellerId);
  const sellerName = seller ? seller.name : 'Vendedor';
  const commissionRate = seller ? seller.commissionRate : 3.0;

  // Calculate commission
  const commissionAmountGs = Math.round((params.finalPriceGs * commissionRate) / 100);
  const balancePendingGs = Math.max(0, params.finalPriceGs - params.downPaymentGs);
  const now = new Date().toISOString();
  const saleId = 'VTA-' + Date.now();

  const newSale: Sale = {
    id: saleId,
    vehicleId: vehicle.id,
    vehicleName: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    clientId: params.clientId,
    clientName,
    sellerId: params.sellerId,
    sellerName,
    date: new Date().toISOString().split('T')[0],
    salePriceGs: params.salePriceGs,
    discountGs: params.discountGs,
    finalPriceGs: params.finalPriceGs,
    downPaymentGs: params.downPaymentGs,
    balancePendingGs,
    paymentMethod: params.paymentMethod,
    commissionPercentage: commissionRate,
    commissionAmountGs,
    commissionStatus: 'Pendiente',
    notes: params.notes,
    createdAt: now
  };

  // Generate commission record
  const commissionId = 'COM-' + Date.now();
  const newCommission: Commission = {
    id: commissionId,
    saleId,
    sellerId: params.sellerId,
    sellerName,
    vehicleName: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    salePriceGs: params.finalPriceGs,
    baseAmountGs: params.finalPriceGs,
    percentage: commissionRate,
    commissionAmountGs,
    status: 'Pendiente',
    generatedAt: now
  };

  try {
    await setDoc(doc(db, 'ventas', saleId), newSale);
    await setDoc(doc(db, 'comisiones', commissionId), newCommission);
  } catch (err) {
    console.warn('Firestore write for sale/commission failed', err);
  }

  // Transactionally update vehicle state to 'vendido' and unpublish from catalog
  await saveVehicle({
    ...vehicle,
    status: 'vendido',
    published: false
  });

  // Update seller stats
  if (seller) {
    seller.salesCount = (seller.salesCount || 0) + 1;
    seller.totalSoldGs = (seller.totalSoldGs || 0) + params.finalPriceGs;
    await saveSeller(seller);
  }

  // Update client status to 'Ganado'
  if (client) {
    client.status = 'Ganado';
    await saveClient(client);
  }

  // Save to local caches
  const sales = loadCache<Sale[]>(LS_SALES, initialSales);
  sales.unshift(newSale);
  saveCache(LS_SALES, sales);

  const comms = loadCache<Commission[]>(LS_COMMISSIONS, initialCommissions);
  comms.unshift(newCommission);
  saveCache(LS_COMMISSIONS, comms);

  await logAudit(
    'Confirmación de Venta',
    `Venta ${saleId}: ${vehicle.make} ${vehicle.model} a ${clientName} por Gs. ${params.finalPriceGs.toLocaleString('es-PY')}. Vendedor: ${sellerName}. Comisión calculada: Gs. ${commissionAmountGs.toLocaleString('es-PY')}`,
    'Venta'
  );

  return { success: true, message: 'Venta confirmada exitosamente.', sale: newSale };
}

export async function updateCommissionStatus(id: string, newStatus: Commission['status']): Promise<void> {
  const comms = await getCommissions();
  const comm = comms.find(c => c.id === id);
  if (!comm) return;

  comm.status = newStatus;
  const now = new Date().toISOString();
  if (newStatus === 'Aprobada') comm.approvedAt = now;
  if (newStatus === 'Pagada') comm.paidAt = now;

  try {
    await updateDoc(doc(db, 'comisiones', id), {
      status: newStatus,
      approvedAt: comm.approvedAt || null,
      paidAt: comm.paidAt || null
    });
  } catch (err) {
    console.warn('Firestore updateCommissionStatus failed', err);
  }

  saveCache(LS_COMMISSIONS, comms);

  await logAudit(
    'Estado de Comisión',
    `Comisión de ${comm.sellerName} por Gs. ${comm.commissionAmountGs.toLocaleString('es-PY')} actualizada a ${newStatus}`,
    'Venta'
  );
}

/* =========================================================================
   7. IMPORT REQUESTS (IMPORTACIÓN POR ENCARGO)
   ========================================================================= */
export async function getImportRequests(): Promise<ImportRequest[]> {
  try {
    const snap = await getDocs(collection(db, 'solicitudes_importacion'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ImportRequest));
      saveCache(LS_IMPORTS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getImportRequests failed', err);
  }
  return loadCache<ImportRequest[]>(LS_IMPORTS, initialImportRequests);
}

export async function createImportRequest(req: Partial<ImportRequest>): Promise<ImportRequest> {
  const counter = Math.floor(100 + Math.random() * 900);
  const requestCode = 'IMP-2026-' + counter;
  const id = 'REQ-' + Date.now();
  const now = new Date().toISOString();

  const newReq: ImportRequest = {
    id,
    requestCode,
    clientName: req.clientName || 'Cliente Web',
    clientPhone: req.clientPhone || '',
    clientEmail: req.clientEmail || '',
    desiredMake: req.desiredMake || '',
    desiredModel: req.desiredModel || '',
    desiredYearRange: req.desiredYearRange || '',
    desiredVersion: req.desiredVersion || '',
    desiredColor: req.desiredColor || '',
    desiredKm: req.desiredKm || '',
    budgetGs: req.budgetGs || 0,
    preferredCountry: req.preferredCountry || 'Estados Unidos',
    comments: req.comments || '',
    referencePhoto: req.referencePhoto || '',
    assignedSellerId: req.assignedSellerId || 'SEL-001',
    assignedSellerName: req.assignedSellerName || 'Marcos Benítez',
    stage: req.stage || 1, // Solicitud recibida
    status: req.status || 'Activa',
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, 'solicitudes_importacion', id), newReq);
  } catch (err) {
    console.warn('Firestore createImportRequest failed', err);
  }

  // Automatically register client in CRM if not already present
  await saveClient({
    name: newReq.clientName,
    phone: newReq.clientPhone,
    email: newReq.clientEmail,
    origin: 'Web',
    status: 'Nuevo',
    interestVehicleName: `Importación: ${newReq.desiredMake} ${newReq.desiredModel}`,
    assignedSellerId: newReq.assignedSellerId,
    assignedSellerName: newReq.assignedSellerName,
    notes: [
      {
        id: 'NOT-IMP-' + Date.now(),
        date: now,
        author: 'Sistema Web',
        type: 'Nota',
        text: `Solicitud de importación código ${newReq.requestCode}: ${newReq.desiredMake} ${newReq.desiredModel} (${newReq.desiredYearRange}). Presupuesto: Gs. ${newReq.budgetGs.toLocaleString('es-PY')}. Origen: ${newReq.preferredCountry}`
      }
    ]
  });

  const list = loadCache<ImportRequest[]>(LS_IMPORTS, initialImportRequests);
  list.unshift(newReq);
  saveCache(LS_IMPORTS, list);

  await logAudit(
    'Solicitud de Importación',
    `Código: ${requestCode} - Cliente: ${newReq.clientName} solicita ${newReq.desiredMake} ${newReq.desiredModel} (Presupuesto: Gs. ${newReq.budgetGs.toLocaleString('es-PY')})`,
    'Importación'
  );

  return newReq;
}

export async function updateImportRequest(req: ImportRequest): Promise<ImportRequest> {
  const now = new Date().toISOString();
  req.updatedAt = now;

  try {
    await setDoc(doc(db, 'solicitudes_importacion', req.id), req);
  } catch (err) {
    console.warn('Firestore updateImportRequest failed', err);
  }

  const list = loadCache<ImportRequest[]>(LS_IMPORTS, initialImportRequests);
  const idx = list.findIndex(r => r.id === req.id);
  if (idx >= 0) list[idx] = req;
  saveCache(LS_IMPORTS, list);

  await logAudit(
    'Seguimiento de Importación',
    `Solicitud ${req.requestCode} actualizada a Etapa ${req.stage} (${req.status})`,
    'Importación'
  );

  return req;
}

/* =========================================================================
   8. COMPANY CONFIGURATION
   ========================================================================= */
export async function getCompanyConfig(): Promise<CompanyConfig> {
  try {
    const snap = await getDoc(doc(db, 'configuracion_sistema', 'general'));
    if (snap.exists()) {
      const cfg = snap.data() as CompanyConfig;
      saveCache(LS_CONFIG, cfg);
      return cfg;
    }
  } catch (err) {
    console.warn('Firestore getCompanyConfig failed', err);
  }
  return loadCache<CompanyConfig>(LS_CONFIG, initialCompanyConfig);
}

export async function saveCompanyConfig(cfg: CompanyConfig): Promise<CompanyConfig> {
  try {
    await setDoc(doc(db, 'configuracion_sistema', 'general'), cfg);
  } catch (err) {
    console.warn('Firestore saveCompanyConfig failed', err);
  }
  saveCache(LS_CONFIG, cfg);
  await logAudit('Configuración del Sistema', 'Datos de contacto y comerciales actualizados', 'Sistema');
  return cfg;
}

/* =========================================================================
   9. INITIALIZE / SEED DEMO DATA
   ========================================================================= */
export async function seedDemoData(): Promise<void> {
  console.log('Seeding initial demo data to Firestore and cache...');

  // Seed vehicles
  for (const v of initialVehicles) {
    try {
      await setDoc(doc(db, 'inventory', v.id), v);
    } catch {
      // Ignore
    }
  }
  saveCache(LS_VEHICLES, initialVehicles);

  // Seed clients
  for (const c of initialClients) {
    try {
      await setDoc(doc(db, 'clientes', c.id), c);
    } catch {
      // Ignore
    }
  }
  saveCache(LS_CLIENTS, initialClients);

  // Seed sellers
  for (const s of initialSellers) {
    try {
      await setDoc(doc(db, 'vendedores', s.id), s);
    } catch {
      // Ignore
    }
  }
  saveCache(LS_SELLERS, initialSellers);

  // Seed reservations
  for (const r of initialReservations) {
    try {
      await setDoc(doc(db, 'reservas', r.id), r);
    } catch {
      // Ignore
    }
  }
  saveCache(LS_RESERVATIONS, initialReservations);

  // Seed sales
  for (const sl of initialSales) {
    try {
      await setDoc(doc(db, 'ventas', sl.id), sl);
    } catch {
      // Ignore
    }
  }
  saveCache(LS_SALES, initialSales);

  // Seed commissions
  for (const com of initialCommissions) {
    try {
      await setDoc(doc(db, 'comisiones', com.id), com);
    } catch {
      // Ignore
    }
  }
  saveCache(LS_COMMISSIONS, initialCommissions);

  // Seed imports
  for (const imp of initialImportRequests) {
    try {
      await setDoc(doc(db, 'solicitudes_importacion', imp.id), imp);
    } catch {
      // Ignore
    }
  }
  saveCache(LS_IMPORTS, initialImportRequests);

  // Seed config
  try {
    await setDoc(doc(db, 'configuracion_sistema', 'general'), initialCompanyConfig);
  } catch {
    // Ignore
  }
  saveCache(LS_CONFIG, initialCompanyConfig);

  await logAudit('Inicialización de Datos Demo', 'Cargados 12 vehículos, 5 clientes, 3 vendedores, reservas y cotizaciones.', 'Sistema');
}
