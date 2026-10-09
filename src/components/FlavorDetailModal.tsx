import React, { useState } from 'react';
import { X, Star, Heart, Minus, Plus, ShoppingBag, Check, ShieldCheck, Sparkles, CupSoda, Cone } from 'lucide-react';
import { Flavor, SizeOption, ContainerOption } from '../types';
import { SIZE_OPTIONS, CONTAINER_OPTIONS, TOPPINGS_LIST } from '../data/flavors';

interface FlavorDetailModalProps {
  flavor: Flavor | null;
  onClose: () => void;
  onAddToCart: (
    flavor: Flavor,
    size: SizeOption,
    container: ContainerOption,
    quantity: number,
    toppings: string[],
    totalPrice: number
  ) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const FlavorDetailModal: React.FC<FlavorDetailModalProps> = ({
  flavor,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!flavor) return null;

  const [selectedSize, setSelectedSize] = useState<SizeOption>(SIZE_OPTIONS[0]);
  const [selectedContainer, setSelectedContainer] = useState<ContainerOption>(CONTAINER_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Calculate Unit & Total Price
  const calculateUnitPrice = () => {
    let base = selectedSize.price + selectedContainer.extraPrice;
    selectedToppings.forEach((topId) => {
      const tObj = TOPPINGS_LIST.find((t) => t.id === topId);
      if (tObj) base += tObj.price;
    });
    return Number(base.toFixed(2));
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const handleAdd = () => {
    onAddToCart(
      flavor,
      selectedSize,
      selectedContainer,
      quantity,
      selectedToppings.map((t) => TOPPINGS_LIST.find((item) => item.id === t)?.name || t),
      totalPrice
    );

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const toggleTopping = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 transition-all">
      <div className="bg-white w-full max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto flex-1 no-scrollbar pb-24">
          {/* Header Image Area matching Screen 3 */}
          <div className="relative h-72 bg-[#FFF2F5] flex items-center justify-center p-6 overflow-hidden">
            <img
              src={flavor.image}
              alt={flavor.name}
              className="max-h-60 w-auto object-contain drop-shadow-md transform hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />

            {/* Back/Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center transition shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(flavor.id)}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 hover:bg-white text-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* White Bottom Sheet with rounded top matching Screen 3 */}
          <div className="relative -mt-6 bg-white rounded-t-[32px] p-5 space-y-4 shadow-lg">
            {/* Title & Price Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{flavor.name}</h2>
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{flavor.rating}</span>
                  <span className="text-gray-400 font-normal">({flavor.reviewCount} opiniones)</span>
                </div>
              </div>
              <div className="text-2xl font-black text-pink-600">${totalPrice.toFixed(2)}</div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{flavor.description}</p>

            {/* Feature Badges matching Screen 3 mockup */}
            <div className="grid grid-cols-4 gap-2 bg-[#FFF6F9] p-3 rounded-2xl text-center border border-pink-100/60">
              <div className="flex flex-col items-center">
                <span className="text-base mb-0.5">🌸</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Elaboración Diaria</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base mb-0.5">👑</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Ingredientes Premium</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base mb-0.5">🚫</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Sin Colorantes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base mb-0.5">🍦</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Sabor Alegría</span>
              </div>
            </div>

            {/* Size Selector Pills */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                Selecciona Tamaño
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SIZE_OPTIONS.map((size) => {
                  const isSelected = selectedSize.id === size.id;

                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-pink-600 bg-pink-50/80 ring-2 ring-pink-500/20 text-gray-900'
                          : 'border-gray-200 bg-white hover:border-pink-200 text-gray-700'
                      }`}
                    >
                      {size.isPopular && (
                        <span className="absolute -top-2 right-2 bg-amber-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                          MÁS POPULAR
                        </span>
                      )}
                      <span className="font-bold text-xs">{size.name}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">{size.scoopsLabel}</span>
                        <span className="font-black text-pink-600 text-xs">${size.price.toFixed(2)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Container Option */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                Presentación
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CONTAINER_OPTIONS.map((c) => {
                  const isSelected = selectedContainer.id === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContainer(c)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-pink-200'
                      }`}
                    >
                      <span className="text-lg">
                        {c.id === 'cup' ? '🥤' : c.id === 'waffle_cone' ? '🧇' : '🍫'}
                      </span>
                      <span className="text-[11px] leading-tight">{c.name}</span>
                      {c.extraPrice > 0 && (
                        <span className="text-[9px] text-[#6B1124] font-bold">+$ {c.extraPrice.toLocaleString('es-AR')}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toppings Extras */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#2A1619] uppercase tracking-wide">
                Toppings Extras (Opcional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TOPPINGS_LIST.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);

                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-[#6B1124] border-[#6B1124] text-white shadow-xs'
                          : 'bg-white border-[#EBE0D0] text-[#5A4540] hover:border-[#D9C8B2]'
                      }`}
                    >
                      + {topping.name} ($ {topping.price.toLocaleString('es-AR')})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="text-xs font-bold text-[#2A1619] uppercase">Cantidad</span>
              <div className="flex items-center gap-3 bg-[#EFE4D3] p-1.5 rounded-full border border-[#D9C8B2]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-white text-[#2A1619] flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-extrabold text-sm text-[#2A1619] w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-[#6B1124] text-white flex items-center justify-center font-bold shadow-xs hover:bg-[#520C1B] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Add to Cart CTA */}
        <div className="p-4 bg-white border-t border-[#EBE0D0] shadow-xl">
          {flavor.isAvailable === false ? (
            <div className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-stone-200 text-stone-600 flex items-center justify-center gap-2">
              <span>⚠️ Este sabor se encuentra temporalmente agotado</span>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`w-full py-3.5 px-6 rounded-full font-black text-sm flex items-center justify-between shadow-lg transition duration-200 active:scale-98 cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#6B1124] hover:bg-[#520C1B] text-white shadow-[#6B1124]/20'
              }`}
            >
              {addedSuccess ? (
                <span className="flex items-center gap-2 mx-auto text-base">
                  <Check className="w-5 h-5" />
                  ¡Agregado al Carrito!
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Agregar al Carrito
                  </span>
                  <span>$ {totalPrice.toLocaleString('es-AR')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
