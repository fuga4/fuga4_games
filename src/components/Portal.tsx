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

// Icon mapper for the games (fallback if cover image fails)
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
      setBatteryLevel(94);
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
      setShowSystemPopup('このゲームは準備中です。次のアップデートをお楽しみに！');
      setTimeout(() => setShowSystemPopup(null), 2500);
      return;
    }
    onSelectGame(game.id);
  };

  return (
    <div 
      className="flex flex-col h-full overflow-hidden relative select-none w-full max-w-[480px] mx-auto"
      style={{
        background: '#2d2d2d', // Switch OS Home Dark background
        color: '#eaeaea',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* 1. STATUS BAR */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2 z-20 text-xs font-bold text-neutral-400">
        {/* Left: User Profile Icon & Greeting (Nintendo Switch style Mii circle) */}
        <div className="flex items-center gap-2 cursor-pointer active:opacity-85">
          <div className="w-8 h-8 rounded-full bg-sky-500 border-[2.5px] border-neutral-300 flex items-center justify-center text-white overflow-hidden shadow-md relative">
            <User className="w-4 h-4 text-white" />
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-neutral-800" />
          </div>
          <span className="text-[13px] text-neutral-200 font-bold tracking-tight">ユーザー1</span>
        </div>

        {/* Right: Network, Battery and Time */}
        <div className="flex items-center gap-3.5 text-[13px] text-neutral-300">
          <Wifi className="w-4 h-4 text-neutral-400" />
          
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold font-mono">{batteryLevel}%</span>
            <div className="relative flex items-center">
              <Battery className="w-5 h-5 text-neutral-400 rotate-0" />
              <div 
                className="absolute left-[3px] top-[6.5px] h-[5px] rounded-[1px] bg-neutral-200"
                style={{ width: `${(batteryLevel / 100) * 11}px` }}
              />
            </div>
          </div>

          <span className="font-bold ml-1 font-mono tracking-tighter">{time}</span>
        </div>
      </div>

      {/* 2. GAME SELECTION CAROUSEL ZONE */}
      <div 
        className="flex-grow flex flex-col justify-center items-center relative py-4"
        style={{
          background: '#1f1f1f', // Distinct dark panel for the game slot in Switch UI
          borderTop: '2.5px solid #323232',
          borderBottom: '2.5px solid #323232',
          boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.4), inset 0 -10px 30px rgba(0,0,0,0.4)'
        }}
      >
        {/* Horizontal Cards View */}
        <div className="w-full overflow-hidden flex justify-center items-center relative py-6 px-4">
          
          {/* Navigation Arrows for accessibility */}
          <button 
            onClick={handlePrev}
            className="absolute left-3 w-9 h-9 rounded-full bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center active:bg-neutral-700 z-30 transition-transform active:scale-90"
            style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>

          {/* Cards container */}
          <div className="flex justify-center items-center gap-4 relative w-[240px] h-[240px]">
            <AnimatePresence mode="popLayout">
              {gamesList.map((game, index) => {
                const offset = index - selectedIndex;
                // Render selected card and immediately adjacent cards
                if (Math.abs(offset) > 1) return null;

                const coverUrl = `${import.meta.env.BASE_URL}${game.coverImage}`;

                return (
                  <motion.div
                    key={game.id}
                    initial={{
                      scale: offset === 0 ? 1.05 : 0.85,
                      x: offset * 180,
                      opacity: offset === 0 ? 1 : 0.35,
                    }}
                    animate={{
                      scale: offset === 0 ? 1.05 : 0.85,
                      x: offset * 195,
                      opacity: offset === 0 ? 1 : 0.35,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 24,
                    }}
                    onClick={() => {
                      if (offset === 0) {
                        handleStartGame(game);
                      } else {
                        setSelectedIndex(index);
                      }
                    }}
                    className={`relative w-[210px] h-[210px] rounded-[4px] cursor-pointer overflow-hidden transition-all flex flex-col justify-between p-4`}
                    style={{
                      backgroundImage: `url(${coverUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#323232', // Fallback
                      // Switch authentic double glowing border for focused card (White inner border, cyan neon outer glow)
                      boxShadow: offset === 0 
                        ? '0 0 0 4px #ffffff, 0 0 0 8px #00c3e3, 0 15px 35px rgba(0, 0, 0, 0.75)' 
                        : '0 8px 20px rgba(0, 0, 0, 0.55)',
                    }}
                  >
                    {/* Upper overlay metadata */}
                    <div className="flex justify-between items-start z-10">
                      <div className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                        <GameIcon name={game.icon} className="w-5 h-5" />
                      </div>
                      
                      {game.isLocked && (
                        <div className="px-2 py-0.5 rounded bg-black/70 text-[9px] font-bold text-neutral-300 flex items-center gap-1 backdrop-blur-sm border border-white/5">
                          <Lock className="w-2.5 h-2.5 text-neutral-400" /> 準備中
                        </div>
                      )}
                    </div>

                    {/* Dark gradient overlay for text readability over custom cover art */}
                    <div 
                      className="absolute inset-0 pointer-events-none z-0" 
                      style={{ 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)' 
                      }} 
                    />

                    {/* Bottom Title card graphic */}
                    <div className="flex flex-col text-left z-10">
                      <div className="h-[2px] w-6 bg-white/60 mb-2 rounded" />
                      <span className="text-[17px] font-black tracking-tight leading-tight text-white drop-shadow-md">
                        {game.title}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleNext}
            className="absolute right-3 w-9 h-9 rounded-full bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center active:bg-neutral-700 z-30 transition-transform active:scale-90"
            style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Selected Game Title & Description underneath (Genuine Switch UI Style) */}
        <div className="mt-4 flex flex-col items-center justify-center text-center px-10 h-20">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-xl font-bold tracking-wide text-white leading-none">
              {gamesList[selectedIndex].title}
            </h2>
            <p className="text-[11px] text-neutral-400 mt-2.5 max-w-[320px] leading-relaxed">
              {gamesList[selectedIndex].description}
            </p>
          </motion.div>
        </div>

        {/* Start Game Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStartGame(gamesList[selectedIndex])}
          className="mt-4 px-12 py-3.5 rounded-full font-black text-sm tracking-widest uppercase shadow-lg border border-neutral-700/50 transition-all flex items-center gap-2"
          style={{
            background: gamesList[selectedIndex].isLocked 
              ? 'rgba(255,255,255,0.02)' 
              : 'linear-gradient(135deg, #eaeaea 0%, #d4d4d4 100%)',
            color: gamesList[selectedIndex].isLocked ? '#555' : '#111',
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

      {/* 3. SYSTEM ROUND BUTTONS (Genuine Switch Bottom Section) */}
      <div 
        className="px-6 py-5 z-10"
        style={{
          background: '#2d2d2d',
          borderTop: '1px solid #3c3c3c' // Subtle top border like the Switch UI
        }}
      >
        <div className="flex justify-around items-center max-w-[380px] mx-auto">
          
          {[
            { id: 'eshop', icon: ShoppingBag, label: 'ショップ' },
            { id: 'album', icon: Image, label: 'アルバム' },
            { id: 'controller', icon: Gamepad2, label: 'コントローラ' },
            { id: 'settings', icon: Sliders, label: '設定' },
            { id: 'power', icon: Power, label: 'スリープ' }
          ].map((btn) => (
            <div key={btn.id} className="flex flex-col items-center gap-1 group cursor-pointer">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setShowSystemPopup(`${btn.label}機能は現在準備中です。`);
                  setTimeout(() => setShowSystemPopup(null), 2000);
                }}
                className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shadow-md relative overflow-hidden group-hover:border-neutral-500 transition-colors"
                style={{
                  background: '#323232',
                  borderColor: '#464646'
                }}
              >
                <btn.icon className="w-4.5 h-4.5 text-neutral-300" />
                <div className="absolute inset-0 bg-white/5 opacity-0 active:opacity-100 transition-opacity" />
              </motion.button>
              <span className="text-[10px] font-extrabold text-neutral-400 group-hover:text-neutral-200 transition-colors">
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
