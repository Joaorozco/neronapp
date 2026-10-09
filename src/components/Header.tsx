import React, { useState } from 'react';
import { Menu, ShoppingBag, X, MapPin, ChevronDown, Clock, Phone, Sparkles, MessageCircle } from 'lucide-react';
import { NeronLogo } from './NeronLogo';
import { TabType, Branch } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  favoriteCount: number;
  selectedBranch: Branch;
  onOpenBranchModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  selectedBranch,
  onOpenBranchModal,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF4EC]/95 backdrop-blur-md border-b border-[#EBE0D0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Main Bar */}
          <div className="flex items-center justify-between">
            {/* Mobile Left: Menu Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsDrawerOpen(true)}
                id="mobile-drawer-btn"
                className="w-10 h-10 rounded-full hover:bg-[#EFE4D3] text-[#2A1619] flex items-center justify-center transition active:scale-95"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo: Centered on mobile, Left on desktop */}
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <NeronLogo size="sm" />
                <span className="hidden sm:inline font-extrabold text-2xl tracking-tight text-[#2A1619]">
                  Nerón
                </span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-sm font-bold tracking-tight pb-1 relative transition-colors cursor-pointer ${
                  activeTab === 'home'
                    ? 'text-[#6B1124] border-b-2 border-[#6B1124]'
                    : 'text-[#5A4540] hover:text-[#2A1619]'
                }`}
              >
                Inicio
              </button>

              <button
                onClick={() => handleNavClick('flavors')}
                className={`text-sm font-bold tracking-tight pb-1 relative transition-colors cursor-pointer ${
                  activeTab === 'flavors'
                    ? 'text-[#6B1124] border-b-2 border-[#6B1124]'
                    : 'text-[#5A4540] hover:text-[#2A1619]'
                }`}
              >
                Carta
              </button>

              <button
                onClick={onOpenBranchModal}
                className="text-sm font-bold tracking-tight text-[#5A4540] hover:text-[#2A1619] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sucursales</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE4D3] text-[#6B1124] font-extrabold">
                  {selectedBranch.name.replace('Sucursal ', '')}
                </span>
              </button>
            </nav>

            {/* Desktop & Mobile Right Actions */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                id="cart-header-icon"
                className="relative w-10 h-10 rounded-full hover:bg-[#EFE4D3] text-[#2A1619] flex items-center justify-center transition active:scale-95 cursor-pointer"
                aria-label="Ver carrito"
              >
                <ShoppingBag className="w-5 h-5 text-[#2A1619]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#8A152D] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF4EC] shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Desktop CTA: Hacer pedido */}
              <button
                onClick={onOpenCart}
                className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6B1124] hover:bg-[#520C1B] text-white text-sm font-bold shadow-md shadow-[#6B1124]/20 transition active:scale-95 cursor-pointer"
              >
                <span>Hacer pedido</span>
              </button>
            </div>
          </div>

          {/* Mobile Branch Selector Row */}
          <div className="md:hidden mt-2.5 pt-2 border-t border-[#EBE0D0]/70 flex justify-center">
            <button
              onClick={onOpenBranchModal}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EFE7DC] hover:bg-[#E8DDD0] text-[#2A1619] text-xs font-bold border border-[#E3D6C5] shadow-2xs transition active:scale-98"
            >
              <MapPin className="w-3.5 h-3.5 text-[#6B1124]" />
              <span>Elegí tu sucursal</span>
              <span className="text-[#6B1124] font-extrabold">({selectedBranch.name.replace('Sucursal ', '')})</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 ml-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#FAF4EC] h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-[#EBE0D0]">
            {/* Drawer Header */}
            <div className="bg-[#6B1124] text-white p-6 relative">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <NeronLogo size="md" />
                <div>
                  <h3 className="font-extrabold text-2xl tracking-tight text-white">Nerón</h3>
                  <p className="text-xs text-rose-200">Delicias Heladas Artesanales</p>
                </div>
              </div>
            </div>

            {/* Current Branch Pill */}
            <div className="p-4 bg-[#F2E8DC] border-b border-[#E3D6C5] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#7A645D]">Sucursal Seleccionada</p>
                <p className="text-xs font-black text-[#2A1619]">{selectedBranch.name}</p>
                <p className="text-[11px] text-[#7A645D]">{selectedBranch.address}</p>
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenBranchModal();
                }}
                className="px-2.5 py-1 text-xs font-bold bg-white text-[#6B1124] rounded-full border border-[#D9C8B2] hover:bg-stone-50"
              >
                Cambiar
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="p-4 space-y-1.5 flex-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center justify-between ${
                  activeTab === 'home'
                    ? 'bg-[#6B1124] text-white'
                    : 'text-[#2A1619] hover:bg-[#EFE4D3]'
                }`}
              >
                <span>Inicio</span>
              </button>

              <button
                onClick={() => handleNavClick('flavors')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center justify-between ${
                  activeTab === 'flavors'
                    ? 'bg-[#6B1124] text-white'
                    : 'text-[#2A1619] hover:bg-[#EFE4D3]'
                }`}
              >
                <span>Carta & Sabores</span>
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenBranchModal();
                }}
                className="w-full text-left px-4 py-3 rounded-2xl font-bold text-sm text-[#2A1619] hover:bg-[#EFE4D3] transition flex items-center justify-between"
              >
                <span>Nuestras Sucursales</span>
                <span className="text-xs bg-[#EFE4D3] px-2 py-0.5 rounded-full text-[#6B1124]">3 locales</span>
              </button>

              <button
                onClick={() => handleNavClick('menu')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center justify-between ${
                  activeTab === 'menu'
                    ? 'bg-[#6B1124] text-white'
                    : 'text-[#2A1619] hover:bg-[#EFE4D3]'
                }`}
              >
                <span>Mi Pedido ({cartCount})</span>
              </button>
            </div>

            {/* WhatsApp direct order */}
            <div className="p-4 bg-white/70 border-t border-[#EBE0D0] space-y-2">
              <a
                href={`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(
                  `¡Hola Nerón! Quisiera consultar la carta de ${selectedBranch.name}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-[#1E8A3C] hover:bg-[#187532] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir directo por WhatsApp</span>
              </a>
              <p className="text-[10px] text-center text-[#7A645D]">
                Atención rápida todos los días hasta la madrugada
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
