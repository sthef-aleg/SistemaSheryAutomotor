import { Vehicle, Client, Seller, Reservation, Sale, Commission, ImportRequest, CompanyConfig } from '../types';

export const initialCompanyConfig: CompanyConfig = {
  companyName: 'SHERY AUTOMOTORES',
  phone: '0981 123 456',
  whatsapp: '0981 123 456',
  email: 'contacto@sheryautomotores.com.py',
  address: 'Avda. Eusebio Ayala c/ Boggiani N° 3450',
  city: 'Asunción, Paraguay',
  hoursWeekday: 'Lunes a Viernes: 08:00 - 18:00 hs',
  hoursSaturday: 'Sábados: 08:00 - 13:00 hs',
  instagram: 'https://instagram.com/sheryautomotores',
  facebook: 'https://facebook.com/sheryautomotores',
  tiktok: 'https://tiktok.com/@sheryautomotores',
  defaultReservationDays: 7,
  defaultCommissionRate: 3.0
};

export const initialVehicles: Vehicle[] = [
  {
    id: 'VIN-TOY-COR-2022',
    vin: '2T1BURHE7NC198234',
    make: 'Toyota',
    model: 'Corolla',
    version: 'GLi 2.0 Dual VVT-i',
    year: 2022,
    km: 35000,
    fuel: 'Nafta',
    transmission: 'Automático',
    color: 'Blanco Perlado',
    cylinder: '2.000 cc',
    buyPriceGs: 72000000,
    expensesGs: 6500000,
    priceGs: 95000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590362891988-f77804703088?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Impecable Toyota Corolla importado, sin detalles de chapa ni pintura. Mantenimiento al día en concesionaria oficial, único dueño en origen. Documentación al día con despacho pagado y listo para transferir.',
    features: [
      'Cámara de retroceso con guías dinámicas',
      'Pantalla multimedia táctil con Apple CarPlay y Android Auto',
      'Control de velocidad crucero adaptativo',
      'Faros delanteros LED con sensor de encendido automático',
      'Llantas de aleación aro 17 pulgadas',
      'Frenos de disco en las 4 ruedas con ABS y EBD',
      '7 airbags (frontales, laterales, cortina y rodilla)'
    ],
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-HYU-TUC-2021',
    vin: 'KM8J33A46MU782190',
    make: 'Hyundai',
    model: 'Tucson',
    version: 'Limited 2.0 CRDi AWD',
    year: 2021,
    km: 45000,
    fuel: 'Diésel',
    transmission: 'Automático',
    color: 'Gris Grafito Metalizado',
    cylinder: '2.000 cc Turbo Diésel',
    buyPriceGs: 98000000,
    expensesGs: 8200000,
    priceGs: 130000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Excelente SUV de consumo ultra eficiente gracias a su motor turbo diésel intercooler. Tracción integral inteligente AWD, techo panorámico eléctrico y tapizado en cuero de fábrica.',
    features: [
      'Techo solar panorámico con apertura eléctrica',
      'Tapizado de cuero premium color negro',
      'Asientos delanteros con ajuste eléctrico y memoria',
      'Tracción All-Wheel Drive (AWD)',
      'Portón trasero eléctrico inteligente con sensor de pie',
      'Cargador inalámbrico para smartphone',
      'Climatizador digital bi-zona'
    ],
    createdAt: '2026-10-12T14:30:00Z',
    updatedAt: '2026-10-20T09:15:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-KIA-CER-2022',
    vin: 'KNAFX4A86N5348912',
    make: 'Kia',
    model: 'Cerato',
    version: 'SX 1.6 Flex AT',
    year: 2022,
    km: 28000,
    fuel: 'Nafta',
    transmission: 'Automático',
    color: 'Blanco Nieve',
    cylinder: '1.600 cc',
    buyPriceGs: 68000000,
    expensesGs: 5500000,
    priceGs: 90000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Sedán compacto con diseño deportivo y aerodinámico. Muy bajo kilometraje verificado. Excelente rendimiento urbano y en ruta, dirección electroasistida suave y precisa.',
    features: [
      'Modos de conducción Eco / Normal / Sport',
      'Encendido por botón Start/Stop con llave inteligente',
      'Luces diurnas DRL en LED de alta intensidad',
      'Sensor de estacionamiento delantero y trasero',
      'Volante multifunción forrado en cuero',
      'Control de estabilidad electrónica (ESC)'
    ],
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-22T16:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-HON-CRV-2021',
    vin: '7FARW1H83ME019284',
    make: 'Honda',
    model: 'CR-V',
    version: 'EX-L 1.5 Turbo VTEC',
    year: 2021,
    km: 40000,
    fuel: 'Nafta',
    transmission: 'Automático',
    color: 'Negro Cristal Perlado',
    cylinder: '1.500 cc Turbo 190 HP',
    buyPriceGs: 110000000,
    expensesGs: 9500000,
    priceGs: 145000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'La SUV familiar por excelencia. Máximo nivel de confort y seguridad activa con el paquete Honda Sensing. Espacio interior inigualable y baúl con capacidad para 522 litros.',
    features: [
      'Paquete Honda Sensing: freno autónomo y mantenimiento de carril',
      'Asientos de cuero con calefacción delantera',
      'Audio premium de 330 Watts con 8 parlantes y subwoofer',
      'Apertura de baúl con manos libres',
      'Freno de mano eléctrico con función Brake Hold',
      'Sunroof corredizo de cristal templado'
    ],
    createdAt: '2026-10-18T09:00:00Z',
    updatedAt: '2026-10-25T17:40:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-TOY-RAV-2023',
    vin: '4T3B1RFV5PU481920',
    make: 'Toyota',
    model: 'RAV4',
    version: 'Limited 2.5 Hybrid AWD',
    year: 2023,
    km: 19000,
    fuel: 'Híbrido',
    transmission: 'Automático',
    color: 'Gris Plata Metalizado',
    cylinder: '2.500 cc Híbrido 219 HP',
    buyPriceGs: 165000000,
    expensesGs: 12000000,
    priceGs: 215000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Toyota RAV4 Híbrida 2023 con autonomía superior a 850 km por tanque. Silencio de marcha absoluto y torque instantáneo con tracción e-Four en las cuatro ruedas.',
    features: [
      'Sistema Híbrido Autorecordable con batería en garantía',
      'Toyota Safety Sense 2.5 con radar de peatones',
      'Visor de punto ciego (BSM) y alerta de tráfico cruzado',
      'Cámara de visión periférica 360 grados',
      'Climatizador bi-zona con tecnología nanoe™',
      'Llantas de aleación diamantadas aro 19'
    ],
    createdAt: '2026-10-20T11:20:00Z',
    updatedAt: '2026-10-26T18:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-MAZ-CX5-2022',
    vin: 'JM3KFBCM9N0592813',
    make: 'Mazda',
    model: 'CX-5',
    version: 'Grand Touring 2.5 SkyActiv-G',
    year: 2022,
    km: 32000,
    fuel: 'Nafta',
    transmission: 'Automático',
    color: 'Rojo Soul Red Crystal',
    cylinder: '2.500 cc 188 HP',
    buyPriceGs: 115000000,
    expensesGs: 8800000,
    priceGs: 148000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'El diseño KODO en su máxima expresión. Pintura especial Soul Red Crystal de triple capa. Audio Bose de 10 bocinas y acabados interiores que compiten directamente con el segmento premium alemán.',
    features: [
      'Sistema de sonido BOSE Surround de 10 altavoces',
      'Head-Up Display proyectado en el parabrisas',
      'Asientos de cuero perforado con ventilación y calefacción',
      'G-Vectoring Control Plus para mayor estabilidad en curvas',
      'Faros adaptativos Full LED con lavafaros',
      'Retrovisores exteriores con plegado automático'
    ],
    createdAt: '2026-10-22T08:45:00Z',
    updatedAt: '2026-10-27T10:10:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-FOR-RAN-2022',
    vin: '8AFAR2240N7194832',
    make: 'Ford',
    model: 'Ranger',
    version: 'Limited 3.2 TDCi 4x4',
    year: 2022,
    km: 48000,
    fuel: 'Diésel',
    transmission: 'Automático',
    color: 'Azul Belice Metalizado',
    cylinder: '3.200 cc 5 Cilindros 200 HP',
    buyPriceGs: 175000000,
    expensesGs: 11000000,
    priceGs: 220000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Potencia y robustez total para el campo o la ciudad. Motor Puma 3.2 turbodiésel con 470 Nm de torque. Barra antivuelco cromada, lona marítima y protector de carrocería incluidos.',
    features: [
      'Tracción 4x4 con reductora electrónica y bloqueo de diferencial trasero',
      'Capacidad de vadeo de hasta 800 mm',
      'Control de balanceo de trailer y control de descenso',
      'SYNC 3 con pantalla táctil de 8 pulgadas y GPS integrado',
      'Enganche de remolque original homologado',
      'Sensores delanteros y traseros con cámara de reversa'
    ],
    createdAt: '2026-10-24T12:00:00Z',
    updatedAt: '2026-10-28T14:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-BMW-320-2021',
    vin: 'WBA5R1C51ME294819',
    make: 'BMW',
    model: '320i',
    version: 'M Sport 2.0 TwinPower Turbo',
    year: 2021,
    km: 36000,
    fuel: 'Nafta',
    transmission: 'Automático',
    color: 'Azul Portimao Metalizado',
    cylinder: '2.000 cc Turbo 184 HP',
    buyPriceGs: 195000000,
    expensesGs: 14500000,
    priceGs: 250000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'La referencia mundial en dinamismo de conducción. Paquete M Sport completo interior y exterior con suspensión deportiva M, asientos deportivos con costuras azules y volante M.',
    features: [
      'BMW Live Cockpit Professional con cuadro digital de 12.3 pulgadas',
      'Transmisión Steptronic deportiva de 8 velocidades con levas al volante',
      'Paquete aerodinámico M y llantas de aleación ligera M de 18 pulgadas',
      'Iluminación ambiental interior personalizable en 6 colores',
      'Frenos deportivos M con pinzas en azul brillante',
      'Asistente de estacionamiento automático'
    ],
    createdAt: '2026-10-25T15:00:00Z',
    updatedAt: '2026-10-29T11:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-MBZ-C20-2022',
    vin: 'W1KAF4HB5NN918234',
    make: 'Mercedes-Benz',
    model: 'C200',
    version: 'Avantgarde Mild-Hybrid EQ Boost',
    year: 2022,
    km: 22000,
    fuel: 'Híbrido',
    transmission: 'Automático',
    color: 'Plata Iridio Metalizado',
    cylinder: '1.500 cc Turbo + Motor Eléctrico 204 HP',
    buyPriceGs: 230000000,
    expensesGs: 16000000,
    priceGs: 295000000,
    status: 'reservado',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Lujo vanguardista de la nueva generación Clase C (W206). Pantalla central vertical tipo tablet de 11.9 pulgadas con sistema multimedia MBUX de segunda generación y navegación con realidad aumentada.',
    features: [
      'Sistema multimedia MBUX con comandos de voz inteligentes "Hey Mercedes"',
      'Faros LED High Performance con asistente de luces altas',
      'Tecnología microhíbrida de 48V para ahorro de combustible',
      'Tapizado en símil de cuero ARTICO negro con molduras en negro brillante',
      'Escáner de huella dactilar para perfiles de conductor personalizados',
      'Paquete de confort acústico con vidrios insonorizantes'
    ],
    createdAt: '2026-10-26T10:00:00Z',
    updatedAt: '2026-10-30T17:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-VWW-AMA-2023',
    vin: 'WV1ZZZ2HZPP029381',
    make: 'Volkswagen',
    model: 'Amarok',
    version: 'V6 Extreme 3.0 TDI 4Motion',
    year: 2023,
    km: 25000,
    fuel: 'Diésel',
    transmission: 'Automático',
    color: 'Azul Ravenna Mate',
    cylinder: '3.000 cc V6 Turbo 258 HP',
    buyPriceGs: 220000000,
    expensesGs: 13500000,
    priceGs: 275000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'La pickup más potente de su segmento con función Overboost que eleva la potencia a 272 HP. Tapizado en cuero Nappa, llantas Talca de 20 pulgadas y tracción integral permanente 4Motion.',
    features: [
      'Motor V6 3.0 TDI con 258 CV y 580 Nm de torque',
      'Transmisión automática ZF de 8 velocidades',
      'Tracción permanente 4Motion con diferencial Torsen',
      'Butacas ergoComfort con regulación eléctrica en 14 posiciones',
      'Barra Sportsbar aerodinámica con estribos planos de aluminio',
      'Bloqueo mecánico de diferencial trasero'
    ],
    createdAt: '2026-10-27T16:00:00Z',
    updatedAt: '2026-10-31T09:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-JEE-COM-2022',
    vin: '3C4NJDBB3NT218492',
    make: 'Jeep',
    model: 'Compass',
    version: 'Limited T270 Turbo 1.3',
    year: 2022,
    km: 30000,
    fuel: 'Nafta',
    transmission: 'Automático',
    color: 'Gris Sting',
    cylinder: '1.300 cc Turbo 175 HP',
    buyPriceGs: 105000000,
    expensesGs: 8500000,
    priceGs: 135000000,
    status: 'vendido',
    published: false,
    location: 'Entregado al cliente',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'SUV de espíritu aventurero con nuevo motor turbo T270 de excelente respuesta. Techo bi-tono en negro brillante y panel de instrumentos totalmente digital.',
    features: [
      'Cuadro de instrumentos full digital de 10.25 pulgadas',
      'Pantalla central Uconnect de 10.1 pulgadas con conexión inalámbrica',
      'Faros delanteros y traseros con tecnología Full LED',
      'Park Assist autónomo en paralelo y perpendicular',
      'Sensor de lluvia y crepuscular'
    ],
    createdAt: '2026-10-14T09:30:00Z',
    updatedAt: '2026-11-01T11:20:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  },
  {
    id: 'VIN-NIS-KIC-2022',
    vin: '3N1CP5CU8NL491823',
    make: 'Nissan',
    model: 'Kicks',
    version: 'Exclusive 1.6 CVT',
    year: 2022,
    km: 26000,
    fuel: 'Nafta',
    transmission: 'Automático',
    color: 'Naranja Solar con Techo Negro',
    cylinder: '1.600 cc 118 HP',
    buyPriceGs: 62000000,
    expensesGs: 4800000,
    priceGs: 82000000,
    status: 'disponible',
    published: true,
    location: 'Showroom Central - Asunción',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Crossover urbano de bajo costo operativo y excelente economía de combustible. Versión Exclusive tope de gama con sistema de sonido Bose Personal integrado en el apoyacabezas del conductor.',
    features: [
      'Sistema de sonido BOSE Personal con parlantes UltraNearfield en apoyacabeza',
      'Visor Around View Monitor con visión aérea 360 grados',
      'Alerta de colisión frontal con frenado de emergencia',
      'Asientos Zero Gravity inspirados en tecnología de la NASA',
      'Tapizado bitono en cuero negro y habano'
    ],
    createdAt: '2026-10-28T13:00:00Z',
    updatedAt: '2026-10-31T15:00:00Z',
    updatedBy: 'admin@sheryautomotores.com'
  }
];

export const initialClients: Client[] = [
  {
    id: 'CLI-001',
    name: 'Ing. Carlos Mendoza',
    phone: '0981 445 678',
    email: 'carlos.mendoza@gmail.com',
    city: 'Asunción',
    origin: 'Web',
    status: 'Interesado',
    interestVehicleId: 'VIN-TOY-RAV-2023',
    interestVehicleName: 'Toyota RAV4 Limited Hybrid 2023',
    assignedSellerId: 'SEL-001',
    assignedSellerName: 'Marcos Benítez',
    notes: [
      {
        id: 'NOT-1',
        date: '2026-10-25T11:00:00Z',
        author: 'Marcos Benítez',
        type: 'WhatsApp',
        text: 'Consultó por la autonomía en ruta y formas de financiación bancaria a 36 meses.'
      },
      {
        id: 'NOT-2',
        date: '2026-10-28T15:30:00Z',
        author: 'Marcos Benítez',
        type: 'Visita',
        text: 'Vino a ver el vehículo en el showroom. Quedó muy satisfecho con el test drive.'
      }
    ],
    createdAt: '2026-10-25T10:15:00Z'
  },
  {
    id: 'CLI-002',
    name: 'Dra. María Elena Villalba',
    phone: '0971 890 123',
    email: 'dra.villalba@consultoriomed.com',
    city: 'San Lorenzo',
    origin: 'WhatsApp',
    status: 'Cotizacion_enviada',
    interestVehicleId: 'VIN-HYU-TUC-2021',
    interestVehicleName: 'Hyundai Tucson Limited 2021',
    assignedSellerId: 'SEL-002',
    assignedSellerName: 'Carolina Duarte',
    notes: [
      {
        id: 'NOT-3',
        date: '2026-10-27T09:40:00Z',
        author: 'Carolina Duarte',
        type: 'Llamada',
        text: 'Se le envió propuesta con entrega del 40% y saldo en 24 cuotas fijas en Guaraníes.'
      }
    ],
    createdAt: '2026-10-27T08:30:00Z'
  },
  {
    id: 'CLI-003',
    name: 'Lic. Fernando Ortiz',
    phone: '0983 234 567',
    email: 'fernando.ortiz.py@hotmail.com',
    city: 'Luque',
    origin: 'Instagram',
    status: 'Reservado',
    interestVehicleId: 'VIN-MBZ-C20-2022',
    interestVehicleName: 'Mercedes-Benz C200 Avantgarde 2022',
    assignedSellerId: 'SEL-001',
    assignedSellerName: 'Marcos Benítez',
    notes: [
      {
        id: 'NOT-4',
        date: '2026-10-29T16:15:00Z',
        author: 'Marcos Benítez',
        type: 'Nota',
        text: 'Depositó seña de Gs. 15.000.000 para reservar el vehículo hasta el viernes.'
      }
    ],
    createdAt: '2026-10-28T12:00:00Z'
  },
  {
    id: 'CLI-004',
    name: 'Rodrigo Benegas Cardozo',
    phone: '0991 765 432',
    email: 'rodrigo.benegas@ganaderapy.com',
    city: 'Concepción',
    origin: 'Referido',
    status: 'Ganado',
    interestVehicleId: 'VIN-JEE-COM-2022',
    interestVehicleName: 'Jeep Compass Limited 2022',
    assignedSellerId: 'SEL-003',
    assignedSellerName: 'Rodrigo Fleitas',
    notes: [
      {
        id: 'NOT-5',
        date: '2026-11-01T11:00:00Z',
        author: 'Rodrigo Fleitas',
        type: 'Reunión',
        text: 'Venta cerrada al contado. Vehículo entregado con cédula verde y chapa provisoria.'
      }
    ],
    createdAt: '2026-10-20T14:00:00Z'
  },
  {
    id: 'CLI-005',
    name: 'Gabriela Sotomayor',
    phone: '0982 555 123',
    email: 'gaby.sotomayor@gmail.com',
    city: 'Fernando de la Mora',
    origin: 'Presencial',
    status: 'Nuevo',
    interestVehicleId: 'VIN-TOY-COR-2022',
    interestVehicleName: 'Toyota Corolla GLi 2022',
    assignedSellerId: 'SEL-002',
    assignedSellerName: 'Carolina Duarte',
    notes: [
      {
        id: 'NOT-6',
        date: '2026-11-02T16:00:00Z',
        author: 'Carolina Duarte',
        type: 'Nota',
        text: 'Pasó por el local a consultar disponibilidad. Primer vehículo que desea comprar.'
      }
    ],
    createdAt: '2026-11-02T15:45:00Z'
  }
];

export const initialSellers: Seller[] = [
  {
    id: 'SEL-001',
    name: 'Marcos Benítez',
    email: 'marcos.benitez@sheryautomotores.com',
    phone: '0981 777 101',
    active: true,
    commissionRate: 3.0,
    salesCount: 6,
    totalSoldGs: 820000000,
    targetGs: 1000000000
  },
  {
    id: 'SEL-002',
    name: 'Carolina Duarte',
    email: 'carolina.duarte@sheryautomotores.com',
    phone: '0982 888 202',
    active: true,
    commissionRate: 3.5,
    salesCount: 4,
    totalSoldGs: 540000000,
    targetGs: 800000000
  },
  {
    id: 'SEL-003',
    name: 'Rodrigo Fleitas',
    email: 'rodrigo.fleitas@sheryautomotores.com',
    phone: '0983 999 303',
    active: true,
    commissionRate: 3.0,
    salesCount: 5,
    totalSoldGs: 710000000,
    targetGs: 850000000
  }
];

export const initialReservations: Reservation[] = [
  {
    id: 'RES-2026-001',
    vehicleId: 'VIN-MBZ-C20-2022',
    vehicleName: 'Mercedes-Benz C200 Avantgarde 2022',
    clientId: 'CLI-003',
    clientName: 'Lic. Fernando Ortiz',
    sellerId: 'SEL-001',
    sellerName: 'Marcos Benítez',
    date: '2026-10-29',
    expiryDate: '2026-11-06',
    downPaymentGs: 15000000,
    status: 'Confirmada',
    notes: 'Seña abonada en efectivo con recibo oficial N° 04821.',
    createdAt: '2026-10-29T16:20:00Z'
  }
];

export const initialSales: Sale[] = [
  {
    id: 'VTA-2026-001',
    vehicleId: 'VIN-JEE-COM-2022',
    vehicleName: 'Jeep Compass Limited 2022',
    clientId: 'CLI-004',
    clientName: 'Rodrigo Benegas Cardozo',
    sellerId: 'SEL-003',
    sellerName: 'Rodrigo Fleitas',
    date: '2026-11-01',
    salePriceGs: 135000000,
    discountGs: 3000000,
    finalPriceGs: 132000000,
    downPaymentGs: 132000000,
    balancePendingGs: 0,
    paymentMethod: 'Contado',
    commissionPercentage: 3.0,
    commissionAmountGs: 3960000,
    commissionStatus: 'Aprobada',
    notes: 'Transferencia bancaria total verificada en cuenta Itaú.',
    createdAt: '2026-11-01T11:30:00Z'
  }
];

export const initialCommissions: Commission[] = [
  {
    id: 'COM-2026-001',
    saleId: 'VTA-2026-001',
    sellerId: 'SEL-003',
    sellerName: 'Rodrigo Fleitas',
    vehicleName: 'Jeep Compass Limited 2022',
    salePriceGs: 132000000,
    baseAmountGs: 132000000,
    percentage: 3.0,
    commissionAmountGs: 3960000,
    status: 'Aprobada',
    generatedAt: '2026-11-01T11:30:00Z',
    approvedAt: '2026-11-02T09:00:00Z'
  }
];

export const initialImportRequests: ImportRequest[] = [
  {
    id: 'IMP-2026-001',
    requestCode: 'IMP-2026-001',
    clientName: 'Dr. Alejandro Peña',
    clientPhone: '0981 112 233',
    clientEmail: 'dr.pena@cardiolab.com.py',
    desiredMake: 'Porsche',
    desiredModel: 'Macan S',
    desiredYearRange: '2021 - 2023',
    desiredVersion: 'V6 3.0 Turbo 354 HP',
    desiredColor: 'Blanco Carrara o Gris Volcano',
    desiredKm: 'Menor a 35.000 km',
    budgetGs: 480000000,
    preferredCountry: 'Estados Unidos (Miami / Florida)',
    comments: 'Con historial Carfax limpio, paquete Chrono Sport y techo panorámico obligatorio.',
    assignedSellerId: 'SEL-001',
    assignedSellerName: 'Marcos Benítez',
    stage: 8, // Anticipo confirmado
    status: 'Activa',
    quotation: {
      vehicleEstimatedPriceGs: 310000000,
      transportCostGs: 35000000,
      importTaxesGs: 68000000,
      otherCostsGs: 12000000,
      serviceFeeGs: 35000000,
      totalEstimatedGs: 460000000,
      advanceRequiredGs: 138000000, // 30%
      validityDate: '2026-11-15',
      commercialTerms: 'Tiempo estimado de entrega: 45 a 60 días tras embarque. Garantía de inspección mecánica y eléctrica previa en puerto de origen.',
      clientAccepted: true,
      clientAcceptedDate: '2026-10-26T14:00:00Z',
      advanceConfirmed: true,
      advanceConfirmedDate: '2026-10-28T10:30:00Z'
    },
    actualCostGs: 452000000,
    createdAt: '2026-10-22T09:00:00Z',
    updatedAt: '2026-10-28T10:30:00Z'
  },
  {
    id: 'IMP-2026-002',
    requestCode: 'IMP-2026-002',
    clientName: 'Sra. Beatriz Recalde',
    clientPhone: '0972 334 455',
    clientEmail: 'beatriz.recalde@agronegocios.com.py',
    desiredMake: 'Toyota',
    desiredModel: 'Land Cruiser Prado',
    desiredYearRange: '2022 - 2024',
    desiredVersion: 'TX-L 2.8 Turbo Diésel',
    desiredColor: 'Negro o Perla',
    desiredKm: 'Menor a 30.000 km',
    budgetGs: 550000000,
    preferredCountry: 'Japón / Chile',
    comments: '3 hileras de asientos, refrigerador en consola central (Cool Box) y suspensión KDSS.',
    assignedSellerId: 'SEL-002',
    assignedSellerName: 'Carolina Duarte',
    stage: 5, // Cotización enviada
    status: 'Activa',
    quotation: {
      vehicleEstimatedPriceGs: 370000000,
      transportCostGs: 42000000,
      importTaxesGs: 78000000,
      otherCostsGs: 15000000,
      serviceFeeGs: 40000000,
      totalEstimatedGs: 545000000,
      advanceRequiredGs: 163500000,
      validityDate: '2026-11-10',
      commercialTerms: 'Importación directa con verificación técnica pre-embarque en origen.',
      clientAccepted: false,
      advanceConfirmed: false
    },
    createdAt: '2026-10-29T11:15:00Z',
    updatedAt: '2026-10-31T16:00:00Z'
  },
  {
    id: 'IMP-2026-003',
    requestCode: 'IMP-2026-003',
    clientName: 'Esteban Bogado',
    clientPhone: '0985 667 788',
    clientEmail: 'esteban.bogado@constructora.com.py',
    desiredMake: 'Ford',
    desiredModel: 'F-150 Lariat',
    desiredYearRange: '2022 - 2023',
    desiredVersion: '3.5 EcoBoost V6 4x4',
    desiredColor: 'Gris Carbón',
    desiredKm: 'Menor a 40.000 km',
    budgetGs: 390000000,
    preferredCountry: 'Estados Unidos',
    comments: 'Interesado en vehículo para uso mixto campo/ciudad. Buscando cotización.',
    assignedSellerId: 'SEL-003',
    assignedSellerName: 'Rodrigo Fleitas',
    stage: 2, // Búsqueda del vehículo
    status: 'Activa',
    createdAt: '2026-11-01T15:00:00Z',
    updatedAt: '2026-11-02T09:30:00Z'
  }
];
