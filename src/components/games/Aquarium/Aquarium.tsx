import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Fish, Sparkles, Heart, Award } from 'lucide-react';

interface AquariumProps {
  onBackToPortal: () => void;
}

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface FishInstance {
  id: string;
  type: 'yellow' | 'jelly' | 'turtle' | 'ray';
  name: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  depth: number;
}

const FISH_TYPES = {
  yellow: { name: 'きいろい魚', cost: 15, color: '#facc15', size: 24 },
  jelly: { name: 'ふわりクラゲ', cost: 40, color: '#c084fc', size: 30 },
  turtle: { name: 'のんびりウミガメ', cost: 100, color: '#34d399', size: 40 },
  ray: { name: 'おおらかなエイ', cost: 250, color: '#38bdf8', size: 50 },
};

export const Aquarium: React.FC<AquariumProps> = ({ onBackToPortal }) => {
  const [points, setPoints] = useState<number>(0);
  const [fishes, setFishes] = useState<FishInstance[]>([]);
  const [effects, setEffects] = useState<ClickEffect[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-generate points from fishes
  useEffect(() => {
    const timer = setInterval(() => {
      if (fishes.length === 0) return;
      const pointsToAdd = fishes.reduce((acc, fish) => {
        const value = fish.type === 'yellow' ? 1 : fish.type === 'jelly' ? 2 : fish.type === 'turtle' ? 5 : 10;
        return acc + value;
      }, 0);
      setPoints((prev) => prev + pointsToAdd);
    }, 3000);

    return () => clearInterval(timer);
  }, [fishes]);

  // Handle clicking on aquarium container to earn points
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid double triggering if clicking on UI buttons
    if ((e.target as HTMLElement).closest('.ui-button')) return;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const value = 1 + Math.floor(fishes.length * 0.5); // Earn more click value with more fish
    setPoints((prev) => prev + value);

    const newEffect: ClickEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
      value,
    };
    setEffects((prev) => [...prev, newEffect]);

    // Remove effect after 1 second
    setTimeout(() => {
      setEffects((prev) => prev.filter((eff) => eff.id !== newEffect.id));
    }, 1000);
  };

  const buyFish = (type: keyof typeof FISH_TYPES) => {
    const fishConfig = FISH_TYPES[type];
    if (points < fishConfig.cost) return;

    setPoints((prev) => prev - fishConfig.cost);

    const newFish: FishInstance = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      name: fishConfig.name,
      x: 10 + Math.random() * 80, // percentage x
      y: 20 + Math.random() * 60, // percentage y
      size: fishConfig.size,
      speed: 15 + Math.random() * 20, // animation duration
      depth: Math.floor(Math.random() * 3), // z-index grouping
    };

    setFishes((prev) => [...prev, newFish]);
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #0369a1 60%, #0c4a6e 100%)',
        cursor: 'pointer'
      }}
    >
      {/* Floating Bubbles Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/20 bg-white/5"
            style={{
              width: `${5 + Math.random() * 15}px`,
              height: `${5 + Math.random() * 15}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-20px`,
            }}
            animate={{
              y: -800,
              x: [0, (Math.random() - 0.5) * 40, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Floating Seaweed */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none flex justify-around items-end z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 rounded-t-full origin-bottom"
            style={{
              height: `${40 + Math.random() * 50}px`,
              background: 'linear-gradient(0deg, #065f46 0%, #047857 100%)',
              opacity: 0.7,
            }}
            animate={{
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Top Header UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
        <button
          onClick={onBackToPortal}
          className="ui-button tap-button pointer-events-auto p-3"
          style={{ background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <Home className="w-5 h-5" />
        </button>

        <div 
          className="glass-panel px-4 py-2 flex items-center gap-2 pointer-events-auto"
          style={{ background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse-soft" />
          <span className="text-sm font-bold text-amber-200">
            しずく: {points}
          </span>
        </div>
      </div>

      {/* Click Particles Effect */}
      <AnimatePresence>
        {effects.map((eff) => (
          <motion.div
            key={eff.id}
            initial={{ opacity: 1, scale: 0.8, y: eff.y, x: eff.x }}
            animate={{ opacity: 0, scale: 1.5, y: eff.y - 60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute pointer-events-none flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className="flex items-center gap-0.5">
              <span className="text-white text-xs font-bold font-mono">+{eff.value}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div className="w-3 h-3 rounded-full border border-white/50 bg-white/20 mt-1 animate-ping" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Fishes swimming */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {fishes.map((fish) => {
          const isLeftToRight = parseInt(fish.id.split('-')[2]) % 2 === 0;
          return (
            <motion.div
              key={fish.id}
              className="absolute pointer-events-auto cursor-help"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                zIndex: fish.depth + 10,
              }}
              animate={{
                x: isLeftToRight ? [-100, 500, -100] : [100, -500, 100],
                y: [0, -20, 20, -10, 0],
              }}
              transition={{
                x: {
                  duration: fish.speed,
                  repeat: Infinity,
                  ease: 'linear',
                },
                y: {
                  duration: fish.speed / 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              }}
            >
              {/* Fish visual styling */}
              <motion.div 
                className="relative flex items-center justify-center"
                style={{ 
                  width: fish.size, 
                  height: fish.size, 
                  color: FISH_TYPES[fish.type].color,
                  transform: isLeftToRight ? 'scaleX(1)' : 'scaleX(-1)'
                }}
                whileTap={{ scale: 1.2, rotate: [0, -15, 15, 0] }}
              >
                {fish.type === 'yellow' && <Fish className="w-full h-full" />}
                {fish.type === 'jelly' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-start">
                    <div className="w-5/6 h-3/6 rounded-t-full opacity-80" style={{ backgroundColor: FISH_TYPES.jelly.color }} />
                    <div className="flex gap-1 -mt-0.5 justify-center">
                      {[...Array(3)].map((_, idx) => (
                        <motion.div
                          key={idx}
                          className="w-1 h-4 rounded-full opacity-60"
                          style={{ backgroundColor: FISH_TYPES.jelly.color }}
                          animate={{ height: [12, 18, 12] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {fish.type === 'turtle' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Turtle Shell */}
                    <div className="w-8 h-6 rounded-full border border-black/10 flex items-center justify-center opacity-90" style={{ backgroundColor: '#059669' }}>
                      <div className="w-1.5 h-2.5 rounded-full absolute -right-1" style={{ backgroundColor: '#34d399' }} /> {/* head */}
                      <div className="w-1.5 h-1.5 rounded-full absolute -top-1" style={{ backgroundColor: '#34d399' }} /> {/* flipper */}
                      <div className="w-1.5 h-1.5 rounded-full absolute -bottom-1" style={{ backgroundColor: '#34d399' }} /> {/* flipper */}
                    </div>
                  </div>
                )}
                {fish.type === 'ray' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Ray Body */}
                    <div className="w-10 h-7 rounded-full opacity-80 flex items-center justify-end" style={{ backgroundColor: '#0284c7' }}>
                      <div className="w-6 h-0.5 absolute -left-2" style={{ backgroundColor: '#0284c7' }} /> {/* tail */}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Buy UI Shop */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col gap-2">
        <div className="text-[10px] text-center text-sky-200/60 font-medium">
          画面をタップして「しずく」を集め、生き物をむかえましょう
        </div>
        <div className="glass-panel p-3.5 pointer-events-auto flex justify-between gap-2 overflow-x-auto" style={{ background: 'rgba(15, 23, 42, 0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
          {(Object.keys(FISH_TYPES) as Array<keyof typeof FISH_TYPES>).map((type) => {
            const config = FISH_TYPES[type];
            const canBuy = points >= config.cost;

            return (
              <button
                key={type}
                onClick={() => buyFish(type)}
                disabled={!canBuy}
                className="ui-button flex-1 flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center min-w-[70px]"
                style={{
                  background: canBuy ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  borderColor: canBuy ? config.color : 'rgba(255,255,255,0.05)',
                  opacity: canBuy ? 1 : 0.5,
                }}
              >
                <div className="p-1 rounded-lg mb-1" style={{ color: config.color }}>
                  {type === 'yellow' && <Fish className="w-5 h-5" />}
                  {type === 'jelly' && <Sparkles className="w-5 h-5" />}
                  {type === 'turtle' && <Award className="w-5 h-5" />}
                  {type === 'ray' && <Heart className="w-5 h-5" />}
                </div>
                <span className="text-[9px] font-bold text-slate-200 block truncate max-w-full">
                  {config.name}
                </span>
                <span className="text-[10px] font-mono font-bold mt-0.5 text-amber-300">
                  {config.cost}💧
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
