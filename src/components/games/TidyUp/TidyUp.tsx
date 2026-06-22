import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sparkles, RefreshCw } from 'lucide-react';

interface TidyUpProps {
  onBackToPortal: () => void;
}

interface ToyItem {
  id: string;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  color: string;
  x: number; // initial random position
  y: number; // initial random position
  label: string;
}

interface Tray {
  shape: 'circle' | 'square' | 'triangle' | 'star';
  color: string;
  label: string;
}

const TRAYS: Tray[] = [
  { shape: 'circle', color: 'var(--color-sky)', label: 'まる' },
  { shape: 'square', color: 'var(--color-peach)', label: 'しかく' },
  { shape: 'triangle', color: 'var(--color-mint)', label: 'さんかく' },
  { shape: 'star', color: 'var(--color-lavender)', label: 'ほし' },
];

const COLORS = {
  circle: 'var(--color-sky)',
  square: 'var(--color-peach)',
  triangle: 'var(--color-mint)',
  star: 'var(--color-lavender)',
};

const SHAPES: Array<ToyItem['shape']> = ['circle', 'square', 'triangle', 'star'];

export const TidyUp: React.FC<TidyUpProps> = ({ onBackToPortal }) => {
  const [toys, setToys] = useState<ToyItem[]>([]);
  const [tidiedCount, setTidiedCount] = useState<number>(0);
  const [showSparkle, setShowSparkle] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trayRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const generateToys = () => {
    const newToys: ToyItem[] = [];
    for (let i = 0; i < 5; i++) {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      newToys.push({
        id: `toy-${Date.now()}-${i}-${Math.random()}`,
        shape,
        color: COLORS[shape],
        // Position them in the top half of the screen randomly
        x: 40 + Math.random() * 200,
        y: 80 + Math.random() * 100,
        label: shape === 'circle' ? '●' : shape === 'square' ? '■' : shape === 'triangle' ? '▲' : '★',
      });
    }
    setToys(newToys);
  };

  useEffect(() => {
    generateToys();
  }, []);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: any,
    toy: ToyItem
  ) => {
    // Check collision with the target tray
    const shape = toy.shape;
    const trayElement = trayRefs.current[shape];
    if (!trayElement) return;

    const trayRect = trayElement.getBoundingClientRect();
    const pointX = info.point.x;
    const pointY = info.point.y;

    // Check if drop point is within the tray bounding box
    if (
      pointX >= trayRect.left &&
      pointX <= trayRect.right &&
      pointY >= trayRect.top &&
      pointY <= trayRect.bottom
    ) {
      // Correct tray! Remove toy and animate sparkle
      setToys((prev) => prev.filter((t) => t.id !== toy.id));
      setTidiedCount((prev) => prev + 1);
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 800);
    }
  };

  // When all toys are tidied, wait a bit and spawn next batch
  useEffect(() => {
    if (toys.length === 0 && tidiedCount > 0) {
      const timer = setTimeout(() => {
        generateToys();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [toys, tidiedCount]);

  const resetGame = () => {
    setTidiedCount(0);
    generateToys();
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col h-full overflow-hidden p-6"
      style={{
        background: 'linear-gradient(180deg, #1e1b4b 0%, #111827 100%)',
      }}
    >
      {/* Top Header UI */}
      <div className="flex justify-between items-center z-20 mb-6">
        <button
          onClick={onBackToPortal}
          className="ui-button tap-button p-3"
          style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="glass-panel px-4 py-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse-soft" />
          <span className="text-sm font-bold text-emerald-200">
            お片付けした数: {tidiedCount}
          </span>
        </div>

        <button
          onClick={resetGame}
          className="ui-button tap-button p-3"
          style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-base font-medium text-slate-300">
          ブロックを同じ形のカゴにいれよう
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          ひとつずつ、ゆっくりと
        </p>
      </div>

      {/* Main Play Area */}
      <div className="flex-grow relative border border-white/5 rounded-3xl bg-white/[0.01] overflow-hidden mb-6">
        {/* Sparkle overlay when item placed successfully */}
        <AnimatePresence>
          {showSparkle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              style={{ background: 'rgba(52, 211, 153, 0.05)' }}
            >
              <div className="flex flex-col items-center gap-1">
                <Sparkles className="w-12 h-12 text-emerald-300 animate-bounce" />
                <span className="text-xs font-bold text-emerald-300 tracking-wide">すっきり！</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toys to be tidied */}
        <div className="absolute inset-0 z-20">
          <AnimatePresence>
            {toys.map((toy) => (
              <motion.div
                key={toy.id}
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={(e, info) => handleDragEnd(e, info, toy)}
                whileDrag={{ scale: 1.15, zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}
                initial={{ opacity: 0, scale: 0.5, x: toy.x, y: toy.y }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.3 } }}
                className="absolute w-14 h-14 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing font-bold text-xl select-none"
                style={{
                  backgroundColor: toy.color,
                  boxShadow: `0 4px 12px ${toy.color}33`,
                  border: '2px solid rgba(255,255,255,0.2)',
                  color: '#111827',
                  touchAction: 'none', // Critical for mobile dragging
                }}
              >
                {/* Visual rendering according to shapes */}
                {toy.shape === 'circle' && <div className="w-8 h-8 rounded-full border-2 border-[#111827]" />}
                {toy.shape === 'square' && <div className="w-7 h-7 border-2 border-[#111827]" />}
                {toy.shape === 'triangle' && (
                  <div 
                    className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] relative"
                    style={{ borderBottomColor: '#111827' }}
                  >
                    <div 
                      className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] absolute -left-[10px] top-[4px]"
                      style={{ borderBottomColor: toy.color }}
                    />
                  </div>
                )}
                {toy.shape === 'star' && <span className="text-2xl leading-none">★</span>}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* All cleared greeting */}
          {toys.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <p className="text-base font-bold text-emerald-300">
                お部屋がきれいになりました
              </p>
              <p className="text-xs text-slate-400 mt-2">
                もう少し、お片付けを続けますか？
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trays at the Bottom */}
      <div className="grid grid-cols-4 gap-3 mt-auto mb-4 z-10">
        {TRAYS.map((tray) => (
          <div
            key={tray.shape}
            ref={(el) => {
              trayRefs.current[tray.shape] = el;
            }}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderColor: `${tray.color}33`,
              boxShadow: `inset 0 0 15px ${tray.color}11`,
            }}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: `${tray.color}1a`,
                border: `2px dashed ${tray.color}`,
                color: tray.color
              }}
            >
              {tray.shape === 'circle' && '●'}
              {tray.shape === 'square' && '■'}
              {tray.shape === 'triangle' && '▲'}
              {tray.shape === 'star' && '★'}
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>
              {tray.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
