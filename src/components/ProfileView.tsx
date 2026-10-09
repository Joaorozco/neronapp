import React from 'react';
import { User, Heart, Clock, MapPin, Phone, Bell, ChevronRight, HelpCircle, MessageCircle } from 'lucide-react';
import { Flavor, TabType, Branch } from '../types';
import { BRANCHES } from '../data/flavors';

interface ProfileViewProps {
  favorites: string[];
  flavors: Flavor[];
  onSelectFlavor: (flavor: Flavor) => void;
  setActiveTab: (tab: TabType) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  favorites,
  flavors,
  onSelectFlavor,
  setActiveTab,
}) => {
  const favoriteFlavors = flavors.filter((f) => favorites.includes(f.id));

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EBE0D0] shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#6B1124] text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
          <User className="w-8 h-8" />
        </div>

        <div className="flex-1 min-w-0">
          <span className="bg-[#6B1124]/10 text-[#6B1124] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            CLIENTE NERÓN
          </span>
          <h1 className="text-lg sm:text-xl font-black text-[#2A1619] mt-0.5">Kevin Clapasson</h1>
          <p className="text-xs text-[#7A645D]">kevinclapasson@gmail.com</p>
        </div>
      </div>

      {/* Nuestras Sucursales (Branches) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EBE0D0] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="font-extrabold text-base text-[#2A1619] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#6B1124]" />
            <span>Nuestras Sucursales</span>
          </h2>
          <span className="text-xs bg-[#EFE4D3] text-[#6B1124] font-bold px-2.5 py-0.5 rounded-full">
            {BRANCHES.length} locales
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BRANCHES.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#FAF4EC] border border-[#EBE0D0] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#2A1619]">{b.name}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs text-[#7A645D] mt-1">{b.address}</p>
                <p className="text-[11px] text-[#7A645D]">{b.hours}</p>
              </div>

              <a
                href={`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(
                  `¡Hola ${b.name}! Quisiera hacer una consulta.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 w-full py-2 px-3 rounded-full bg-[#1E8A3C] hover:bg-[#187532] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Favorites Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EBE0D0] shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <h2 className="font-extrabold text-sm text-[#2A1619] flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#6B1124] fill-[#6B1124]" />
            <span>Mis Sabores Favoritos ({favoriteFlavors.length})</span>
          </h2>
          <button
            onClick={() => setActiveTab('flavors')}
            className="text-xs text-[#6B1124] font-bold hover:underline cursor-pointer"
          >
            Ver Carta Completa
          </button>
        </div>

        {favoriteFlavors.length === 0 ? (
          <p className="text-xs text-[#7A645D] py-3 text-center">
            Aún no has guardado sabores en favoritos.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {favoriteFlavors.map((flavor) => (
              <div
                key={flavor.id}
                onClick={() => onSelectFlavor(flavor)}
                className="p-3 bg-[#FAF4EC] rounded-2xl border border-[#EBE0D0] flex items-center gap-3 cursor-pointer hover:bg-[#F4EADB] transition"
              >
                <img
                  src={flavor.image}
                  alt={flavor.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#2A1619] truncate">{flavor.name}</h4>
                  <p className="text-[11px] text-[#7A645D] truncate">{flavor.subtitle}</p>
                  <span className="text-xs font-black text-[#6B1124]">
                    $ {flavor.price.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-[#8C766F] pt-2">
        Nerón • Delicias Heladas & Cafetería de Especialidad 🍨
      </div>
    </div>
  );
};
