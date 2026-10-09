import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingBag, MessageCircle, Star, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { ProductItem, CartItem, Branch, CategoryType } from '../types';
import { MAIN_CATEGORY_TABS, heroBannerImg } from '../data/flavors';
import { useStore } from '../context/StoreContext';

interface HomeViewProps {
  cart: CartItem[];
  onUpdateCartQuantity: (id: string, delta: number) => void;
  onRemoveCartItem: (id: string) => void;
  onAddToCartProduct: (product: ProductItem) => void;
  selectedBranch: Branch;
  onOpenProductModal?: (product: ProductItem) => void;
  setActiveTab: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  cart,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onAddToCartProduct,
  selectedBranch,
  setActiveTab,
}) => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('helados');

  // Filter products by selected category
  const filteredProducts = products.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  // Cart total calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Build WhatsApp checkout URL
  const buildWhatsAppMessage = () => {
    if (cart.length === 0) return '';
    const itemsList = cart
      .map(
        (item) =>
          `• ${item.quantity}x ${item.flavorName} ($${item.totalPrice.toLocaleString('es-AR')})`
      )
      .join('\n');

    let text = `¡Hola Nerón (${selectedBranch.name})! 🍦\nQuiero realizar el siguiente pedido:\n\n${itemsList}\n\n*Total a pagar: $ ${cartSubtotal.toLocaleString(
      'es-AR'
    )}*\n\n📍 Entrega / Retiro en: ${selectedBranch.address} (${selectedBranch.city})\n¡Muchas gracias!`;

    if (!selectedBranch.isOpen) {
      text += `\n\n*(Nota: Local actualmente fuera de horario comercial. Pedido enviado para su despacho al abrir).*`;
    }

    return `https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 md:pb-12">
      {/* LOCAL STATUS ALERT (If branch is closed) */}
      {!selectedBranch.isOpen && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-amber-900 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Aviso de horario:</strong> La {selectedBranch.name} está actualmente cerrada (Horarios:{' '}
              {selectedBranch.hours}). Podés armar tu pedido y dejarlo enviado por WhatsApp para cuando abra.
            </span>
          </div>
        </div>
      )}

      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#1E110E] shadow-xl border border-[#38231E]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#170B09] via-[#21120F]/90 to-transparent z-10 pointer-events-none md:w-3/5" />

        <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Hero Left Content */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 md:col-span-7 flex flex-col items-start justify-center text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Tu antojo tiene <br />
              <span className="font-serif italic font-normal text-[#E8AC3F] tracking-normal">
                nombre: Nerón
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#D4C4B5] mt-3 sm:mt-4 font-normal max-w-sm sm:max-w-md leading-relaxed">
              Helados, cafés y algo rico <br className="hidden sm:inline" />
              para cada momento
            </p>

            {/* Quick badges under headline */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs border border-white/10">
                ✨ Elaboración Diaria
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs border border-white/10">
                🍨 Calidad Premium
              </span>
            </div>
          </div>

          {/* Hero Right Image */}
          <div className="relative md:col-span-5 h-64 sm:h-72 md:h-full min-h-[260px] md:min-h-[340px] overflow-hidden">
            <img
              src={heroBannerImg}
              alt="Helados, café de especialidad y batidos Nerón"
              className="w-full h-full object-cover object-center transform md:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1E110E] via-transparent to-transparent opacity-80 md:opacity-60 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS BAR */}
      <section className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
        {MAIN_CATEGORY_TABS.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryType)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 whitespace-nowrap active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-[#6B1124] text-white shadow-md shadow-[#6B1124]/25 scale-102'
                  : 'bg-[#EFE7DC] hover:bg-[#E6DCCF] text-[#3D2822] border border-[#E3D6C5]'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </section>

      {/* 3. MAIN CONTENT: 2 COLUMNS ON DESKTOP (Products Grid + "Tu pedido" Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Products Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const inCartQty = cart.find((i) => i.flavorId === product.id)?.quantity || 0;
              const isAvailable = product.isAvailable !== false;

              return (
                <div
                  key={product.id}
                  className={`border rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-200 group shadow-2xs ${
                    isAvailable
                      ? 'bg-[#F8EFE4] hover:bg-[#F4E9DC] border-[#ECE1D2] hover:shadow-md'
                      : 'bg-[#F5EDE3]/60 border-stone-200 opacity-75'
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-white/60 mb-3 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ${
                        !isAvailable ? 'grayscale contrast-75' : ''
                      }`}
                      loading="lazy"
                    />

                    {/* Available / Out of stock badge */}
                    {!isAvailable ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-stone-700/90 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                        AGOTADO
                      </span>
                    ) : product.badge ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#6B1124] text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                        {product.badge}
                      </span>
                    ) : null}

                    {inCartQty > 0 && isAvailable && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1E8A3C] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                        {inCartQty}
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1 mb-3 text-left">
                    <h3 className="font-extrabold text-[#2A1619] text-sm sm:text-base leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                    {product.subtitle && (
                      <p className="text-[11px] text-[#7A645D] line-clamp-1">
                        {product.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-extrabold text-[#2A1619] text-sm sm:text-base">
                      $ {product.price.toLocaleString('es-AR')}
                    </span>

                    {isAvailable ? (
                      <button
                        onClick={() => onAddToCartProduct(product)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6B1124] hover:bg-[#520C1B] text-white flex items-center justify-center transition-transform active:scale-90 shadow-xs cursor-pointer"
                        title="Agregar a mi pedido"
                        aria-label={`Agregar ${product.name}`}
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-1 rounded-full">
                        Sin stock
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Desktop "Tu pedido" Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24">
          <div className="bg-[#FAF4EC] rounded-3xl border border-[#EBE0D0] p-6 shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE0D0]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <h2 className="font-black text-lg text-[#2A1619] tracking-tight">Tu pedido</h2>
              </div>
              {totalItemCount > 0 && (
                <span className="text-xs font-bold text-[#6B1124] bg-[#6B1124]/10 px-2.5 py-0.5 rounded-full">
                  {totalItemCount} {totalItemCount === 1 ? 'producto' : 'productos'}
                </span>
              )}
            </div>

            {/* Cart Items List */}
            <div className="py-4 space-y-3 max-h-80 overflow-y-auto no-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-8 px-4 text-[#8C766F] space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#EFE7DC] mx-auto flex items-center justify-center text-2xl">
                    🍨
                  </div>
                  <p className="text-xs font-semibold text-[#5A4540]">
                    Tu pedido está vacío por el momento
                  </p>
                  <p className="text-[11px] text-[#8C766F]">
                    Elegí helados, cafés o postres para armar tu carrito.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white border border-[#EBE0D0] shadow-2xs"
                  >
                    <img
                      src={item.flavorImage}
                      alt={item.flavorName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-extrabold text-xs text-[#2A1619] truncate">
                        {item.flavorName}
                      </h4>
                      <p className="text-[11px] font-bold text-[#6B1124]">
                        $ {item.totalPrice.toLocaleString('es-AR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onUpdateCartQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-[#EFE7DC] hover:bg-[#E5DACE] flex items-center justify-center text-xs font-bold text-[#2A1619] transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateCartQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-[#6B1124] hover:bg-[#520C1B] flex items-center justify-center text-xs font-bold text-white transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total and Checkout */}
            <div className="pt-4 border-t border-[#EBE0D0] space-y-3">
              <div className="flex items-center justify-between text-base font-black">
                <span className="text-[#5A4540]">Total</span>
                <span className="text-[#6B1124] text-xl">
                  $ {cartSubtotal.toLocaleString('es-AR')}
                </span>
              </div>

              {cart.length > 0 ? (
                <a
                  href={buildWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-full bg-[#1E8A3C] hover:bg-[#187532] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#1E8A3C]/20 transition active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Continuar por WhatsApp</span>
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-full bg-stone-300 text-stone-500 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Continuar por WhatsApp</span>
                </button>
              )}

              <p className="text-[11px] text-center text-[#8C766F]">
                Sucursal de entrega: <strong className="text-[#2A1619]">{selectedBranch.name}</strong>
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* 4. MOBILE FLOATING STICKY CART BAR (WHEN ITEMS IN CART) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-18 left-0 right-0 z-40 px-4 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-md mx-auto bg-[#2A1619] text-white rounded-2xl p-3 px-4 shadow-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6B1124] flex items-center justify-center text-sm">
                🛒
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Tu pedido ({totalItemCount})</p>
                <p className="text-sm font-black text-[#E8AC3F]">
                  $ {cartSubtotal.toLocaleString('es-AR')}
                </p>
              </div>
            </div>

            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-4 rounded-full bg-[#1E8A3C] hover:bg-[#187532] text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Continuar</span>
            </a>
          </div>
        </div>
      )}

      {/* 5. FOOTER CON INFORMACIÓN DE SUCURSAL Y ACCESO ADMINISTRATIVO */}
      <footer className="mt-16 pt-8 border-t border-[#EBE0D0] text-center text-xs text-[#7A645D] space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#5A4540]">
          <span>📍 {selectedBranch.name}: {selectedBranch.address}</span>
          <span>•</span>
          <span>🕒 {selectedBranch.hours}</span>
          <span>•</span>
          <a
            href={`https://wa.me/${selectedBranch.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>WhatsApp: +{selectedBranch.whatsapp}</span>
          </a>
        </div>

        <p className="text-[11px] text-[#A08E87]">
          Nerón Gelato & Café • Pedidos directos vía WhatsApp sin comisiones
        </p>
      </footer>
    </div>
  );
};
