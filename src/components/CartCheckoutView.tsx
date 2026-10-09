import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, ShieldCheck, CheckCircle2, MapPin, CreditCard, Clock, Truck, Sparkles, AlertCircle, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, TabType } from '../types';
import { useStore } from '../context/StoreContext';

interface CartCheckoutViewProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  setActiveTab,
}) => {
  const [step, setStep] = useState<'cart' | 'delivery' | 'payment' | 'confirmation'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Delivery & Payment details
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const { selectedBranch } = useStore();
  const [address, setAddress] = useState('Av. Santa Fe 2450, Piso 4B, CABA');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mercadopago' | 'cash'>('mercadopago');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = deliveryType === 'delivery' ? (subtotal >= 10000 || couponApplied ? 0 : 800) : 0;
  const tax = 0; // Precios ya incluyen IVA en Argentina
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const buildWhatsAppOrderUrl = () => {
    const itemsText = cart
      .map((i) => `• ${i.quantity}x ${i.flavorName} ($${i.totalPrice.toLocaleString('es-AR')})`)
      .join('\n');
    const paymentLabel =
      paymentMethod === 'mercadopago'
        ? 'Mercado Pago / Transferencia'
        : paymentMethod === 'card'
        ? 'Tarjeta de Débito/Crédito'
        : 'Efectivo contra entrega';

    const modalText =
      deliveryType === 'delivery'
        ? `🛵 Envío a domicilio: ${address}`
        : `🏪 Retiro en sucursal: ${selectedBranch.name} (${selectedBranch.address})`;

    let text = `¡Hola Nerón (${selectedBranch.name})! 🍦\nQuiero confirmar el siguiente pedido:\n\n${itemsText}\n\n*Total a pagar: $ ${total.toLocaleString('es-AR')}*\n\n📍 ${modalText}\n💳 Forma de pago: ${paymentLabel}${
      notes ? `\n📝 Aclaraciones: ${notes}` : ''
    }\n\n¡Muchas gracias!`;

    return `https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'NERON10') {
      const discount = Math.round(subtotal * 0.10);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else if (code === 'HELADO2X1' || code === 'ENVIOFREE') {
      setDiscountAmount(800);
      setCouponApplied(true);
    } else {
      setCouponError('Cupón no válido. Intenta con NERON10 o ENVIOFREE');
    }
  };

  const handleCompleteOrder = () => {
    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EC4899', '#3D101E', '#009BBF', '#F59E0B'],
    });

    const newOrder: Order = {
      id: `NERON-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: discountAmount,
      tax,
      total,
      status: 'preparing',
      address: deliveryType === 'delivery' ? address : 'Retiro en Local - Av. Corrientes 1420',
      paymentMethod:
        paymentMethod === 'card'
          ? 'Tarjeta de Crédito'
          : paymentMethod === 'mercadopago'
          ? 'Mercado Pago'
          : 'Efectivo contra entrega',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: 25,
    };

    setCompletedOrder(newOrder);
    setStep('confirmation');
    onClearCart();
  };

  // Render Order Confirmed View
  if (step === 'confirmation' && completedOrder) {
    return (
      <div className="space-y-6 pb-20 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-md animate-bounce">
            🎉
          </div>

          <div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              ¡PEDIDO CONFIRMADO!
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-2">¡Gracias por tu pedido!</h2>
            <p className="text-xs text-gray-500">Orden #{completedOrder.id}</p>
          </div>

          {/* Delivery Tracker Status */}
          <div className="bg-pink-50 p-4 rounded-2xl text-left space-y-3 border border-pink-100">
            <div className="flex items-center justify-between text-xs font-extrabold text-pink-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-pink-600" /> Tiempo estimado
              </span>
              <span className="bg-pink-600 text-white px-2.5 py-0.5 rounded-full">
                ~{completedOrder.estimatedMinutes} minutos
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-pink-200 h-2 rounded-full overflow-hidden">
                <div className="bg-pink-600 h-full w-1/3 animate-pulse" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                <span className="text-pink-600">Preparando helado</span>
                <span>En camino</span>
                <span>Entregado</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 pt-2 border-t border-pink-100/80 space-y-1">
              <p>
                <strong className="text-gray-900">Sucursal:</strong> {selectedBranch.name} ({selectedBranch.address})
              </p>
              <p>
                <strong className="text-gray-900">Modalidad:</strong> {completedOrder.address}
              </p>
              <p>
                <strong className="text-gray-900">Método de Pago:</strong> {completedOrder.paymentMethod}
              </p>
              <p>
                <strong className="text-gray-900">Monto Total:</strong> ${completedOrder.total.toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={buildWhatsAppOrderUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-full bg-[#1E8A3C] hover:bg-[#187532] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1E8A3C]/25 transition active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Enviar Detalle a WhatsApp de la Sucursal</span>
            </a>

            <button
              onClick={() => setActiveTab('home')}
              className="w-full py-3 rounded-full bg-[#6B1124] hover:bg-[#520C1B] text-white font-bold text-sm shadow-md transition"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => setActiveTab('flavors')}
              className="w-full py-3 rounded-full bg-white border border-[#EBE0D0] text-[#6B1124] font-bold text-sm hover:bg-[#FAF4EC] transition"
            >
              Pedir Más Sabores
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Empty Cart
  if (cart.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-pink-100 p-6 space-y-4 shadow-sm pb-20">
        <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛒
        </div>
        <h2 className="text-xl font-black text-gray-900">Tu Carrito está Vacío</h2>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          ¿Todavía no has elegido tu helado Neron? Explora nuestras deliciosas opciones artesanalmente preparadas.
        </p>
        <button
          onClick={() => setActiveTab('flavors')}
          className="px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 mx-auto"
        >
          <span>Explorar Catálogo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Step Header Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout</h1>
        <button
          onClick={onClearCart}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Vaciar
        </button>
      </div>

      {/* Progress Bar (Matching Screen 4 mockup: Cart -> Delivery -> Payment -> Review) */}
      <div className="bg-white p-3 rounded-2xl border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <button
            onClick={() => setStep('cart')}
            className={`flex flex-col items-center gap-1 ${
              step === 'cart' ? 'text-pink-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step === 'cart' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              1
            </div>
            <span>Carrito</span>
          </button>

          <div className="h-0.5 flex-1 bg-pink-100 mx-1" />

          <button
            onClick={() => setStep('delivery')}
            className={`flex flex-col items-center gap-1 ${
              step === 'delivery' ? 'text-pink-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step === 'delivery' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              2
            </div>
            <span>Entrega</span>
          </button>

          <div className="h-0.5 flex-1 bg-pink-100 mx-1" />

          <button
            onClick={() => setStep('payment')}
            className={`flex flex-col items-center gap-1 ${
              step === 'payment' ? 'text-pink-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step === 'payment' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              3
            </div>
            <span>Pago</span>
          </button>
        </div>
      </div>

      {/* STEP 1: CART ITEMS REVIEW */}
      {step === 'cart' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-extrabold text-sm text-gray-900">Tu Pedido ({cart.length})</h3>
              <button
                onClick={() => setActiveTab('flavors')}
                className="text-xs text-pink-600 hover:underline font-bold"
              >
                + Agregar Más
              </button>
            </div>

            {/* Cart Item Cards */}
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-pink-50 shrink-0">
                    <img
                      src={item.flavorImage}
                      alt={item.flavorName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-gray-900 leading-tight line-clamp-1">
                      {item.flavorName}
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      {item.size.name} • {item.container.name}
                    </p>
                    {item.toppings.length > 0 && (
                      <p className="text-[9px] text-pink-600 font-medium line-clamp-1">
                        + {item.toppings.join(', ')}
                      </p>
                    )}
                    <span className="font-black text-pink-600 text-xs mt-0.5 block">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-pink-50 p-1 rounded-full border border-pink-100 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-white text-pink-600 flex items-center justify-center font-bold text-xs shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs text-gray-800 w-3 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Form */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs space-y-2">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-pink-600" /> ¿Tienes un Cupón de Descuento?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Ej. NERON10"
                className="flex-1 px-3 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Aplicar
              </button>
            </div>

            {couponApplied && (
              <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Cupón aplicado correctamente! Descuento de ${discountAmount.toFixed(2)}
              </p>
            )}

            {couponError && (
              <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {couponError}
              </p>
            )}
          </div>

          {/* Order Summary breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Costo de Envío</span>
              <span className="font-bold text-emerald-600">
                {deliveryFee === 0 ? '¡GRATIS!' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Impuestos & Tasas</span>
              <span className="font-bold text-gray-800">${tax.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Descuento Cupón</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-black text-gray-900">
              <span>Total a Pagar</span>
              <span className="text-xl text-pink-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setStep('delivery')}
            className="w-full py-3.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition"
          >
            <span>Continuar a la Entrega</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: DELIVERY ADDRESS & TYPE */}
      {step === 'delivery' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">
              Opción de Entrega
            </h3>

            {/* Toggle Delivery vs Pickup */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeliveryType('delivery')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  deliveryType === 'delivery'
                    ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-xs'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <Truck className="w-5 h-5 text-pink-600" />
                <span>Envío a Domicilio</span>
              </button>

              <button
                onClick={() => setDeliveryType('pickup')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  deliveryType === 'pickup'
                    ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-xs'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <MapPin className="w-5 h-5 text-pink-600" />
                <span>Retiro en Local</span>
              </button>
            </div>

            {deliveryType === 'delivery' ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-800">Dirección de Envío</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-pink-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <label className="text-xs font-bold text-gray-800 block">Aclaraciones (Opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Timbre B, dejar con el portero, sin servilletas..."
                  className="w-full p-3 bg-pink-50/40 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={2}
                />
              </div>
            ) : (
              <div className="p-3 bg-pink-50 rounded-xl space-y-1 text-xs text-gray-700">
                <p className="font-bold text-gray-900">Sucursal de Retiro:</p>
                <p>Neron Central - Av. Corrientes 1420, CABA</p>
                <p className="text-pink-600 font-bold mt-1">Listo para retirar en 15 minutos.</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep('cart')}
              className="w-1/3 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
            >
              Volver
            </button>
            <button
              onClick={() => setStep('payment')}
              className="w-2/3 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>Ir al Pago (${total.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT METHOD */}
      {step === 'payment' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">
              Selecciona Método de Pago
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod('mercadopago')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  paymentMethod === 'mercadopago'
                    ? 'border-pink-600 bg-pink-50/80 ring-2 ring-pink-500/20'
                    : 'border-gray-200'
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <span className="text-lg">💙</span> Mercado Pago / Dinero en Cuenta
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                  INSTANTÁNEO
                </span>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  paymentMethod === 'card'
                    ? 'border-pink-600 bg-pink-50/80 ring-2 ring-pink-500/20'
                    : 'border-gray-200'
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <CreditCard className="w-4 h-4 text-pink-600" /> Tarjeta de Crédito / Débito
                </span>
                <span className="text-[10px] text-gray-500">Hasta 3 cuotas</span>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  paymentMethod === 'cash'
                    ? 'border-pink-600 bg-pink-50/80 ring-2 ring-pink-500/20'
                    : 'border-gray-200'
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <span className="text-lg">💵</span> Efectivo contra entrega
                </span>
                <span className="text-[10px] text-gray-500">Pagas al recibir</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs space-y-1 text-xs">
            <div className="flex justify-between font-black text-gray-900 text-sm">
              <span>Total Final</span>
              <span className="text-pink-600 text-lg">${total.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-gray-400">Incluye todos los impuestos y promociones aplicadas.</p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Checkout Seguro y Cifrado</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep('delivery')}
              className="w-1/3 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
            >
              Volver
            </button>
            <button
              onClick={handleCompleteOrder}
              className="w-2/3 py-3.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 transition active:scale-95"
            >
              Confirmar & Pedir (${total.toFixed(2)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
