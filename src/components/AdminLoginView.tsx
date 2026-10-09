import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NeronLogo } from './NeronLogo';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, setViewMode } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setError(false);

    const success = loginAdmin(password);
    if (!success) {
      setError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF4EC] flex flex-col justify-between py-10 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3E7D5] rounded-full filter blur-3xl opacity-50 -z-0 pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8D7C0] rounded-full filter blur-3xl opacity-40 -z-0 pointer-events-none -translate-x-1/3 translate-y-1/3" />

      {/* Top Bar with Back Link */}
      <div className="max-w-md w-full mx-auto relative z-10 flex items-center justify-between">
        <button
          onClick={() => setViewMode('client')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#7A645D] hover:text-[#2A1619] bg-white/70 hover:bg-white px-3.5 py-2 rounded-full border border-[#EBE0D0] transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la carta</span>
        </button>

        <span className="text-[11px] font-bold text-[#9C867E] uppercase tracking-wider">
          Área Restringida
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto relative z-10 my-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#EBE0D0] text-center">
          {/* Logo & Header */}
          <div className="flex justify-center mb-5">
            <NeronLogo className="h-10 text-[#6B1124]" />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#F6EDE2] text-[#6B1124] flex items-center justify-center mx-auto mb-4 border border-[#E9DAC8] shadow-xs">
            <KeyRound className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-serif font-black text-[#2A1619] tracking-tight">
            Acceso Administrador
          </h1>
          <p className="text-xs text-[#7A645D] mt-1.5 leading-relaxed max-w-xs mx-auto">
            Ingresá tu clave de seguridad para gestionar sabores, productos y datos de la sucursal.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7 text-left space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#4A3B32] mb-1.5 tracking-wider">
                Clave de Seguridad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C867E]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="Escribí la clave..."
                  autoFocus
                  className={`w-full pl-10 pr-11 py-3.5 rounded-2xl bg-[#FAF6F0] border text-sm text-[#2A1619] placeholder-[#A08E87] focus:outline-none focus:bg-white transition ${
                    error
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-[#E0D2C0] focus:ring-2 focus:ring-[#6B1124]/20 focus:border-[#6B1124]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9C867E] hover:text-[#2A1619] transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold mt-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Clave incorrecta. Por favor verificá e intentá nuevamente.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#6B1124] hover:bg-[#520C1B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-md shadow-[#6B1124]/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ingresar al Panel</span>
            </button>
          </form>

          {/* Quick Notice about default password */}
          <div className="mt-6 pt-5 border-t border-[#F0E6D8] text-center">
            <p className="text-[11px] text-[#8C756D]">
              💡 <strong>Nota para el encargado:</strong> La clave inicial por defecto es <code className="bg-[#F4ECE1] px-1.5 py-0.5 rounded text-[#6B1124] font-black font-mono">neron2024</code>.
              Una vez que ingreses, podés cambiarla por la que prefieras.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto relative z-10 text-center">
        <p className="text-[11px] text-[#A08E87]">
          Nerón Gelato & Café • Panel de Gestión de Sucursal
        </p>
      </div>
    </div>
  );
};
