import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fish, Sparkles, Grid, Moon, User, Wifi, 
  Battery, ShoppingBag, Image, Sliders, Power, Gamepad2, ArrowLeft, ArrowRight, Lock
} from 'lucide-react';
import { type GameMetadata, gamesList } from '../data/games';

interface PortalProps {
  onSelectGame: (gameId: string) => void;
}

// Icon mapper for the games
const GameIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case 'Fish':
      return <Fish className={className} />;
    case 'Grid':
      return <Grid className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <Gamepad2 className={className} />;
  }
};

export const Portal: React.FC<PortalProps> = ({ onSelectGame }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [time, setTime] = useState<string>('00:00');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [showSystemPopup, setShowSystemPopup] = useState<string | null>(null);

  // Update time and mock battery
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Get real battery if API is available, otherwise mock
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    } else {
      // Mock battery drift between 85 and 98
      setBatteryLevel(92);
    }

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : gamesList.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < gamesList.length - 1 ? prev + 1 : 0));
  };

  const handleStartGame = (game: GameMetadata) => {
    if (game.isLocked) {
      // System sound/vibration effect could go here
      setShowSystemPopup('準備中です。次のアップデートをお楽しみに！');
      setTimeout(() => setShowSystemPopup(null), 2500);
      return;
    }
    onSelectGame(game.id);
  };

  return (
    <div 
      className="flex flex-col h-full overflow-hidden relative select-none"
      style={{
        background: '#1a1a1b', // Switch home dark theme gray
        color: '#eaeaea'
      }}
    >
      {/* 1. STATUS BAR */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2 z-20 text-xs font-semibold text-neutral-400">
        {/* Left: User Profile Icon & Greeting */}
        <div className="flex items-center gap-2 cursor-pointer active:opacity-75">
          <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white overflow-hidden shadow-md">
            <User className="w-4 h-4" />
          </div>
          <span className="text-[13px] text-neutral-200 font-bold">マイホーム</span>
        </div>

        {/* Right: Network, Battery and Time */}
        <div className="flex items-center gap-3 text-[13px] text-neutral-300">
          <Wifi className="w-4 h-4 text-neutral-400" />
          
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono">{batteryLevel}%</span>
            <div className="relative flex items-center">
              <Battery className="w-5 h-5 text-neutral-400 rotate-0" />
              <div 
                className="absolute left-[3px] top-[6px] h-[6px] rounded-[1px] bg-emerald-400"
                style={{ width: `${(batteryLevel / 100) * 11}px` }}
              />
            </div>
          </div>

          <span className="font-bold ml-1 font-mono">{time}</span>
        </div>
      </div>

      {/* 2. GAME SELECTION CAROUSEL */}
      <div className="flex-grow flex flex-col justify-center items-center relative py-2">
        
        {/* Game Title Display (Switch style: displays above or below cards, here above for balance) */}
        <div className="h-10 flex items-center justify-center mb-4 px-8 text-center">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-xl font-bold tracking-wide text-white">
              {gamesList[selectedIndex].title}
            </h2>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-0.5">
              {gamesList[selectedIndex].category}
            </span>
          </motion.div>
        </div>

        {/* Horizontal Cards View */}
        <div className="w-full overflow-hidden flex justify-center items-center relative py-6 px-4">
          
          {/* Navigation Arrows for accessibility */}
          <button 
            onClick={handlePrev}
            className="absolute left-2 w-8 h-8 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center active:bg-neutral-700 z-30"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>

          {/* Cards container */}
          <div className="flex justify-center items-center gap-4 relative w-[240px] h-[240px]">
            <AnimatePresence mode="popLayout">
              {gamesList.map((game, index) => {
                // Only render selected, previous, and next for screen optimization
                const offset = index - selectedIndex;
                if (Math.abs(offset) > 1) return null;

                return (
                  <motion.div
                    key={game.id}
                    initial={{
                      scale: offset === 0 ? 1.05 : 0.85,
                      x: offset * 180,
                      opacity: offset === 0 ? 1 : 0.4,
                    }}
                    animate={{
                      scale: offset === 0 ? 1.05 : 0.85,
                      x: offset * 190,
                      opacity: offset === 0 ? 1 : 0.4,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                    onClick={() => {
                      if (offset === 0) {
                        handleStartGame(game);
                      } else {
                        setSelectedIndex(index);
                      }
                    }}
                    className={`relative w-[210px] h-[210px] rounded-[4px] cursor-pointer overflow-hidden transition-all flex flex-col justify-between p-4 shadow-xl`}
                    style={{
                      position: 'absolute',
                      zIndex: offset === 0 ? 10 : 5,
                      background: game.coverColor,
                      // White glowing border for focused card
                      boxShadow: offset === 0 
                        ? '0 0 0 5px #eaeaea, 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 255, 255, 0.2)' 
                        : '0 5px 15px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {/* Game cover graphic */}
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <GameIcon name={game.icon} className="w-6 h-6" />
                      </div>
                      
                      {game.isLocked && (
                        <div className="px-2 py-0.5 rounded bg-black/40 text-[9px] font-bold text-neutral-300 flex items-center gap-1 backdrop-blur-sm">
                          <Lock className="w-2.5 h-2.5" /> COMING SOON
                        </div>
                      )}
                    </div>

                    {/* Bottom Title card graphic */}
                    <div className="flex flex-col text-left">
                      <div className="h-[2px] w-6 bg-white/60 mb-2 rounded" />
                      <span className="text-[16px] font-black tracking-tight leading-tight text-white drop-shadow-md">
                        {game.title}
                      </span>
                    </div>

                    {/* Neon grid line aesthetic inside covers */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleNext}
            className="absolute right-2 w-8 h-8 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center active:bg-neutral-700 z-30"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Game description underneath */}
        <div className="h-16 mt-2 max-w-[320px] text-center px-4">
          <p className="text-[12px] text-neutral-400 leading-relaxed">
            {gamesList[selectedIndex].description}
          </p>
        </div>

        {/* Start Game Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStartGame(gamesList[selectedIndex])}
          className="mt-6 px-12 py-3.5 rounded-full font-black text-sm tracking-widest uppercase shadow-lg border border-neutral-700/50 transition-all flex items-center gap-2"
          style={{
            background: gamesList[selectedIndex].isLocked 
              ? 'rgba(255,255,255,0.03)' 
              : 'linear-gradient(135deg, #eaeaea 0%, #d4d4d4 100%)',
            color: gamesList[selectedIndex].isLocked ? '#666' : '#111',
            cursor: gamesList[selectedIndex].isLocked ? 'not-allowed' : 'pointer',
            boxShadow: gamesList[selectedIndex].isLocked 
              ? 'none' 
              : '0 4px 15px rgba(255, 255, 255, 0.05)'
          }}
        >
          {gamesList[selectedIndex].isLocked ? (
            <>準備中</>
          ) : (
            <>あそぶ <Gamepad2 className="w-4 h-4" /></>
          )}
        </motion.button>
      </div>

      {/* 3. SYSTEM ROUND BUTTONS */}
      <div className="px-6 py-6 border-t border-neutral-800 bg-neutral-900/40 z-10">
        <div className="flex justify-around items-center max-w-[380px] mx-auto">
          
          {[
            { id: 'eshop', icon: ShoppingBag, label: 'ショップ' },
            { id: 'album', icon: Image, label: 'アルバム' },
            { id: 'controller', icon: Gamepad2, label: 'コントローラ' },
            { id: 'settings', icon: Sliders, label: '設定' },
            { id: 'power', icon: Power, label: 'スリープ' }
          ].map((btn) => (
            <div key={btn.id} className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowSystemPopup(`${btn.label}機能は現在準備中です。`);
                  setTimeout(() => setShowSystemPopup(null), 2000);
                }}
                className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shadow-md relative overflow-hidden active:bg-neutral-700 group-hover:border-neutral-500 transition-colors"
              >
                <btn.icon className="w-5 h-5 text-neutral-300" />
                <div className="absolute inset-0 bg-white/5 opacity-0 active:opacity-100 transition-opacity" />
              </motion.button>
              <span className="text-[10px] font-bold text-neutral-500 group-hover:text-neutral-300 transition-colors">
                {btn.label}
              </span>
            </div>
          ))}
          
        </div>
      </div>

      {/* SYSTEM POPUP MESSAGE */}
      <AnimatePresence>
        {showSystemPopup && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-28 left-6 right-6 z-50 p-4 rounded-xl border border-neutral-700 shadow-2xl flex items-center justify-center text-center backdrop-blur-md"
            style={{ background: 'rgba(28, 28, 30, 0.95)' }}
          >
            <span className="text-xs font-bold text-neutral-200 tracking-wide">
              {showSystemPopup}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
