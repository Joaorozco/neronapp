import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { FlavorsView } from './components/FlavorsView';
import { CartCheckoutView } from './components/CartCheckoutView';
import { RewardsView } from './components/RewardsView';
import { ProfileView } from './components/ProfileView';
import { FlavorDetailModal } from './components/FlavorDetailModal';
import { BranchModal } from './components/BranchModal';
import { AdminView } from './components/AdminView';
import { AdminLoginView } from './components/AdminLoginView';
import { StoreProvider, useStore } from './context/StoreContext';
import { Flavor, CartItem, TabType, SizeOption, ContainerOption, Branch, ProductItem } from './types';

function AppContent() {
  const {
    viewMode,
    isAdminAuthenticated,
    flavors,
    branches,
    selectedBranch,
    setSelectedBranch,
  } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedFlavorModal, setSelectedFlavorModal] = useState<Flavor | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neron_favorites');
      return saved ? JSON.parse(saved) : ['super_crema', 'cookies_and_cream', 'dulce_de_leche'];
    } catch {
      return ['super_crema', 'cookies_and_cream', 'dulce_de_leche'];
    }
  });

  // Cart state - initialized with Súper Crema to match mockup if empty
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('neron_cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'initial-super-crema',
        flavorId: 'super_crema',
        flavorName: 'Súper Crema',
        flavorImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
        size: { id: 'single', name: '1 Bocha', scoopsLabel: 'Cucurucho artesanal', price: 2500 },
        container: { id: 'cone', name: 'Cucurucho Crocante', iconName: 'Cone', extraPrice: 0 },
        quantity: 1,
        toppings: [],
        unitPrice: 2500,
        totalPrice: 2500,
      },
    ];
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync favorites & cart
  useEffect(() => {
    localStorage.setItem('neron_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('neron_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Toggle favorite
  const handleToggleFavorite = (flavorId: string) => {
    if (favorites.includes(flavorId)) {
      setFavorites(favorites.filter((id) => id !== flavorId));
      showToast('Sabor quitado de favoritos');
    } else {
      setFavorites([...favorites, flavorId]);
      showToast('¡Sabor guardado en favoritos! ❤️');
    }
  };

  // Direct add ProductItem to cart from HomeView
  const handleAddToCartProduct = (product: ProductItem) => {
    if (product.isAvailable === false) {
      showToast('⚠️ Este producto está actualmente agotado');
      return;
    }

    const existingIndex = cart.findIndex((item) => item.flavorId === product.id);
    if (existingIndex > -1) {
      handleUpdateCartQuantity(cart[existingIndex].id, 1);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        flavorId: product.id,
        flavorName: product.name,
        flavorImage: product.image,
        size: { id: 'std', name: 'Porción Nerón', scoopsLabel: 'Individual', price: product.price },
        container: { id: 'cup', name: 'Envase Nerón', iconName: 'CupSoda', extraPrice: 0 },
        quantity: 1,
        toppings: [],
        unitPrice: product.price,
        totalPrice: product.price,
      };
      setCart((prev) => [...prev, newItem]);
    }
    showToast(`¡${product.name} agregado al pedido! 🍨`);
  };

  // Add customized flavor to cart
  const handleAddToCart = (
    flavor: Flavor,
    size: SizeOption,
    container: ContainerOption,
    quantity: number,
    toppings: string[],
    totalPrice: number
  ) => {
    if (flavor.isAvailable === false) {
      showToast('⚠️ Este sabor está actualmente agotado en esta sucursal');
      return;
    }

    const newItem: CartItem = {
      id: `${flavor.id}-${size.id}-${container.id}-${Date.now()}`,
      flavorId: flavor.id,
      flavorName: flavor.name,
      flavorImage: flavor.image,
      size,
      container,
      quantity,
      toppings,
      unitPrice: totalPrice / quantity,
      totalPrice,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`¡${quantity}x ${flavor.name} agregado al pedido! 🍦`);
  };

  // Update quantity in cart
  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item from cart
  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Producto quitado del pedido');
  };

  // Total items in cart
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If currently in Admin view mode, check authentication
  if (viewMode === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLoginView />;
    }
    return <AdminView />;
  }

  // Otherwise, render Public Client View (No login needed)
  return (
    <div className="min-h-screen bg-[#FAF4EC] text-[#2A1619] font-sans antialiased selection:bg-[#EFE4D3]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2A1619]/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex items-center gap-2 border border-white/10">
          <span>🍨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Public Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setActiveTab('menu')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoriteCount={favorites.length}
        selectedBranch={selectedBranch}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 min-h-[calc(100vh-120px)]">
        {activeTab === 'home' && (
          <HomeView
            cart={cart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onRemoveCartItem={handleRemoveCartItem}
            onAddToCartProduct={handleAddToCartProduct}
            selectedBranch={selectedBranch}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'flavors' && (
          <FlavorsView
            flavors={flavors}
            onSelectFlavor={(f) => setSelectedFlavorModal(f)}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        )}

        {activeTab === 'menu' && (
          <CartCheckoutView
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={() => setCart([])}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'rewards' && <RewardsView />}

        {activeTab === 'profile' && (
          <ProfileView
            favorites={favorites}
            flavors={flavors}
            onSelectFlavor={(f) => setSelectedFlavorModal(f)}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Flavor Detail Modal */}
      <FlavorDetailModal
        flavor={selectedFlavorModal}
        onClose={() => setSelectedFlavorModal(null)}
        onAddToCart={handleAddToCart}
        isFavorite={selectedFlavorModal ? favorites.includes(selectedFlavorModal.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Branch Selector Modal */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={(b) => {
          setSelectedBranch(b);
          showToast(`Sucursal seleccionada: ${b.name}`);
        }}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} cartCount={totalCartCount} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
