export type VehicleStatus = 'disponible' | 'reservado' | 'vendido' | 'en_preparacion' | 'no_disponible';
export type FuelType = 'Nafta' | 'Diésel' | 'Híbrido' | 'Flex' | 'Eléctrico';
export type TransmissionType = 'Automático' | 'Mecánico' | 'Secuencial';

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  version: string;
  year: number;
  km: number;
  fuel: FuelType;
  transmission: TransmissionType;
  color: string;
  cylinder: string;
  buyPriceGs: number; // Confidential cost
  expensesGs: number; // Transport, customs, prep
  priceGs: number; // Public sale price
  status: VehicleStatus;
  published: boolean;
  location: string;
  images: string[];
  description: string;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export type ClientOrigin = 'Web' | 'WhatsApp' | 'Facebook' | 'Instagram' | 'Referido' | 'Presencial';
export type ClientStatus = 'Nuevo' | 'Contactado' | 'Interesado' | 'Cotizacion_enviada' | 'En_negociacion' | 'Reservado' | 'Ganado' | 'Perdido';

export interface FollowUpNote {
  id: string;
  date: string;
  author: string;
  type: 'Llamada' | 'WhatsApp' | 'Reunión' | 'Visita' | 'Nota';
  text: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  documentId?: string; // CI / RUC
  city?: string;
  origin: ClientOrigin;
  status: ClientStatus;
  interestVehicleId?: string;
  interestVehicleName?: string;
  assignedSellerId?: string;
  assignedSellerName?: string;
  notes?: FollowUpNote[];
  createdAt: string;
  updatedAt?: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  commissionRate: number; // percentage, e.g. 3 for 3%
  salesCount: number;
  totalSoldGs: number;
  targetGs: number;
}

export type ReservationStatus = 'Pendiente' | 'Confirmada' | 'Vencida' | 'Cancelada' | 'Convertida_en_venta';

export interface Reservation {
  id: string;
  vehicleId: string;
  vehicleName: string;
  clientId: string;
  clientName: string;
  sellerId: string;
  sellerName: string;
  date: string;
  expiryDate: string;
  downPaymentGs: number; // Seña / Anticipo
  status: ReservationStatus;
  notes: string;
  createdAt: string;
}

export type PaymentMethod = 'Contado' | 'Financiado Propio' | 'Financiado Bancario' | 'Entrega + Cuotas';

export interface Sale {
  id: string;
  vehicleId: string;
  vehicleName: string;
  clientId: string;
  clientName: string;
  sellerId: string;
  sellerName: string;
  date: string;
  salePriceGs: number;
  discountGs: number;
  finalPriceGs: number;
  downPaymentGs: number;
  balancePendingGs: number;
  paymentMethod: PaymentMethod;
  commissionPercentage: number;
  commissionAmountGs: number;
  commissionStatus: 'Pendiente' | 'Aprobada' | 'Pagada' | 'Anulada';
  notes: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  saleId: string;
  sellerId: string;
  sellerName: string;
  vehicleName: string;
  salePriceGs: number;
  baseAmountGs: number;
  percentage: number;
  commissionAmountGs: number;
  status: 'Pendiente' | 'Aprobada' | 'Pagada' | 'Anulada';
  generatedAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export type ImportStage =
  | 1 // Solicitud recibida
  | 2 // Búsqueda del vehículo
  | 3 // Vehículo encontrado
  | 4 // Cotización preparada
  | 5 // Cotización enviada
  | 6 // Cotización aceptada por cliente
  | 7 // Anticipo solicitado
  | 8 // Anticipo confirmado (requisito para comprar)
  | 9 // Compra realizada
  | 10 // En tránsito
  | 11 // Llegada a Paraguay
  | 12 // Inspección y documentación
  | 13; // Entregado al cliente

export interface ImportQuotation {
  vehicleEstimatedPriceGs: number;
  transportCostGs: number;
  importTaxesGs: number;
  otherCostsGs: number;
  serviceFeeGs: number;
  totalEstimatedGs: number;
  advanceRequiredGs: number; // Anticipo mínimo
  validityDate: string;
  commercialTerms: string;
  clientAccepted: boolean;
  clientAcceptedDate?: string;
  advanceConfirmed: boolean;
  advanceConfirmedDate?: string;
}

export interface ImportRequest {
  id: string;
  requestCode: string; // e.g. IMP-2026-001
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  desiredMake: string;
  desiredModel: string;
  desiredYearRange: string;
  desiredVersion: string;
  desiredColor: string;
  desiredKm: string;
  budgetGs: number;
  preferredCountry: string;
  comments: string;
  referencePhoto?: string;
  assignedSellerId?: string;
  assignedSellerName?: string;
  stage: ImportStage;
  status: 'Activa' | 'Cancelada' | 'Rechazada' | 'Completada';
  quotation?: ImportQuotation;
  actualCostGs?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  entityType: 'Vehículo' | 'Cliente' | 'Venta' | 'Reserva' | 'Importación' | 'Sistema';
}

export interface CompanyConfig {
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  hoursWeekday: string;
  hoursSaturday: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  defaultReservationDays: number;
  defaultCommissionRate: number;
}

export type UserRole = 'SUPERADMIN' | 'GERENTE' | 'ADMINISTRADOR' | 'VENDEDOR' | 'MARKETING';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  sellerId?: string;
}
