import React from 'react';
import { Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { Vehicle } from '../../types';
import { formatGs, formatKm, getWhatsAppLink } from '../../utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  whatsappNumber: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  whatsappNumber
}) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const primaryImage = vehicle.images && vehicle.images.length > 0
    ? vehicle.images[0]
    : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';

  const isAvailable = vehicle.status === 'disponible';
  const isReserved = vehicle.status === 'reservado';

  const waMessage = `Hola Shery Automotores, me interesa consultar por el vehículo disponible: ${vehicle.make} ${vehicle.model} ${vehicle.year} (${formatGs(vehicle.priceGs)}). ¿Sigue disponible para ver en el showroom?`;

  return (
    <div className="bg-[#121824] hover:bg-[#161F2E] border border-neutral-800/90 hover:border-neutral-700/80 rounded-2xl p-3.5 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-black/70">
      <div>
        {/* Top Image Container */}
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900 mb-3.5">
          <img
            src={primaryImage}
            alt={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
            className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient scrim for badge readability */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Status Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {isAvailable && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                <span>✓</span> Disponible
              </span>
            )}
            {isReserved && (
              <span className="inline-flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-sm text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                Reservado
              </span>
            )}
            {!isAvailable && !isReserved && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-700/90 text-white font-medium text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                {vehicle.status}
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Agregar a favoritos"
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <Heart
              size={16}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-300 hover:text-white'}
            />
          </button>
        </div>

        {/* Title: Make & Model */}
        <div className="mb-1.5">
          <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors leading-snug">
            {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.version && (
            <p className="text-[11px] text-neutral-400 font-medium truncate">
              {vehicle.version}
            </p>
          )}
        </div>

        {/* Specs Metadata: Clean unboxed text with dots (§1.A Zero-Pill) */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3.5 flex-wrap">
          <span>{vehicle.year}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{formatKm(vehicle.km)}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{vehicle.transmission}</span>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-neutral-500 uppercase font-semibold block leading-none mb-0.5">
            Precio
          </span>
          <p className="font-extrabold text-base sm:text-lg text-[#38BDF8] font-mono tracking-tight leading-none">
            {formatGs(vehicle.priceGs)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={getWhatsAppLink(whatsappNumber, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            title="Consultar por WhatsApp"
            className="w-8 h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-colors"
          >
            <MessageCircle size={15} />
          </a>

          <button
            onClick={() => onSelect(vehicle)}
            className="inline-flex items-center gap-1.5 border border-neutral-700 hover:border-neutral-500 bg-neutral-800/40 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
          >
            <span>Ver detalle</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
