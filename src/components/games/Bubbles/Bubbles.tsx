import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

interface BubblesProps {
  onBackToPortal: () => void;
}

interface Bubble {
  id: string;
  x: number; // percentage width
  y: number; // percentage height
  size: number;
  speed: number; // animation duration
  color: string;
  emoji: string;
  hitsRequired: number;
  hitsLeft: number;
  shakeDelay: number;
}

interface PopParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  type: 'star' | 'heart' | 'ring';
  size: number;
}

const BUBBLE_COLORS = [
  'radial-gradient(circle at 30% 30%, rgba(244, 114, 182, 0.4) 0%, rgba(236, 72, 153, 0.15) 60%, rgba(255, 255, 255, 0.2) 100%)', // Pink
  'radial-gradient(circle at 30% 30%, rgba(192, 132, 252, 0.4) 0%, rgba(167, 139, 250, 0.15) 60%, rgba(255, 255, 255, 0.2) 100%)', // Lavender
  'radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.4) 0%, rgba(3, 105, 161, 0.15) 60%, rgba(255, 255, 255, 0.2) 100%)',  // Sky Blue
  'radial-gradient(circle at 30% 30%, rgba(45, 212, 191, 0.4) 0%, rgba(13, 148, 136, 0.15) 60%, rgba(255, 255, 255, 0.2) 100%)',  // Mint
];

const BUBBLE_EMOJIS = ['☺️', '⭐', '✨', '🌸', '🧸', '🐣', '🍀'];

export const Bubbles: React.FC<BubblesProps> = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<PopParticle[]>([]);
  const [popCount, setPopCount] = useState<number>(0);
  const playAreaRef = useRef<HTMLDivElement>(null);

  // Spawn bubbles periodically
  useEffect(() => {
    const spawnBubble = () => {
      const size = 50 + Math.random() * 50; // 50px to 100px
      const isLarge = size > 85;
      const isRare = Math.random() > 0.88;

      const newBubble: Bubble = {
        id: `bubble-${Date.now()}-${Math.random()}`,
        x: 10 + Math.random() * 80, // 10% to 90%
        y: 110, // Start just below play area
        size,
        speed: 6 + Math.random() * 5, // 6s to 11s to float up
        color: isRare 
          ? 'radial-gradient(circle at 30% 30%, rgba(253, 224, 71, 0.45) 0%, rgba(234, 179, 8, 0.2) 60%, rgba(255, 255, 255, 0.35) 100%)' // Gold
          : BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        emoji: isRare ? '👑' : BUBBLE_EMOJIS[Math.floor(Math.random() * BUBBLE_EMOJIS.length)],
        hitsRequired: isLarge ? 2 : 1,
        hitsLeft: isLarge ? 2 : 1,
        shakeDelay: Math.random() * 2,
      };

      setBubbles((prev) => [...prev, newBubble]);
    };

    // Initial bubbles
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnBubble, i * 800);
    }

    const interval = setInterval(spawnBubble, 1400);
    return () => clearInterval(interval);
  }, []);

  // Update particles physics (fall down / fly away)
  useEffect(() => {
    if (particles.length === 0) return;

    const frame = requestAnimationFrame(() => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity effect
            size: p.size * 0.96, // shrink slowly
          }))
          .filter((p) => p.size > 2 && p.y < 800) // remove tiny or out-of-bounds
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [particles]);

  const handlePop = (e: React.MouseEvent | React.TouchEvent, bubble: Bubble) => {
    e.stopPropagation();

    // Get click coords relative to play area
    if (!playAreaRef.current) return;
    const rect = playAreaRef.current.getBoundingClientRect();
    
    // Support both mouse and touch events
    let clickX = 0;
    let clickY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clickX = e.touches[0].clientX - rect.left;
      clickY = e.touches[0].clientY - rect.top;
    } else {
      const mouseEvent = e as React.MouseEvent;
      clickX = mouseEvent.clientX - rect.left;
      clickY = mouseEvent.clientY - rect.top;
    }

    if (bubble.hitsLeft > 1) {
      // Shink and shake but don't pop yet
      setBubbles((prev) => 
        prev.map((b) => b.id === bubble.id 
          ? { ...b, hitsLeft: b.hitsLeft - 1, size: b.size * 0.8 } 
          : b
        )
      );
      
      // Emit tiny ripples
      createParticles(clickX, clickY, bubble.color, 3, 'ring');
      return;
    }

    // Pop the bubble! Remove it from state
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
    setPopCount((prev) => prev + 1);

    // Create explosion particles
    const particleCount = bubble.size > 80 ? 12 : 8;
    createParticles(clickX, clickY, bubble.color, particleCount);
  };

  const createParticles = (
    x: number, 
    y: number, 
    color: string, 
    count: number,
    forceType?: 'star' | 'heart' | 'ring'
  ) => {
    const newParticles: PopParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4;
      const type = forceType || (Math.random() > 0.5 ? 'star' : 'heart');
      newParticles.push({
        id: `p-${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        color,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // slightly upward boost
        type,
        size: 14 + Math.random() * 8,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  return (
    <div 
      ref={playAreaRef}
      className="baseline-game-wrapper"
      style={{
        background: 'linear-gradient(180deg, #1e1b4b 0%, #111827 100%)', // Lavender-Dark to Midnight gradient
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {/* 1. Score display */}
      <div 
        style={{
          position: 'absolute',
          top: '70px',
          left: '0',
          right: '0',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <span 
          style={{
            fontSize: '44px',
            fontWeight: '900',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'monospace',
            letterSpacing: '-0.05em',
            textShadow: '0 4px 12px rgba(167, 139, 250, 0.3)'
          }}
        >
          {popCount}
        </span>
        <span 
          style={{
            display: 'block',
            fontSize: '10px',
            color: '#a78bfa',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginTop: '2px'
          }}
        >
          Pops
        </span>
      </div>

      {/* 2. Floating Bubbles Render */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ y: '110vh', x: `${bubble.x}vw` }}
            animate={{ 
              y: '-20vh',
              x: [
                `${bubble.x}vw`,
                `${bubble.x - 6}vw`,
                `${bubble.x + 6}vw`,
                `${bubble.x}vw`
              ]
            }}
            transition={{
              y: {
                duration: bubble.speed,
                ease: 'linear'
              },
              x: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: bubble.shakeDelay
              }
            }}
            onUpdate={(latest: any) => {
              // Auto-remove bubbles that floated fully off-screen
              if (parseFloat(latest.y) < -15) {
                setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
              }
            }}
            onTouchStart={(e) => handlePop(e, bubble)}
            onMouseDown={(e) => handlePop(e, bubble)}
            className="absolute rounded-full cursor-pointer flex items-center justify-center select-none"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              background: bubble.color,
              // Glowing border and shadow for glass-like bubble aesthetic
              border: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15), inset 0 4px 16px rgba(255,255,255,0.4)',
              transform: 'translate(-50%, -50%)',
              touchAction: 'none'
            }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Glossy light reflection overlay */}
            <div 
              style={{
                position: 'absolute',
                top: '12%',
                left: '18%',
                width: '30%',
                height: '15%',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.45)',
                transform: 'rotate(-25deg)',
                filter: 'blur(0.5px)'
              }} 
            />

            {/* Cute Face emoji / Sparkle representation */}
            <span 
              style={{ 
                fontSize: `${bubble.size * 0.32}px`, 
                pointerEvents: 'none',
                opacity: 0.85
              }}
            >
              {bubble.emoji}
            </span>

            {/* Multi-hit indicator ring (if large bubble requires 2 hits) */}
            {bubble.hitsLeft > 1 && (
              <div 
                style={{
                  position: 'absolute',
                  inset: '4px',
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(255,255,255,0.5)',
                  animation: 'spin 10s linear infinite'
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* 3. Render Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              transform: 'translate(-50%, -50%)',
              color: p.color.includes('rgba') ? 'rgba(255,255,255,0.8)' : '#f472b6',
              opacity: p.size / 20,
            }}
          >
            {p.type === 'star' && <Star style={{ width: p.size, height: p.size, fill: '#fef08a', color: '#fef08a' }} />}
            {p.type === 'heart' && <Heart style={{ width: p.size, height: p.size, fill: '#f472b6', color: '#f472b6' }} />}
            {p.type === 'ring' && (
              <div 
                style={{
                  width: `${p.size * 2}px`,
                  height: `${p.size * 2}px`,
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  animation: 'ping 0.3s cubic-bezier(0, 0, 0.2, 1) forwards'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Floating dust particles for ambient relaxation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-20px`,
            }}
            animate={{
              y: -800,
              x: [0, (Math.random() - 0.5) * 30, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default Bubbles;
