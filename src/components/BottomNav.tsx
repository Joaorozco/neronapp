import React from 'react';
import { Home, BookOpen, ShoppingBag, MapPin, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  cartCount: number;
}

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, cartCount }) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'flavors', label: 'Carta', icon: BookOpen },
    { id: 'menu', label: 'Pedido', icon: ShoppingBag, badge: cartCount },
    { id: 'profile', label: 'Locales', icon: MapPin },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF4EC]/95 backdrop-blur-md border-t border-[#EBE0D0] shadow-lg px-2 py-1.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              id={`nav-tab-${tab.id}`}
              className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#6B1124] font-black'
                  : 'text-[#8C766F] hover:text-[#2A1619] font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-[#EFE4D3] rounded-2xl -z-10 animate-in fade-in zoom-in-95 duration-150" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#6B1124] stroke-[2.5]' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#8A152D] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-[#6B1124] font-black' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
