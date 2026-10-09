import React, { useState } from 'react';
import { Award, Gift, Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardsView: React.FC = () => {
  const [points, setPoints] = useState(280);
  const [spun, setSpun] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const prizes = [
    '2x1 en Cucuruchos',
    '$3.00 OFF en tu Pedido',
    'Topping Gratis',
    '15% OFF en 1 Kilo',
    'Envío Gratis',
  ];

  const handleSpinWheel = () => {
    if (spun) return;
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    setWonPrize(randomPrize);
    setSpun(true);
    setPoints(points + 50);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleRedeem = (rewardId: string, cost: number, rewardName: string) => {
    if (points >= cost && !claimedRewards.includes(rewardId)) {
      setPoints(points - cost);
      setClaimedRewards([...claimedRewards, rewardId]);

      confetti({
        particleCount: 60,
        spread: 50,
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Club Header */}
      <div className="bg-gradient-to-r from-amber-500 via-pink-600 to-rose-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-300" /> CLUB NERON VIP
            </span>
            <h1 className="text-2xl font-black mt-1">Puntos Neron</h1>
            <p className="text-xs text-pink-100">Gana puntos en cada compra y canjéalos por helado gratis.</p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/20">
            <span className="block text-2xl font-black text-amber-300">{points}</span>
            <span className="text-[10px] uppercase font-bold text-pink-100">Puntos</span>
          </div>
        </div>

        {/* Progress Bar towards next reward */}
        <div className="mt-4 pt-4 border-t border-white/20 space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span>Progreso hacia 1/4 Kg Gratis (350 Pts)</span>
            <span>{points}/350</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (points / 350) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Spin / Mystery Gift */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> RECOMPENSA DIARIA
        </div>

        <h2 className="text-lg font-black text-gray-900">Premio Sorpresa Neron</h2>
        <p className="text-xs text-gray-500">Toca el botón para probar tu suerte y ganar cupones diarios.</p>

        {!spun ? (
          <button
            onClick={handleSpinWheel}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 text-white font-extrabold text-sm shadow-md hover:opacity-95 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            <span>Probar Suerte & Ganar Puntos</span>
          </button>
        ) : (
          <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200 text-center animate-in zoom-in-95">
            <span className="text-2xl block mb-1">🎁</span>
            <h3 className="font-extrabold text-pink-700 text-base">¡Ganaste: {wonPrize}!</h3>
            <p className="text-xs text-gray-600 mt-1">Se han acreditado +50 Puntos bonus a tu cuenta. Código: <strong>NERONPROMO</strong></p>
          </div>
        )}
      </div>

      {/* Redeemable Rewards List */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Ticket className="w-5 h-5 text-pink-600" /> Canjear Puntos
        </h2>

        <div className="space-y-2.5">
          {[
            { id: 'reward_1', name: 'Cupón 20% OFF en todo tu Pedido', cost: 150, icon: '🏷️' },
            { id: 'reward_2', name: 'Cucurucho Especial con Topping Gratis', cost: 200, icon: '🍦' },
            { id: 'reward_3', name: '1/4 Kilo de Helado Gratis', cost: 350, icon: '🍨' },
            { id: 'reward_4', name: 'Envío Gratis Ilimitado por 1 Mes', cost: 500, icon: '🛵' },
          ].map((reward) => {
            const isClaimed = claimedRewards.includes(reward.id);
            const canAfford = points >= reward.cost;

            return (
              <div
                key={reward.id}
                className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-xs text-gray-900">{reward.name}</h3>
                    <span className="text-xs font-bold text-amber-600">{reward.cost} Puntos</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeem(reward.id, reward.cost, reward.name)}
                  disabled={!canAfford || isClaimed}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isClaimed
                      ? 'bg-emerald-100 text-emerald-800'
                      : canAfford
                      ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isClaimed ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Canjeado
                    </span>
                  ) : (
                    'Canjear'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
