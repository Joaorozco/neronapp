export type CategoryType = 'helados' | 'cafeteria' | 'tragos' | 'postres' | 'all';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
  phone: string;
  whatsapp: string;
  isOpen: boolean;
  distance?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  image: string;
  description?: string;
  subtitle?: string;
  rating?: number;
  badge?: string;
  isAvailable?: boolean;
}

export interface Flavor {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryType;
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  image: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  colorBg?: string;
  badge?: string;
  isAvailable?: boolean;
}

export interface SizeOption {
  id: string;
  name: string;
  scoopsLabel: string;
  price: number;
  isPopular?: boolean;
}

export interface ContainerOption {
  id: string;
  name: string;
  iconName: string;
  extraPrice: number;
}

export interface CartItem {
  id: string;
  flavorId: string;
  flavorName: string;
  flavorImage: string;
  size: SizeOption;
  container: ContainerOption;
  quantity: number;
  toppings: string[];
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  status: 'preparing' | 'delivering' | 'completed';
  address: string;
  paymentMethod: string;
  createdAt: string;
  estimatedMinutes: number;
}

export type TabType = 'home' | 'flavors' | 'menu' | 'rewards' | 'profile';
