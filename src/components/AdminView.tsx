import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Copy,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  Tag,
  DollarSign,
  Coffee,
  IceCream,
  Wine,
  Cake,
  Eye,
  Server,
  Database,
  ArrowRight,
  ShieldCheck,
  LogOut,
  KeyRound,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Branch, Flavor, ProductItem, CategoryType } from '../types';
import { NeronLogo } from './NeronLogo';

export const AdminView: React.FC = () => {
  const {
    setViewMode,
    branches,
    selectedBranch,
    setSelectedBranch,
    updateBranch,
    createBranch,
    deleteBranch,
    flavors,
    toggleFlavorAvailability,
    updateFlavor,
    addFlavor,
    deleteFlavor,
    products,
    toggleProductAvailability,
    updateProduct,
    addProduct,
    deleteProduct,
    resetToFactoryData,
    adminPassword,
    logoutAdmin,
    changeAdminPassword,
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'branch' | 'flavors' | 'products' | 'hosting'>('flavors');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Search & Filters
  const [flavorSearch, setFlavorSearch] = useState('');
  const [flavorCategoryFilter, setFlavorCategoryFilter] = useState<string>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<CategoryType>('all');

  // Modals state
  const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<Flavor | null>(null);
  const [isNewFlavorModalOpen, setIsNewFlavorModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Branch form state
  const [branchForm, setBranchForm] = useState<Branch>({ ...selectedBranch });

  // Update branch form when selected branch changes
  React.useEffect(() => {
    setBranchForm({ ...selectedBranch });
  }, [selectedBranch]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranch(branchForm);
    showToast('✅ ¡Datos de la sucursal actualizados con éxito!');
  };

  const handleCopyClientUrl = () => {
    const origin = window.location.origin;
    const url = `${origin}/#/?sucursal=${selectedBranch.id}`;
    navigator.clipboard.writeText(url);
    showToast('📋 ¡URL de cliente copiada al portapapeles!');
  };

  // Flavor calculations
  const availableFlavorsCount = flavors.filter((f) => f.isAvailable !== false).length;
  const outOfStockFlavorsCount = flavors.length - availableFlavorsCount;

  // Filtered flavors
  const filteredFlavors = flavors.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(flavorSearch.toLowerCase()) ||
      f.subtitle.toLowerCase().includes(flavorSearch.toLowerCase()) ||
      (f.tags && f.tags.some((t) => t.toLowerCase().includes(flavorSearch.toLowerCase())));
    const matchesCategory =
      flavorCategoryFilter === 'all' ||
      (flavorCategoryFilter === 'available' && f.isAvailable !== false) ||
      (flavorCategoryFilter === 'out_of_stock' && f.isAvailable === false);
    return matchesSearch && matchesCategory;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    return productCategoryFilter === 'all' || p.category === productCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-[#FAF4EC] text-[#2A1619] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1E110E] text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR / ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-[#1E110E] text-white border-b border-[#38231E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand + Badge */}
          <div className="flex items-center gap-3">
            <NeronLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Nerón</span>
                <span className="bg-[#8A152D] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase border border-red-400/30">
                  Panel de Sucursal
                </span>
              </div>
              <p className="text-xs text-[#C4B5A5]">Gestión de carta, stock de gustos y WhatsApp</p>
            </div>
          </div>

          {/* Center: Branch Selector */}
          <div className="flex items-center gap-2 bg-[#2E1B17] px-3 py-1.5 rounded-full border border-[#482F28]">
            <Store className="w-4 h-4 text-[#E8AC3F]" />
            <select
              value={selectedBranch.id}
              onChange={(e) => {
                const found = branches.find((b) => b.id === e.target.value);
                if (found) setSelectedBranch(found);
              }}
              className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer pr-2"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#1E110E] text-white">
                  {b.name} ({b.isOpen ? '🟢 Abierta' : '🔴 Cerrada'})
                </option>
              ))}
            </select>
          </div>

          {/* Right: Switch to Public View & Share Link & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClientUrl}
              title="Copiar enlace para clientes"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Link Cliente</span>
            </button>

            <button
              onClick={() => {
                setNewPasswordInput('');
                setIsChangePasswordModalOpen(true);
              }}
              title="Cambiar clave de acceso"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8AC3F] text-xs font-bold transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clave</span>
            </button>

            <button
              onClick={() => setViewMode('client')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8AC3F] hover:bg-[#d89b30] text-[#1E110E] text-xs sm:text-sm font-black shadow-md transition active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Web Cliente</span>
              <span className="sm:hidden">Cliente</span>
            </button>

            <button
              onClick={logoutAdmin}
              title="Cerrar sesión y bloquear panel"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* QUICK STATUS BANNER */}
      <div className="bg-[#EFE4D3] border-b border-[#E3D6C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between text-xs font-semibold text-[#5A4540] gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                selectedBranch.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>
              Sucursal activa: <strong className="text-[#2A1619]">{selectedBranch.name}</strong> •{' '}
              {selectedBranch.isOpen ? 'Recibiendo pedidos por WhatsApp' : 'Cerrada actualmente'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              WhatsApp de recepción: <strong className="text-[#2A1619]">+{selectedBranch.whatsapp}</strong>
            </span>
            <span className="hidden md:inline">
              Stock de gustos: <strong className="text-emerald-700">{availableFlavorsCount} activos</strong> /{' '}
              <strong className="text-rose-700">{outOfStockFlavorsCount} agotados</strong>
            </span>
          </div>
        </div>
      </div>

      {/* MAIN ADMIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-[#EBE0D0]">
          <button
            onClick={() => setActiveAdminTab('flavors')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'flavors'
                ? 'bg-[#6B1124] text-white shadow-md'
                : 'bg-white hover:bg-[#F3E9DD] text-[#5A4540] border border-[#EBE0D0]'
            }`}
          >
            <IceCream className="w-4 h-4" />
            <span>Stock de Sabores ({flavors.length})</span>
            {outOfStockFlavorsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {outOfStockFlavorsCount} agotados
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'products'
                ? 'bg-[#6B1124] text-white shadow-md'
                : 'bg-white hover:bg-[#F3E9DD] text-[#5A4540] border border-[#EBE0D0]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Productos & Precios ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('branch')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'branch'
                ? 'bg-[#6B1124] text-white shadow-md'
                : 'bg-white hover:bg-[#F3E9DD] text-[#5A4540] border border-[#EBE0D0]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Datos de Sucursal</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('hosting')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'hosting'
                ? 'bg-[#6B1124] text-white shadow-md'
                : 'bg-white hover:bg-[#F3E9DD] text-[#5A4540] border border-[#EBE0D0]'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Hosting & Base de Datos</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: STOCK DE SABORES (GUSTOS DE HELADO) */}
        {/* ============================================================ */}
        {activeAdminTab === 'flavors' && (
          <div className="mt-6 space-y-6">
            {/* Top Action Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EBE0D0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={flavorSearch}
                  onChange={(e) => setFlavorSearch(e.target.value)}
                  placeholder="Buscar sabor por nombre o ingrediente..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1124]"
                />
              </div>

              {/* Stock Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setFlavorCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    flavorCategoryFilter === 'all'
                      ? 'bg-[#2A1619] text-white'
                      : 'bg-[#FAF4EC] text-[#5A4540] hover:bg-[#F0E4D4]'
                  }`}
                >
                  Todos ({flavors.length})
                </button>
                <button
                  onClick={() => setFlavorCategoryFilter('available')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    flavorCategoryFilter === 'available'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#FAF4EC] text-emerald-800 hover:bg-[#F0E4D4]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Disponibles ({availableFlavorsCount})</span>
                </button>
                <button
                  onClick={() => setFlavorCategoryFilter('out_of_stock')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    flavorCategoryFilter === 'out_of_stock'
                      ? 'bg-rose-700 text-white'
                      : 'bg-[#FAF4EC] text-rose-800 hover:bg-[#F0E4D4]'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Agotados ({outOfStockFlavorsCount})</span>
                </button>
              </div>

              {/* Add New Flavor Button */}
              <button
                onClick={() => setIsNewFlavorModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#6B1124] hover:bg-[#520C1B] text-white text-xs sm:text-sm font-extrabold shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Sabor</span>
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#F4E1B3] flex items-start gap-3 text-xs text-[#6B5120]">
              <Sparkles className="w-4 h-4 text-[#D9822B] shrink-0 mt-0.5" />
              <div>
                <strong>Control de Stock en Tiempo Real:</strong> Cuando un gusto se termine en la sucursal, simplemente
                haz clic en el switch <strong>"Agotado"</strong>. En la web del cliente aparecerá inmediatamente marcado
                como <em>Sin Stock</em>, evitando reclamos o que te pidan sabores que no tenés en el mostrador.
              </div>
            </div>

            {/* Flavors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlavors.map((flavor) => {
                const isAvailable = flavor.isAvailable !== false;
                return (
                  <div
                    key={flavor.id}
                    className={`bg-white rounded-3xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                      isAvailable
                        ? 'border-[#EBE0D0] shadow-xs'
                        : 'border-rose-200 bg-rose-50/30 opacity-90'
                    }`}
                  >
                    <div>
                      {/* Top row: Image thumbnail + Name + Actions */}
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF4EC] shrink-0 border border-[#EBE0D0]">
                          <img
                            src={flavor.image}
                            alt={flavor.name}
                            className={`w-full h-full object-cover ${!isAvailable ? 'grayscale' : ''}`}
                          />
                          {!isAvailable && (
                            <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
                              <span className="text-[9px] font-black text-white px-1 py-0.5 bg-rose-600 rounded">
                                AGOTADO
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-[#2A1619] truncate">{flavor.name}</h3>
                            {flavor.badge && (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#FAF4EC] text-[#6B1124] border border-[#EBE0D0]">
                                {flavor.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#7A6560] line-clamp-1 mt-0.5">{flavor.subtitle}</p>
                          <p className="text-xs font-black text-[#6B1124] mt-1">
                            $ {flavor.price?.toLocaleString('es-AR')}
                          </p>
                        </div>

                        {/* Edit & Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingFlavor(flavor)}
                            title="Editar sabor"
                            className="p-1.5 rounded-xl hover:bg-[#FAF4EC] text-[#5A4540] transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar el sabor "${flavor.name}"?`)) {
                                deleteFlavor(flavor.id);
                                showToast(`Sabor ${flavor.name} eliminado`);
                              }
                            }}
                            title="Eliminar sabor"
                            className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-[#8A7570] mt-3 line-clamp-2 leading-relaxed">
                        {flavor.description}
                      </p>

                      {/* Tags */}
                      {flavor.tags && flavor.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {flavor.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF4EC] text-[#5A4540] border border-[#EBE0D0]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stock Switch Control Bar */}
                    <div className="mt-4 pt-3 border-t border-[#EBE0D0]/70 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5A4540]">Estado en mostrador:</span>

                      <button
                        onClick={() => {
                          toggleFlavorAvailability(flavor.id);
                          showToast(
                            isAvailable
                              ? `🔴 "${flavor.name}" marcado como AGOTADO`
                              : `🟢 "${flavor.name}" marcado como DISPONIBLE`
                          );
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer active:scale-95 ${
                          isAvailable
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            <span>DISPONIBLE</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-rose-600" />
                            <span>AGOTADO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: PRODUCTOS Y PRECIOS DE LA CARTA */}
        {/* ============================================================ */}
        {activeAdminTab === 'products' && (
          <div className="mt-6 space-y-6">
            {/* Top Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EBE0D0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['all', 'helados', 'cafeteria', 'tragos', 'postres'] as CategoryType[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer capitalize whitespace-nowrap ${
                      productCategoryFilter === cat
                        ? 'bg-[#6B1124] text-white'
                        : 'bg-[#FAF4EC] text-[#5A4540] hover:bg-[#F0E4D4]'
                    }`}
                  >
                    {cat === 'all' ? 'Todos los Alimentos' : cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsNewProductModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#6B1124] hover:bg-[#520C1B] text-white text-xs sm:text-sm font-extrabold shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => {
                const isAvailable = prod.isAvailable !== false;
                return (
                  <div
                    key={prod.id}
                    className={`bg-white rounded-3xl p-4 border transition-all flex flex-col justify-between ${
                      isAvailable ? 'border-[#EBE0D0] shadow-xs' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className={`w-16 h-16 rounded-2xl object-cover bg-[#FAF4EC] shrink-0 border border-[#EBE0D0] ${
                            !isAvailable ? 'grayscale' : ''
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-[#2A1619] truncate">{prod.name}</h3>
                            {prod.badge && (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#FAF4EC] text-[#6B1124] border border-[#EBE0D0]">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#9E8B85]">
                            {prod.category}
                          </span>
                          <p className="text-xs text-[#7A6560] line-clamp-1 mt-0.5">{prod.subtitle}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            title="Editar producto"
                            className="p-1.5 rounded-xl hover:bg-[#FAF4EC] text-[#5A4540] transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar ${prod.name}?`)) {
                                deleteProduct(prod.id);
                                showToast(`Producto eliminado`);
                              }
                            }}
                            title="Eliminar producto"
                            className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Live Price Input */}
                      <div className="mt-3.5 bg-[#FAF4EC] p-2.5 rounded-2xl flex items-center justify-between border border-[#EBE0D0]">
                        <span className="text-xs font-bold text-[#5A4540]">Precio al público:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-[#6B1124]">$</span>
                          <input
                            type="number"
                            value={prod.price}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              updateProduct({ ...prod, price: val });
                            }}
                            className="w-24 text-right px-2 py-1 bg-white border border-[#D9C8B2] rounded-xl text-xs font-extrabold text-[#6B1124] focus:outline-none focus:ring-1 focus:ring-[#6B1124]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock Switch Bar */}
                    <div className="mt-4 pt-3 border-t border-[#EBE0D0]/70 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5A4540]">Disponibilidad:</span>
                      <button
                        onClick={() => {
                          toggleProductAvailability(prod.id);
                          showToast(
                            isAvailable
                              ? `🔴 "${prod.name}" marcado como AGOTADO`
                              : `🟢 "${prod.name}" marcado como DISPONIBLE`
                          );
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
                          isAvailable
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isAvailable ? 'DISPONIBLE' : 'AGOTADO'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: DATOS DE SUCURSAL (CONFIGURACIÓN & REGISTRO) */}
        {/* ============================================================ */}
        {activeAdminTab === 'branch' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Sucursal Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE0D0] shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#EBE0D0] mb-6">
                <div>
                  <h2 className="text-xl font-black text-[#2A1619]">Información de la Sucursal</h2>
                  <p className="text-xs text-[#7A6560]">
                    Estos datos son los que ve el cliente y hacia donde se dirigen los pedidos por WhatsApp.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewBranchModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF4EC] hover:bg-[#F0E4D4] text-[#6B1124] text-xs font-extrabold border border-[#EBE0D0] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Sucursal</span>
                </button>
              </div>

              <form onSubmit={handleSaveBranch} className="space-y-5">
                {/* Branch Name */}
                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5">
                    Nombre de la Sucursal
                  </label>
                  <input
                    type="text"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-2xl text-sm font-bold text-[#2A1619] focus:outline-none focus:ring-2 focus:ring-[#6B1124]"
                    placeholder="Ej: Sucursal Centro, Sucursal Palermo"
                  />
                </div>

                {/* WhatsApp & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>WhatsApp para Pedidos</span>
                      <span className="text-[10px] text-emerald-700 font-bold">¡Crucial!</span>
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input
                        type="text"
                        value={branchForm.whatsapp}
                        onChange={(e) => setBranchForm({ ...branchForm, whatsapp: e.target.value.replace(/\D/g, '') })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-2xl text-sm font-bold text-[#2A1619] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="5491145229090 (sin + ni guiones)"
                      />
                    </div>
                    <p className="text-[11px] text-[#8A7570] mt-1">
                      Formato internacional sin símbolos (Ej: para Argentina: 54911xxxxxxxx).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5">
                      Teléfono Fijo / Mostrador
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={branchForm.phone}
                        onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-2xl text-sm font-bold text-[#2A1619] focus:outline-none focus:ring-2 focus:ring-[#6B1124]"
                        placeholder="+54 9 11 4522-9090"
                      />
                    </div>
                  </div>
                </div>

                {/* Address & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={branchForm.address}
                        onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-2xl text-sm font-bold text-[#2A1619] focus:outline-none focus:ring-2 focus:ring-[#6B1124]"
                        placeholder="Calle Belgrano 145"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5">
                      Ciudad / Zona
                    </label>
                    <input
                      type="text"
                      value={branchForm.city}
                      onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-2xl text-sm font-bold text-[#2A1619] focus:outline-none focus:ring-2 focus:ring-[#6B1124]"
                      placeholder="Buenos Aires, CABA"
                    />
                  </div>
                </div>

                {/* Hours & Open Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5">
                      Horarios de Atención
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={branchForm.hours}
                        onChange={(e) => setBranchForm({ ...branchForm, hours: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-2xl text-sm font-bold text-[#2A1619] focus:outline-none focus:ring-2 focus:ring-[#6B1124]"
                        placeholder="11:00 a 01:00 hs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5">
                      Estado del Local
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setBranchForm({ ...branchForm, isOpen: true })}
                        className={`flex-1 py-2 rounded-2xl text-xs font-black transition cursor-pointer ${
                          branchForm.isOpen
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-[#FAF4EC] text-[#5A4540] hover:bg-[#F0E4D4]'
                        }`}
                      >
                        🟢 ABIERTA
                      </button>
                      <button
                        type="button"
                        onClick={() => setBranchForm({ ...branchForm, isOpen: false })}
                        className={`flex-1 py-2 rounded-2xl text-xs font-black transition cursor-pointer ${
                          !branchForm.isOpen
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-[#FAF4EC] text-[#5A4540] hover:bg-[#F0E4D4]'
                        }`}
                      >
                        🔴 CERRADA
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 flex items-center justify-between border-t border-[#EBE0D0]">
                  {branches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar la sucursal "${selectedBranch.name}"?`)) {
                          deleteBranch(selectedBranch.id);
                          showToast('Sucursal eliminada');
                        }
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition cursor-pointer"
                    >
                      Eliminar Sucursal
                    </button>
                  )}

                  <button
                    type="submit"
                    className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#6B1124] hover:bg-[#520C1B] text-white text-sm font-black shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Live Preview of WhatsApp Comanda */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#1E110E] text-white p-6 rounded-3xl border border-[#38231E] shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-sm text-white">Simulador de Pedido por WhatsApp</h3>
                </div>
                <p className="text-xs text-[#C4B5A5] leading-relaxed mb-4">
                  Así es exactamente como recibirás el mensaje en tu WhatsApp cuando un cliente termine su pedido:
                </p>

                <div className="bg-[#0D1912] p-4 rounded-2xl border border-emerald-900/60 font-mono text-[11px] text-emerald-200 leading-relaxed whitespace-pre-wrap">
{`¡Hola Nerón (${branchForm.name})! 🍦
Quiero realizar el siguiente pedido:

• 1x Súper Crema ($ 2.500)
• 1x Cookies & Cream ($ 2.700)

*Total a pagar: $ 5.200*

📍 Entrega / Retiro en: ${branchForm.address}
¡Muchas gracias!`}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#C4B5A5]">Destino configurado:</span>
                  <a
                    href={`https://wa.me/${branchForm.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#E8AC3F] hover:underline flex items-center gap-1"
                  >
                    <span>+{branchForm.whatsapp}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* All branches list */}
              <div className="bg-white p-5 rounded-3xl border border-[#EBE0D0]">
                <h4 className="font-extrabold text-xs text-[#5A4540] uppercase tracking-wider mb-3">
                  Todas las Sucursales ({branches.length})
                </h4>
                <div className="space-y-2">
                  {branches.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBranch(b)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        b.id === selectedBranch.id
                          ? 'border-[#6B1124] bg-[#FFF8F0]'
                          : 'border-[#EBE0D0] hover:bg-[#FAF4EC]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-[#2A1619]">{b.name}</div>
                        <div className="text-[11px] text-[#7A6560]">{b.address}</div>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          b.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.isOpen ? 'ABIERTA' : 'CERRADA'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: GUÍA DE HOSTING & BASE DE DATOS */}
        {/* ============================================================ */}
        {activeAdminTab === 'hosting' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE0D0] shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#6B1124] text-white flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#2A1619]">
                    ¿Cómo publicar esta web en un Hosting y ponerla a funcionar?
                  </h2>
                  <p className="text-xs text-[#7A6560]">
                    Paso a paso para tener tu heladería online hoy mismo con dominio propio.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Paso 1 */}
                <div className="bg-[#FAF4EC] p-5 rounded-3xl border border-[#EBE0D0]">
                  <span className="w-7 h-7 rounded-full bg-[#6B1124] text-white text-xs font-black flex items-center justify-center mb-3">
                    1
                  </span>
                  <h3 className="font-extrabold text-sm text-[#2A1619]">Elegir el Hosting Gratuito</h3>
                  <p className="text-xs text-[#7A6560] mt-2 leading-relaxed">
                    Las opciones más rápidas y con costo $0 para empezar son <strong>Vercel</strong> o{' '}
                    <strong>Netlify</strong>. Solo subís tu repositorio de GitHub y se compila automáticamente con{' '}
                    <code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono">npm run build</code>.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="bg-[#FAF4EC] p-5 rounded-3xl border border-[#EBE0D0]">
                  <span className="w-7 h-7 rounded-full bg-[#6B1124] text-white text-xs font-black flex items-center justify-center mb-3">
                    2
                  </span>
                  <h3 className="font-extrabold text-sm text-[#2A1619]">Vincular Dominio Propio</h3>
                  <p className="text-xs text-[#7A6560] mt-2 leading-relaxed">
                    Podés comprar tu dominio en <strong>NIC.ar</strong> (ej:{' '}
                    <em>heladerianeron.com.ar</em>) o en Namecheap / GoDaddy (<em>neron.com</em>). Luego en Vercel
                    agregás los DNS (CNAME / registros A) y en 5 minutos ya tenés HTTPS con candadito verde.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="bg-[#FAF4EC] p-5 rounded-3xl border border-[#EBE0D0]">
                  <span className="w-7 h-7 rounded-full bg-[#6B1124] text-white text-xs font-black flex items-center justify-center mb-3">
                    3
                  </span>
                  <h3 className="font-extrabold text-sm text-[#2A1619]">URLs Separadas</h3>
                  <p className="text-xs text-[#7A6560] mt-2 leading-relaxed">
                    • <strong>Clientes:</strong> <code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono">tudominio.com</code> (acceso libre, arma pedidos y envía al WhatsApp).
                    <br />• <strong>Encargado:</strong> <code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono">tudominio.com/#/admin</code> (gestiona stock y precios).
                  </p>
                </div>
              </div>

              {/* Data Backup & Factory Reset Actions */}
              <div className="mt-8 pt-6 border-t border-[#EBE0D0] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm text-[#2A1619]">Respaldo y Restauración</h4>
                  <p className="text-xs text-[#7A6560]">
                    Podés restaurar los datos de fábrica en cualquier momento si querés empezar de cero.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const data = {
                        branches,
                        flavors,
                        products,
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup_neron_${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      showToast('💾 Backup descargado con éxito');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FAF4EC] hover:bg-[#F0E4D4] text-[#2A1619] text-xs font-bold border border-[#EBE0D0] transition cursor-pointer"
                  >
                    <span>Descargar Backup (JSON)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('¿Restaurar todos los datos a los valores originales de fábrica? Se perderán las modificaciones locales.')) {
                        resetToFactoryData();
                        showToast('🔄 Datos restaurados a valores de fábrica');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Fábrica</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL: NUEVA SUCURSAL */}
      {/* ============================================================ */}
      {isNewBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBE0D0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D0] mb-4">
              <h3 className="font-black text-lg text-[#2A1619]">Registrar Nueva Sucursal</h3>
              <button
                onClick={() => setIsNewBranchModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newB = createBranch({
                  name: formData.get('name') as string,
                  address: formData.get('address') as string,
                  city: formData.get('city') as string,
                  hours: formData.get('hours') as string,
                  phone: formData.get('phone') as string,
                  whatsapp: (formData.get('whatsapp') as string).replace(/\D/g, ''),
                  isOpen: true,
                });
                setIsNewBranchModalOpen(false);
                showToast(`Sucursal "${newB.name}" creada con éxito`);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Nombre de la Sucursal
                </label>
                <input
                  name="name"
                  required
                  placeholder="Ej: Sucursal Belgrano"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    WhatsApp para Pedidos
                  </label>
                  <input
                    name="whatsapp"
                    required
                    placeholder="5491145229090"
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    Teléfono Fijo
                  </label>
                  <input
                    name="phone"
                    placeholder="+54 9 11 4000-0000"
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    Dirección
                  </label>
                  <input
                    name="address"
                    required
                    placeholder="Av. Cabildo 2200"
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    Ciudad / Barrio
                  </label>
                  <input
                    name="city"
                    required
                    placeholder="Belgrano, CABA"
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Horarios de Atención
                </label>
                <input
                  name="hours"
                  required
                  placeholder="12:00 a 01:00 hs"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#EBE0D0]">
                <button
                  type="button"
                  onClick={() => setIsNewBranchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A4540]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6B1124] text-white text-xs font-black shadow-sm"
                >
                  Guardar Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDITAR / NUEVO SABOR */}
      {/* ============================================================ */}
      {(editingFlavor || isNewFlavorModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBE0D0] animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D0] mb-4">
              <h3 className="font-black text-lg text-[#2A1619]">
                {editingFlavor ? `Editar Sabor: ${editingFlavor.name}` : 'Agregar Nuevo Sabor a la Heladería'}
              </h3>
              <button
                onClick={() => {
                  setEditingFlavor(null);
                  setIsNewFlavorModalOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const tagsStr = (formData.get('tags') as string) || '';
                const tags = tagsStr
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);

                const data: any = {
                  name: formData.get('name') as string,
                  subtitle: formData.get('subtitle') as string,
                  category: 'helados',
                  price: parseFloat(formData.get('price') as string) || 2500,
                  description: formData.get('description') as string,
                  image:
                    (formData.get('image') as string) ||
                    editingFlavor?.image ||
                    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
                  tags: tags.length > 0 ? tags : ['Artesanal'],
                  badge: (formData.get('badge') as string) || undefined,
                  rating: 5.0,
                  reviewCount: 150,
                  isAvailable: true,
                };

                if (editingFlavor) {
                  updateFlavor({ ...editingFlavor, ...data });
                  showToast(`Sabor ${data.name} actualizado`);
                } else {
                  addFlavor(data);
                  showToast(`¡Nuevo sabor ${data.name} agregado al catálogo!`);
                }

                setEditingFlavor(null);
                setIsNewFlavorModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Nombre del Sabor
                </label>
                <input
                  name="name"
                  defaultValue={editingFlavor?.name || ''}
                  required
                  placeholder="Ej: Dulce de Leche Tentación"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    Precio ($ ARS)
                  </label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={editingFlavor?.price || 2500}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    Badge / Destacado
                  </label>
                  <input
                    name="badge"
                    defaultValue={editingFlavor?.badge || ''}
                    placeholder="MÁS PEDIDO, NUEVO, EDICIÓN LIMITADA"
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Subtítulo Breve
                </label>
                <input
                  name="subtitle"
                  defaultValue={editingFlavor?.subtitle || ''}
                  placeholder="Con trozos de chocolate y salsa de caramelo"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Descripción Completa
                </label>
                <textarea
                  name="description"
                  defaultValue={editingFlavor?.description || ''}
                  rows={3}
                  placeholder="Elaboración artesanal con leche fresca y..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  name="tags"
                  defaultValue={editingFlavor?.tags?.join(', ') || 'Sin TACC, Vegano'}
                  placeholder="Sin TACC, Chocolate, Frutal, Vegano"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  URL de Imagen (opcional)
                </label>
                <input
                  name="image"
                  defaultValue={editingFlavor?.image || ''}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#EBE0D0]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFlavor(null);
                    setIsNewFlavorModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A4540]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6B1124] text-white text-xs font-black shadow-sm"
                >
                  Guardar Sabor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDITAR / NUEVO PRODUCTO */}
      {/* ============================================================ */}
      {(editingProduct || isNewProductModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBE0D0] animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D0] mb-4">
              <h3 className="font-black text-lg text-[#2A1619]">
                {editingProduct ? `Editar Producto: ${editingProduct.name}` : 'Agregar Nuevo Producto'}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsNewProductModalOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data: any = {
                  name: formData.get('name') as string,
                  category: formData.get('category') as CategoryType,
                  price: parseFloat(formData.get('price') as string) || 2500,
                  subtitle: formData.get('subtitle') as string,
                  description: formData.get('description') as string,
                  badge: (formData.get('badge') as string) || undefined,
                  image:
                    (formData.get('image') as string) ||
                    editingProduct?.image ||
                    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
                  isAvailable: true,
                };

                if (editingProduct) {
                  updateProduct({ ...editingProduct, ...data });
                  showToast(`Producto ${data.name} actualizado`);
                } else {
                  addProduct(data);
                  showToast(`Producto ${data.name} agregado`);
                }

                setEditingProduct(null);
                setIsNewProductModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Nombre del Producto
                </label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name || ''}
                  required
                  placeholder="Ej: Copa Nerón Especial"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    Categoría
                  </label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'helados'}
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  >
                    <option value="helados">Helados</option>
                    <option value="cafeteria">Cafetería</option>
                    <option value="tragos">Tragos</option>
                    <option value="postres">Postres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                    Precio ($ ARS)
                  </label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={editingProduct?.price || 2500}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Subtítulo / Breve descripción
                </label>
                <input
                  name="subtitle"
                  defaultValue={editingProduct?.subtitle || ''}
                  placeholder="Cucurucho de 2 bochas con salsa caliente"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Detalles del Producto
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description || ''}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  Badge (opcional)
                </label>
                <input
                  name="badge"
                  defaultValue={editingProduct?.badge || ''}
                  placeholder="FAVORITO, PREMIUM, NUEVO"
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1">
                  URL de Imagen (opcional)
                </label>
                <input
                  name="image"
                  defaultValue={editingProduct?.image || ''}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#EBE0D0]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsNewProductModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A4540]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6B1124] text-white text-xs font-black shadow-sm"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EBE0D0] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE0D0]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F6EDE2] text-[#6B1124] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#2A1619]">
                    Cambiar Clave de Acceso
                  </h3>
                  <p className="text-xs text-[#7A645D]">Modificá la contraseña del panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF4EC] text-[#5A4540] flex items-center justify-center hover:bg-[#EFE4D3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPasswordInput.trim().length < 4) {
                  showToast('⚠️ La clave debe tener al menos 4 caracteres');
                  return;
                }
                changeAdminPassword(newPasswordInput.trim());
                showToast('🔑 ¡Clave de acceso actualizada exitosamente!');
                setIsChangePasswordModalOpen(false);
              }}
              className="mt-5 space-y-4"
            >
              <div className="p-3 bg-[#FAF4EC] rounded-xl text-xs text-[#7A645D] border border-[#EBE0D0]">
                <span>Clave actual registrada: </span>
                <strong className="text-[#2A1619] font-mono">{adminPassword}</strong>
              </div>

              <div>
                <label className="block text-xs font-black text-[#5A4540] uppercase tracking-wider mb-1.5">
                  Nueva Clave
                </label>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Ej: neron2025"
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-[#FAF4EC] border border-[#EBE0D0] rounded-xl text-sm font-bold text-[#2A1619] focus:outline-none focus:border-[#6B1124] focus:bg-white"
                />
                <p className="text-[11px] text-[#8C756D] mt-1">
                  Mínimo 4 caracteres. Te recomendamos anotarla o guardarla.
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#EBE0D0]">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A4540] hover:bg-[#FAF4EC]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6B1124] hover:bg-[#520C1B] text-white text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Nueva Clave</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
