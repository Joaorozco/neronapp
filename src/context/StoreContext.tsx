import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch, Flavor, ProductItem, CartItem, CategoryType } from '../types';
import { BRANCHES as INITIAL_BRANCHES, CATALOG_PRODUCTS as INITIAL_PRODUCTS, FLAVORS_DATA as INITIAL_FLAVORS } from '../data/flavors';

// Extended flavor list with classics for authentic ice cream shop experience
const EXTENDED_INITIAL_FLAVORS: Flavor[] = [
  ...INITIAL_FLAVORS.map((f) => ({ ...f, isAvailable: f.isAvailable ?? true })),
  {
    id: 'dulce_de_leche_granizado',
    name: 'Dulce de Leche Granizado',
    subtitle: 'Con abundantes chips de chocolate belga',
    category: 'helados',
    rating: 4.9,
    reviewCount: 380,
    price: 2500,
    description: 'Nuestra crema de dulce de leche con crocantes escamas de chocolate semiamargo intercaladas.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    tags: ['Clásico', 'Dulce de Leche', 'Granizado'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'sambayon_artesanal',
    name: 'Sambayón Tradicional al Oporto',
    subtitle: 'Yemas de huevo batidas con vino dulce de Oporto',
    category: 'helados',
    rating: 4.8,
    reviewCount: 215,
    price: 2700,
    description: 'Elaboración tradicional italiana a baño maría con yemas frescas de campo, azúcar y reducción de Oporto reserva.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    tags: ['Tradicional', 'Italiano'],
    isAvailable: true,
  },
  {
    id: 'pistacho_siciliano',
    name: 'Pistacho Puro de Sicilia',
    subtitle: '100% pasta pura de pistachos tostados de Bronte',
    category: 'helados',
    rating: 5.0,
    reviewCount: 460,
    price: 3200,
    description: 'Sabor de culto. Elaborado con pistachos importados de Bronte (Sicilia), sin colorantes artificiales y toque de sal marina.',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
    tags: ['Gourmet', 'Importado', 'Sin TACC'],
    isPopular: true,
    badge: 'EDICIÓN ESPECIAL',
    isAvailable: true,
  },
  {
    id: 'tramontana_crujiente',
    name: 'Tramontana Nerón',
    subtitle: 'Crema chantilly con dulce de leche y micro-galletitas bañadas',
    category: 'helados',
    rating: 4.9,
    reviewCount: 310,
    price: 2600,
    description: 'Suave crema americana combinada con hilos de dulce de leche y crujientes bolitas de cereal bañadas en chocolate.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    tags: ['Favorito', 'Crocante'],
    isAvailable: true,
  },
  {
    id: 'limon_menta_jengibre',
    name: 'Limón, Menta & Jengibre',
    subtitle: 'Sorbet refrescante al agua 100% natural',
    category: 'helados',
    rating: 4.7,
    reviewCount: 140,
    price: 2500,
    description: 'Jugo exprimido de limones seleccionados, hojas frescas de menta machacadas y un toque sutil de raíz de jengibre.',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegano', '0% Grasa', 'Refrescante'],
    isAvailable: true,
  },
  {
    id: 'banana_split',
    name: 'Banana Split Cremosa',
    subtitle: 'Puré de banana natural con dulce de leche y chocolate',
    category: 'helados',
    rating: 4.8,
    reviewCount: 198,
    price: 2500,
    description: 'Helado a base de bananas naturales maduradas a punto dulce, veteado de dulce de leche repostero y hebras de chocolate semiamargo.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    tags: ['Frutal', 'Clásico'],
    isAvailable: true,
  }
];

interface StoreContextType {
  // Navigation & View Mode
  viewMode: 'client' | 'admin';
  setViewMode: (mode: 'client' | 'admin') => void;

  // Branches
  branches: Branch[];
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  createBranch: (branchData: Omit<Branch, 'id'>) => Branch;
  deleteBranch: (branchId: string) => void;

  // Flavors (Stock & Management)
  flavors: Flavor[];
  toggleFlavorAvailability: (flavorId: string) => void;
  updateFlavor: (flavor: Flavor) => void;
  addFlavor: (flavorData: Omit<Flavor, 'id'>) => Flavor;
  deleteFlavor: (flavorId: string) => void;

  // Products (Catalog & Prices)
  products: ProductItem[];
  toggleProductAvailability: (productId: string) => void;
  updateProduct: (product: ProductItem) => void;
  addProduct: (productData: Omit<ProductItem, 'id'>) => ProductItem;
  deleteProduct: (productId: string) => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminPassword: string;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPass: string) => boolean;

  // Reset to default factory state
  resetToFactoryData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BRANCHES: 'neron_stored_branches_v1',
  SELECTED_BRANCH_ID: 'neron_selected_branch_id_v1',
  FLAVORS: 'neron_stored_flavors_v1',
  PRODUCTS: 'neron_stored_products_v1',
  ADMIN_PASSWORD: 'neron_admin_password_v1',
  ADMIN_AUTH: 'neron_admin_auth_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect viewMode from hash, path, or query (?admin=true, #/admin, /admin)
  const [viewMode, setViewModeState] = useState<'client' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('admin') || path.includes('admin') || search.includes('admin')) {
        return 'admin';
      }
    }
    return 'client';
  });

  const setViewMode = (mode: 'client' | 'admin') => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      if (mode === 'admin') {
        window.location.hash = '/admin';
      } else {
        window.location.hash = '/';
      }
    }
  };

  // Listen to hash changes (e.g. user hits back button or pastes #/admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) {
        setViewModeState('admin');
      } else {
        setViewModeState('client');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Branches State
  const [branches, setBranches] = useState<Branch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANCHES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading branches', e);
    }
    return INITIAL_BRANCHES;
  });

  // Selected Branch
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_BRANCH_ID);
      if (saved && branches.some((b) => b.id === saved)) return saved;
    } catch {}
    return branches[0]?.id || INITIAL_BRANCHES[0].id;
  });

  // Flavors State
  const [flavors, setFlavors] = useState<Flavor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLAVORS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading flavors', e);
    }
    return EXTENDED_INITIAL_FLAVORS;
  });

  // Products State
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading products', e);
    }
    return INITIAL_PRODUCTS.map((p) => ({ ...p, isAvailable: p.isAvailable ?? true }));
  });

  // Persist Branches
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
    } catch (e) {
      console.error(e);
    }
  }, [branches]);

  // Persist Selected Branch ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_BRANCH_ID, selectedBranchId);
    } catch (e) {
      console.error(e);
    }
  }, [selectedBranchId]);

  // Persist Flavors
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FLAVORS, JSON.stringify(flavors));
    } catch (e) {
      console.error(e);
    }
  }, [flavors]);

  // Persist Products
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Current selected branch object
  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0] || INITIAL_BRANCHES[0];

  const setSelectedBranch = (b: Branch) => {
    setSelectedBranchId(b.id);
  };

  // Branch CRUD
  const updateBranch = (updated: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const createBranch = (data: Omit<Branch, 'id'>): Branch => {
    const newId = `branch-${Date.now()}`;
    const newBranch: Branch = { ...data, id: newId };
    setBranches((prev) => [...prev, newBranch]);
    setSelectedBranchId(newId);
    return newBranch;
  };

  const deleteBranch = (branchId: string) => {
    if (branches.length <= 1) return;
    setBranches((prev) => {
      const filtered = prev.filter((b) => b.id !== branchId);
      if (selectedBranchId === branchId) {
        setSelectedBranchId(filtered[0]?.id || '');
      }
      return filtered;
    });
  };

  // Flavor Operations
  const toggleFlavorAvailability = (flavorId: string) => {
    setFlavors((prev) =>
      prev.map((f) => {
        if (f.id === flavorId) {
          return { ...f, isAvailable: f.isAvailable === false ? true : false };
        }
        return f;
      })
    );
  };

  const updateFlavor = (updated: Flavor) => {
    setFlavors((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const addFlavor = (flavorData: Omit<Flavor, 'id'>): Flavor => {
    const newId = `flavor-${Date.now()}`;
    const newFlavor: Flavor = {
      ...flavorData,
      id: newId,
      isAvailable: flavorData.isAvailable ?? true,
    };
    setFlavors((prev) => [newFlavor, ...prev]);
    return newFlavor;
  };

  const deleteFlavor = (flavorId: string) => {
    setFlavors((prev) => prev.filter((f) => f.id !== flavorId));
  };

  // Product Operations
  const toggleProductAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, isAvailable: p.isAvailable === false ? true : false };
        }
        return p;
      })
    );
  };

  const updateProduct = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const addProduct = (productData: Omit<ProductItem, 'id'>): ProductItem => {
    const newId = `prod-${Date.now()}`;
    const newProduct: ProductItem = {
      ...productData,
      id: newId,
      isAvailable: productData.isAvailable ?? true,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Admin Authentication State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
      if (saved) return saved;
    } catch {}
    return 'neron2024';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const auth = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return auth === 'true';
    } catch {}
    return false;
  });

  const loginAdmin = (password: string): boolean => {
    if (password.trim() === adminPassword.trim()) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {}
    setViewMode('client');
  };

  const changeAdminPassword = (newPass: string): boolean => {
    if (!newPass || newPass.trim().length < 4) return false;
    const trimmed = newPass.trim();
    setAdminPassword(trimmed);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, trimmed);
    } catch {}
    return true;
  };

  // Reset to factory defaults
  const resetToFactoryData = () => {
    localStorage.removeItem(STORAGE_KEYS.BRANCHES);
    localStorage.removeItem(STORAGE_KEYS.FLAVORS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    setBranches(INITIAL_BRANCHES);
    setSelectedBranchId(INITIAL_BRANCHES[0].id);
    setFlavors(EXTENDED_INITIAL_FLAVORS);
    setProducts(INITIAL_PRODUCTS.map((p) => ({ ...p, isAvailable: true })));
  };

  return (
    <StoreContext.Provider
      value={{
        viewMode,
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
        isAdminAuthenticated,
        adminPassword,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        resetToFactoryData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
