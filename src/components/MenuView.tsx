import React from 'react';
import { Sparkles, Plus, BookOpen } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/flavors';
import { SizeOption, ContainerOption } from '../types';

interface MenuViewProps {
  onAddToCartCustom: (
    title: string,
    size: SizeOption,
    container: ContainerOption,
    toppings: string[],
    price: number
  ) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ onAddToCartCustom }) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="px-1 pt-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <span>Menú Completo</span>
          <BookOpen className="w-5 h-5 text-purple-500" />
        </h1>
        <p className="text-xs text-gray-500">Potes térmicos, copas, batidos y especialidades Neron</p>
      </div>

      <div className="space-y-6">
        {MENU_CATEGORIES.map((category) => (
          <div key={category.id} className="space-y-3">
            <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-100">
              <h2 className="font-extrabold text-base text-gray-900">{category.title}</h2>
              <p className="text-xs text-gray-600">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {category.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-2xl border border-pink-100/80 shadow-sm flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-gray-900 leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <span className="font-extrabold text-pink-600 text-sm mt-1 block">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      onAddToCartCustom(
                        item.name,
                        { id: 'item', name: item.name, scoopsLabel: 'Especial', price: item.price },
                        { id: 'cup', name: 'Envase Especial', iconName: 'CupSoda', extraPrice: 0 },
                        [],
                        item.price
                      )
                    }
                    className="px-3 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pedir</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
