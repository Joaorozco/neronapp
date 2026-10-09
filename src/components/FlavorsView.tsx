import React, { useState, useMemo } from 'react';
import { Search, Star, Heart, Plus, Sparkles, Filter, X } from 'lucide-react';
import { Flavor, CategoryType } from '../types';
import { CATEGORIES } from '../data/flavors';

interface FlavorsViewProps {
  flavors: Flavor[];
  onSelectFlavor: (flavor: Flavor) => void;
  onToggleFavorite: (flavorId: string) => void;
  favorites: string[];
}

export const FlavorsView: React.FC<FlavorsViewProps> = ({
  flavors,
  onSelectFlavor,
  onToggleFavorite,
  favorites,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filtered flavors logic
  const filteredFlavors = useMemo(() => {
    return flavors.filter((flavor) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || flavor.category === selectedCategory;

      // Search query match
      const matchesSearch =
        flavor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flavor.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flavor.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Favorites match
      const matchesFavorite = !showOnlyFavorites || favorites.includes(flavor.id);

      return matchesCategory && matchesSearch && matchesFavorite;
    });
  }, [flavors, selectedCategory, searchQuery, showOnlyFavorites, favorites]);

  return (
    <div className="space-y-4 pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Nuestros Sabores</span>
            <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
          </h1>
          <p className="text-xs text-gray-500">Descubre la variedad artesanal de Neron</p>
        </div>

        {/* Favorite filter toggle */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
            showOnlyFavorites
              ? 'bg-[#6B1124] border-[#6B1124] text-white shadow-xs'
              : 'bg-white border-[#EBE0D0] text-[#5A4540] hover:text-[#6B1124]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white' : 'text-[#6B1124]'}`} />
          <span>Favoritos ({favorites.length})</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar sabor, fruta, chocolate..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#EBE0D0] rounded-2xl text-sm text-[#2A1619] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#6B1124] shadow-2xs transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id && !showOnlyFavorites;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as CategoryType);
                setShowOnlyFavorites(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#6B1124] text-white shadow-md shadow-[#6B1124]/20 scale-102'
                  : 'bg-[#EFE7DC] hover:bg-[#E6DCCF] text-[#3D2822] border border-[#E3D6C5]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Flavor List Cards */}
      {filteredFlavors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-pink-100 p-6 space-y-3">
          <div className="text-4xl">🍦</div>
          <h3 className="font-bold text-gray-800 text-base">No encontramos ese sabor</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Intenta buscando otra palabra o selecciona otra categoría para explorar.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setShowOnlyFavorites(false);
            }}
            className="px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-bold text-xs hover:bg-pink-200 transition"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFlavors.map((flavor) => {
            const isFav = favorites.includes(flavor.id);
            const isAvailable = flavor.isAvailable !== false;

            return (
              <div
                key={flavor.id}
                onClick={() => onSelectFlavor(flavor)}
                className={`group rounded-[24px] p-3.5 border transition-all duration-300 flex items-center gap-3 relative cursor-pointer overflow-hidden ${
                  isAvailable
                    ? 'bg-[#F8EFE4] border-[#ECE1D2] hover:border-[#D9C8B2] shadow-2xs hover:shadow-sm'
                    : 'bg-[#F3EAE0]/70 border-stone-200 opacity-80'
                }`}
              >
                {/* Floating Product Image */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center p-0.5">
                  <img
                    src={flavor.image}
                    alt={flavor.name}
                    className={`w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 drop-shadow-xs ${
                      !isAvailable ? 'grayscale contrast-75' : ''
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {!isAvailable ? (
                    <span className="absolute top-1 left-1 bg-rose-700 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                      AGOTADO
                    </span>
                  ) : flavor.badge ? (
                    <span className="absolute top-1 left-1 bg-[#6B1124] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-xs">
                      {flavor.badge}
                    </span>
                  ) : null}
                </div>

                {/* Favorite Heart Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(flavor.id);
                  }}
                  className={`absolute top-3 right-3.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition ${
                    isFav
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                </button>

                {/* Details Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-extrabold text-base text-[#2A1619] group-hover:text-[#6B1124] transition tracking-tight leading-snug">
                    {flavor.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold my-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{flavor.rating}</span>
                    <span className="text-[10px] text-[#7A645D] font-normal">({flavor.reviewCount})</span>
                  </div>

                  <p className="text-xs text-[#7A645D] line-clamp-2 mt-0.5 leading-tight">{flavor.subtitle}</p>

                  {/* Price & Add Button Row */}
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="font-black text-[#2A1619] text-base">$ {flavor.price.toLocaleString('es-AR')}</span>

                    {isAvailable ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFlavor(flavor);
                        }}
                        className="w-8 h-8 rounded-full bg-[#6B1124] hover:bg-[#520C1B] text-white flex items-center justify-center transition active:scale-90 shadow-sm"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                        Sin stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
