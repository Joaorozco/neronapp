import React from 'react';
import { X, MapPin, Clock, Phone, Check, ExternalLink } from 'lucide-react';
import { Branch } from '../types';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  branches,
  selectedBranch,
  onSelectBranch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF4EC] rounded-3xl max-w-md w-full shadow-2xl border border-[#EBE0D0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#EBE0D0] flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#6B1124]/10 text-[#6B1124] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-[#2A1619] tracking-tight">Elegí tu Sucursal</h3>
              <p className="text-xs text-[#7A645D]">Seleccioná el local más cercano para tu pedido</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Branch list */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {branches.map((b) => {
            const isSelected = b.id === selectedBranch.id;
            return (
              <div
                key={b.id}
                onClick={() => {
                  onSelectBranch(b);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#6B1124] bg-white shadow-md ring-2 ring-[#6B1124]/10'
                    : 'border-[#EBE0D0] bg-white/70 hover:bg-white hover:border-[#D9C8B2]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#2A1619]">{b.name}</h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-[#6B1124] text-white text-[10px] font-extrabold uppercase flex items-center gap-1">
                          <Check className="w-3 h-3" /> Actual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A645D] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6B1124]" />
                      {b.address}, {b.city}
                    </p>
                  </div>
                  {b.distance && (
                    <span className="text-xs font-semibold text-[#6B1124] bg-[#6B1124]/10 px-2 py-0.5 rounded-full">
                      {b.distance}
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#7A645D]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{b.hours}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Abierto</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white/60 border-t border-[#EBE0D0] text-center text-xs text-[#7A645D]">
          <span>Retiro en take-away o delivery directo por WhatsApp</span>
        </div>
      </div>
    </div>
  );
};
