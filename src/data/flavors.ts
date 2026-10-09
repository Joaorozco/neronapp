import { Flavor, SizeOption, ContainerOption, Branch, ProductItem } from '../types';

import superCremaImg from '../assets/images/neron_super_crema_cone_1791562763647.jpg';
import cookiesCreamImg from '../assets/images/neron_cookies_cream_cone_1791562781378.jpg';
import vasitoClasicoImg from '../assets/images/neron_vasito_clasico_1791562809344.jpg';
import vasitoEspecialImg from '../assets/images/neron_vasito_especial_1791562834286.jpg';
import cappuccinoImg from '../assets/images/neron_cappuccino_coffee_1791562977944.jpg';
import copaBrownieImg from '../assets/images/neron_copa_brownie_1791563003516.jpg';
import tragoAperolImg from '../assets/images/neron_trago_aperol_1791563057779.jpg';
import heroBannerImg from '../assets/images/neron_hero_cafe_banner_1791562744526.jpg';

export { heroBannerImg };

export const BRANCHES: Branch[] = [
  {
    id: 'centro',
    name: 'Sucursal Centro',
    address: 'Calle Belgrano 145',
    city: 'Buenos Aires',
    hours: '11:00 a 01:00 hs',
    phone: '+54 9 11 4522-9090',
    whatsapp: '5491145229090',
    isOpen: true,
    distance: '0.8 km'
  },
  {
    id: 'palermo',
    name: 'Sucursal Palermo Soho',
    address: 'Honduras 4820',
    city: 'Palermo, CABA',
    hours: '12:00 a 02:00 hs',
    phone: '+54 9 11 4831-2244',
    whatsapp: '5491148312244',
    isOpen: true,
    distance: '2.4 km'
  },
  {
    id: 'costanera',
    name: 'Sucursal Costanera',
    address: 'Av. del Mar 450',
    city: 'Costanera Norte',
    hours: '12:00 a 02:30 hs',
    phone: '+54 9 11 4780-5566',
    whatsapp: '5491147805566',
    isOpen: true,
    distance: '4.1 km'
  }
];

export const MAIN_CATEGORY_TABS = [
  { id: 'helados', label: 'Helados', icon: '🍦' },
  { id: 'cafeteria', label: 'Cafetería', icon: '☕' },
  { id: 'tragos', label: 'Tragos', icon: '🍹' },
  { id: 'postres', label: 'Postres', icon: '🍰' },
];

export const CATALOG_PRODUCTS: ProductItem[] = [
  // HELADOS
  {
    id: 'super_crema',
    name: 'Súper Crema',
    subtitle: 'Doble bocha en cucurucho crocante artesanal',
    category: 'helados',
    price: 2500,
    image: superCremaImg,
    badge: 'FAVORITO',
    description: 'Nuestra combinación insignia: una bocha de chocolate intenso con frambuesas y crema suave en un cucurucho dorado recién horneado.'
  },
  {
    id: 'cookies_cream',
    name: 'Cookies & Cream',
    subtitle: 'Crema americana con abundantes galletas crocantes',
    category: 'helados',
    price: 2700,
    image: cookiesCreamImg,
    badge: 'MÁS PEDIDO',
    description: 'Cremosa base de vainilla artesanal infusionada con generosos trozos de galleta chocolatada estilo Oreo.'
  },
  {
    id: 'vasito_clasico',
    name: 'Vasito Clásico',
    subtitle: 'Dos sabores a elección servidos en pote Nerón',
    category: 'helados',
    price: 2800,
    image: vasitoClasicoImg,
    description: 'Servido en nuestro icónico pote bordeaux con cuchara biodegradable. Ideal para disfrutar tus dos sabores favoritos.'
  },
  {
    id: 'vasito_especial',
    name: 'Vasito Especial',
    subtitle: 'Gelato artesanal bañado con salsa tibia y frutos secos',
    category: 'helados',
    price: 3200,
    image: vasitoEspecialImg,
    badge: 'PREMIUM',
    description: 'Copa de gelato premium con salsa artesanal de dulce de leche, lluvia de chocolate y almendras tostadas crujientes.'
  },

  // CAFETERIA
  {
    id: 'cappuccino_italiano',
    name: 'Cappuccino Nerón',
    subtitle: 'Espresso con espuma sedosa de leche y canela',
    category: 'cafeteria',
    price: 2200,
    image: cappuccinoImg,
    description: 'Granos de café de especialidad tostados al punto justo, coronado con cremosa leche vaporizada y galletita artesanal.'
  },
  {
    id: 'espresso_doble',
    name: 'Café Espresso Doble',
    subtitle: 'Extracción pura con crema dorada y aroma intenso',
    category: 'cafeteria',
    price: 1800,
    image: cappuccinoImg,
    description: 'Doble shot de blend de autor con notas a cacao y avellana.'
  },
  {
    id: 'submarino_clasico',
    name: 'Submarino Clásico',
    subtitle: 'Barra de chocolate semiamargo derretida en leche caliente',
    category: 'cafeteria',
    price: 2400,
    image: cappuccinoImg,
    description: 'El clásico de siempre con chocolate colonial de alta pureza.'
  },

  // TRAGOS
  {
    id: 'aperol_spritz_helado',
    name: 'Aperol Spritz Helado',
    subtitle: 'Prosecco, Aperol y sorbet refrescante de limón',
    category: 'tragos',
    price: 3800,
    image: tragoAperolImg,
    badge: 'AUTOR',
    description: 'El trago italiano por excelencia con un toque moderno: una refrescante bocha de sorbet de limón artesanal.'
  },
  {
    id: 'gin_tonic_neron',
    name: 'Gin Tonic Nerón Cítrico',
    subtitle: 'Gin artesanal, tónica premium, frutos rojos y hielo esférico',
    category: 'tragos',
    price: 3900,
    image: tragoAperolImg,
    description: 'Gin macerado con botánicos patagónicos y un sutil dash de frambuesa fresca.'
  },
  {
    id: 'milkshake_baileys',
    name: 'Milkshake Baileys Cream',
    subtitle: 'Helado de crema americana, licor Baileys y chispas',
    category: 'tragos',
    price: 4200,
    image: tragoAperolImg,
    badge: 'ESPECIAL',
    description: 'Batido indulgente para mayores de 18 años con crema irlandesa y virutas de chocolate.'
  },

  // POSTRES
  {
    id: 'copa_brownie',
    name: 'Copa Brownie Bomba',
    subtitle: 'Brownie tibio, helado de crema, dulce de leche y nueces',
    category: 'postres',
    price: 3600,
    image: copaBrownieImg,
    badge: 'DELUXE',
    description: 'Trozos de brownie artesanal húmedo combinados con helado, fudge de chocolate belga y nueces de Pecán.'
  },
  {
    id: 'tiramisu_artesanal',
    name: 'Tiramisú Tradicional',
    subtitle: 'Vainillas al café espresso con suave crema de mascarpone',
    category: 'postres',
    price: 3400,
    image: copaBrownieImg,
    description: 'Receta de familia con auténtico mascarpone, cacao amargo y licor amaretto.'
  },
  {
    id: 'volcan_chocolate',
    name: 'Volcán de Chocolate',
    subtitle: 'Centro líquido de chocolate caliente con bocha de americana',
    category: 'postres',
    price: 3800,
    image: vasitoEspecialImg,
    description: 'Servido tibio para disfrutar el contraste de temperaturas con nuestro helado artesanal.'
  }
];

export const SIZE_OPTIONS: SizeOption[] = [
  { id: 'single', name: '1 Bocha', scoopsLabel: 'Single Scoop (Vaso/Cucurucho)', price: 2500, isPopular: true },
  { id: 'double', name: '2 Bochas', scoopsLabel: 'Double Scoop (Waffle Cone)', price: 3200 },
  { id: 'pint', name: '1/2 Kilo', scoopsLabel: 'Pint / 500g (Pinta familiar)', price: 6800 },
  { id: 'family', name: '1 Kilo', scoopsLabel: 'Familia 1Kg (Hasta 4 Sabores)', price: 12500 },
];

export const CONTAINER_OPTIONS: ContainerOption[] = [
  { id: 'cup', name: 'Vaso', iconName: 'CupSoda', extraPrice: 0 },
  { id: 'waffle_cone', name: 'Cucurucho Crocante', iconName: 'Cone', extraPrice: 300 },
  { id: 'chocolate_cone', name: 'Cucurucho Especial Choco', iconName: 'Sparkles', extraPrice: 600 },
];

export const TOPPINGS_LIST = [
  { id: 'sprinkles', name: 'Chispas de Colores', price: 200 },
  { id: 'choco_chips', name: 'Chips de Chocolate', price: 250 },
  { id: 'dulce_leche', name: 'Salsa Dulce de Leche', price: 300 },
  { id: 'nutella', name: 'Salsa de Nutella', price: 400 },
  { id: 'almonds', name: 'Almendras Tostadas', price: 350 },
  { id: 'whipped_cream', name: 'Crema Batida', price: 300 },
];

export const FLAVORS_DATA: Flavor[] = [
  {
    id: 'super_crema',
    name: 'Súper Crema',
    subtitle: 'Doble bocha en cucurucho crocante',
    category: 'helados',
    rating: 4.9,
    reviewCount: 312,
    price: 2500,
    description: 'Nuestra combinación insignia: una bocha de chocolate intenso con frambuesas y crema suave en un cucurucho dorado recién horneado.',
    image: superCremaImg,
    tags: ['Favorito', 'Artesanal', 'Cucurucho'],
    isPopular: true,
    badge: 'MÁS PEDIDO',
  },
  {
    id: 'cookies_and_cream',
    name: 'Cookies & Cream',
    subtitle: 'Crema con abundante galleta crocante',
    category: 'helados',
    rating: 4.9,
    reviewCount: 280,
    price: 2700,
    description: 'Suave crema americana repleta de trozos enteros y triturados de galletas de chocolate estilo Oreo.',
    image: cookiesCreamImg,
    tags: ['Crocante', 'Galletas'],
    isPopular: true,
    badge: 'FAVORITO #1',
  },
  {
    id: 'vasito_clasico',
    name: 'Vasito Clásico',
    subtitle: 'Dos sabores servidos en pote Nerón',
    category: 'helados',
    rating: 4.8,
    reviewCount: 195,
    price: 2800,
    description: 'Servido en nuestro icónico pote bordeaux con cuchara biodegradable. Ideal para combinar tus dos sabores preferidos.',
    image: vasitoClasicoImg,
    tags: ['Clásico', 'Pote'],
    isPopular: true,
  },
  {
    id: 'vasito_especial',
    name: 'Vasito Especial',
    subtitle: 'Con dulce de leche, chocolate y crocante',
    category: 'helados',
    rating: 5.0,
    reviewCount: 420,
    price: 3200,
    description: 'Copa de gelato premium con salsa artesanal de dulce de leche, lluvia de chocolate y almendras tostadas crujientes.',
    image: vasitoEspecialImg,
    tags: ['Premium', 'Toppings'],
    isPopular: true,
    badge: 'ESTRELLA',
  },
  {
    id: 'dulce_de_leche',
    name: 'Dulce de Leche Nerón',
    subtitle: 'Súper cremoso con veteado de dulce artesanal',
    category: 'helados',
    rating: 5.0,
    reviewCount: 540,
    price: 2500,
    description: 'El orgullo argentino y secreto de la casa. Dulce de leche concentrado con veteado extra de dulce de leche colonial.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    tags: ['Favorito de la Casa', 'Receta Tradicional'],
    isPopular: true,
    badge: 'TRADICIONAL',
  },
  {
    id: 'chocolate_amargo',
    name: 'Chocolate Amargo 70%',
    subtitle: 'Intenso cacao belga para verdaderos amantes',
    category: 'helados',
    rating: 4.9,
    reviewCount: 210,
    price: 2500,
    description: 'Elaborado con selecto cacao de origen belga al 70%, notas tostadas y textura aterciopelada insuperable.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    tags: ['70% Cacao', 'Gourmet'],
    isPopular: true,
  },
  {
    id: 'frutos_del_bosque',
    name: 'Frutos del Bosque (Sorbet)',
    subtitle: 'Sorbet de frambuesas, moras y arándanos',
    category: 'helados',
    rating: 4.8,
    reviewCount: 150,
    price: 2500,
    description: 'Sorbet al agua 100% frutal y vegano con una intensa mezcla de frambuesas patagónicas, moras frescas y arándanos.',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegano', '0% Lactosa', 'Sin Gluten'],
    isPopular: false,
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'helados', label: 'Helados' },
  { id: 'cafeteria', label: 'Cafetería' },
  { id: 'tragos', label: 'Tragos' },
  { id: 'postres', label: 'Postres' },
];

export const MENU_CATEGORIES = [
  {
    id: 'helados',
    title: 'Helados & Copas',
    description: 'Nuestra selección de helados artesanales servidos en cucuruchos y vasitos.',
    items: [
      { name: 'Súper Crema en Cucurucho', price: 2500, image: superCremaImg },
      { name: 'Cookies & Cream', price: 2700, image: cookiesCreamImg },
      { name: 'Vasito Clásico (2 sabores)', price: 2800, image: vasitoClasicoImg },
      { name: 'Vasito Especial con Salsas', price: 3200, image: vasitoEspecialImg },
    ]
  },
  {
    id: 'cafeteria',
    title: 'Cafetería de Especialidad',
    description: 'Cafés de origen recién molidos y delicias para acompañar.',
    items: [
      { name: 'Cappuccino Nerón', price: 2200, image: cappuccinoImg },
      { name: 'Café Espresso Doble', price: 1800, image: cappuccinoImg },
      { name: 'Submarino Clásico', price: 2400, image: cappuccinoImg },
    ]
  },
  {
    id: 'tragos',
    title: 'Tragos & Coctelería',
    description: 'Coctelería fresca con toques de autor y sorbets artesanales.',
    items: [
      { name: 'Aperol Spritz Helado', price: 3800, image: tragoAperolImg },
      { name: 'Gin Tonic Nerón Cítrico', price: 3900, image: tragoAperolImg },
      { name: 'Milkshake Baileys Cream', price: 4200, image: tragoAperolImg },
    ]
  },
  {
    id: 'postres',
    title: 'Postres & Dulces',
    description: 'Tentaciones dulces con helado recién servido.',
    items: [
      { name: 'Copa Brownie Bomba', price: 3600, image: copaBrownieImg },
      { name: 'Tiramisú Tradicional', price: 3400, image: copaBrownieImg },
      { name: 'Volcán de Chocolate', price: 3800, image: vasitoEspecialImg },
    ]
  }
];

