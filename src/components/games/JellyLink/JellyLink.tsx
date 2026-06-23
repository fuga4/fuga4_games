import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Award, RotateCcw, Home, Zap } from 'lucide-react';

interface JellyLinkProps {
  onBackToPortal: () => void;
  addPoints: (amount: number) => void;
  incrementStat: (statName: 'totalPops' | 'appLaunches' | 'gamesPlayed', amount?: number) => void;
}

interface Jelly {
  id: string;
  row: number;
  col: number;
  type: number; // 0 to 4
  isBomb: boolean; // Created when matching 7+ jellies
  isFading: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  emoji?: string;
}

const JELLY_TYPES = [
  { emoji: '🍓', color: 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)', particleColor: '#ff5e62' }, // Strawberry Pink-Orange
  { emoji: '🍏', color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', particleColor: '#38ef7d' }, // Green Apple Mint
  { emoji: '🍋', color: 'linear-gradient(135deg, #f8ff00 0%, #f9d423 100%)', particleColor: '#f9d423' }, // Lemon Yellow
  { emoji: '🍇', color: 'linear-gradient(135deg, #6441a5 0%, #2a0845 100%)', particleColor: '#a78bfa' }, // Grape Purple
  { emoji: '🍮', color: 'linear-gradient(135deg, #ff9f43 0%, #ff7d00 100%)', particleColor: '#ff9f43' }  // Caramel Pudding Orange
];

const ROWS = 7;
const COLS = 6;
const GAME_DURATION = 60; // 60 seconds play time

export const JellyLink: React.FC<JellyLinkProps> = ({ onBackToPortal, addPoints, incrementStat }) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [score, setScore] = useState<number>(0);
  const [jellies, setJellies] = useState<Jelly[]>([]);
  const [selectedJellies, setSelectedJellies] = useState<Jelly[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [feverGauge, setFeverGauge] = useState<number>(0);
  const [isFever, setIsFever] = useState<boolean>(false);
  const [feverTimer, setFeverTimer] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [totalJelliesCleared, setTotalJelliesCleared] = useState<number>(0);
  const [feverCount, setFeverCount] = useState<number>(0);

  const gridRef = useRef<HTMLDivElement>(null);

  // Generate random jelly at coordinates
  const createRandomJelly = useCallback((row: number, col: number, forceType?: number): Jelly => {
    return {
      id: `jelly-${row}-${col}-${Math.random()}`,
      row,
      col,
      type: forceType !== undefined ? forceType : Math.floor(Math.random() * JELLY_TYPES.length),
      isBomb: false,
      isFading: false
    };
  }, []);

  // Initialize Board
  const initBoard = useCallback(() => {
    const temp: Jelly[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        temp.push(createRandomJelly(r, c));
      }
    }
    setJellies(temp);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFeverGauge(0);
    setIsFever(false);
    setFeverTimer(0);
    setTotalJelliesCleared(0);
    setFeverCount(0);
    setSelectedJellies([]);
  }, [createRandomJelly]);

  // Start countdown on mount
  useEffect(() => {
    incrementStat('gamesPlayed', 1);
    initBoard();

    let count = 3;
    const cdInterval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(cdInterval);
        setGameState('playing');
      } else {
        setCountdown(count);
      }
    }, 900);

    return () => clearInterval(cdInterval);
  }, [incrementStat, initBoard]);

  // Timer tick & Fever count down
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });

      // Manage fever decay
      setFeverTimer((prevFever) => {
        if (prevFever <= 1) {
          setIsFever(false);
          return 0;
        }
        return prevFever - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Sync fever gauge decay (decay slowly when not in fever)
  useEffect(() => {
    if (gameState !== 'playing' || isFever) return;
    const decay = setInterval(() => {
      setFeverGauge((prev) => Math.max(0, prev - 1));
    }, 500);
    return () => clearInterval(decay);
  }, [gameState, isFever]);

  // Particle physics updates
  useEffect(() => {
    if (particles.length === 0) return;

    const animFrame = requestAnimationFrame(() => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12, // gravity
            size: p.size * 0.96 // shrink
          }))
          .filter((p) => p.size > 2 && p.y < 800)
      );
    });

    return () => cancelAnimationFrame(animFrame);
  }, [particles]);

  // Calculate points rewarded at game over
  useEffect(() => {
    if (gameState === 'gameover') {
      const pFromJellies = Math.floor(totalJelliesCleared / 10);
      const pFromScore = Math.floor(score / 1500);
      const pFromFever = feverCount * 5;
      const totalGained = Math.max(1, pFromJellies + pFromScore + pFromFever);
      setEarnedPoints(totalGained);
      addPoints(totalGained);
    }
  }, [gameState, score, totalJelliesCleared, feverCount, addPoints]);

  // Sparkle particles helper
  const spawnParticles = (x: number, y: number, color: string, count: number, emoji?: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      newParticles.push({
        id: `particle-${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        color,
        size: emoji ? 18 : 8 + Math.random() * 6,
        emoji
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Check connectivity of two cells
  const isAdjacent = (j1: Jelly, j2: Jelly) => {
    return Math.abs(j1.row - j2.row) <= 1 && Math.abs(j1.col - j2.col) <= 1;
  };

  const handleJellyHover = (jelly: Jelly) => {
    if (!isDragging || jelly.isFading) return;

    if (selectedJellies.length === 0) {
      setSelectedJellies([jelly]);
      return;
    }

    const lastSelected = selectedJellies[selectedJellies.length - 1];

    // Undo action (swiped back to the previous jelly)
    if (selectedJellies.length > 1 && jelly.id === selectedJellies[selectedJellies.length - 2].id) {
      setSelectedJellies((prev) => prev.slice(0, -1));
      return;
    }

    // Connect matching type, adjacent, and not already selected
    if (
      jelly.type === lastSelected.type &&
      !jelly.isBomb &&
      !lastSelected.isBomb &&
      isAdjacent(lastSelected, jelly) &&
      !selectedJellies.some((s) => s.id === jelly.id)
    ) {
      setSelectedJellies((prev) => [...prev, jelly]);
    }
  };

  // Handle Drag Start
  const handleDragStart = (jelly: Jelly) => {
    if (gameState !== 'playing') return;
    setIsDragging(true);

    if (jelly.isBomb) {
      // Trigger bomb explosion immediately
      triggerBomb(jelly);
    } else {
      setSelectedJellies([jelly]);
    }
  };

  // Convert client coordinate relative to grid
  const processDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !gridRef.current) return;
    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return;
    const jellyId = element.getAttribute('data-jelly-id');
    if (jellyId) {
      const jelly = jellies.find((j) => j.id === jellyId);
      if (jelly) {
        handleJellyHover(jelly);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    processDragMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    processDragMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  // Bomb trigger: clear 3x3 surrounding cells
  const triggerBomb = (bombJelly: Jelly) => {
    const surroundingRows = [bombJelly.row - 1, bombJelly.row, bombJelly.row + 1];
    const surroundingCols = [bombJelly.col - 1, bombJelly.col, bombJelly.col + 1];

    const toClear = jellies.filter(
      (j) => surroundingRows.includes(j.row) && surroundingCols.includes(j.col)
    );

    // Calculate score
    const pointsGained = toClear.length * 150 * (isFever ? 3 : 1);
    setScore((prev) => prev + pointsGained);
    setTotalJelliesCleared((prev) => prev + toClear.length);

    // Blast particles
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const blastX = ((bombJelly.col + 0.5) / COLS) * rect.width;
      const blastY = ((bombJelly.row + 0.5) / ROWS) * rect.height;
      spawnParticles(blastX, blastY, 'radial-gradient(circle, #fde047, #f97316)', 24);
    }

    // Set fading state
    const idsToClear = toClear.map((c) => c.id);
    setJellies((prev) => prev.map((j) => (idsToClear.includes(j.id) ? { ...j, isFading: true } : j)));

    setTimeout(() => {
      applyGravity(idsToClear, null);
    }, 250);
  };

  // Handle Drag End and Process Match
  const handleDragEnd = () => {
    setIsDragging(false);

    if (selectedJellies.length >= 3) {
      const matchCount = selectedJellies.length;
      const firstJelly = selectedJellies[0];
      const matchColor = JELLY_TYPES[firstJelly.type].particleColor;

      // Score logic: cubic bonus for longer matches
      const baseScore = matchCount * 100;
      const bonusScore = Math.max(0, (matchCount - 3) * 50);
      const totalMatchScore = (baseScore + bonusScore) * (isFever ? 3 : 1);
      setScore((prev) => prev + totalMatchScore);
      setTotalJelliesCleared((prev) => prev + matchCount);

      // Increase fever
      setFeverGauge((prev) => {
        const next = prev + matchCount * 1.8;
        if (next >= 100 && !isFever) {
          setIsFever(true);
          setFeverTimer(10); // 10s fever
          setFeverCount((fc) => fc + 1);
          setTimeLeft((time) => Math.min(GAME_DURATION, time + 5)); // add 5s time bonus
          return 0; // reset gauge
        }
        return next % 100;
      });

      // Check for Bomb creation (7+ matches)
      let bombCoord: { row: number; col: number } | null = null;
      if (matchCount >= 7) {
        // Place bomb at the last connected jelly position
        const lastJelly = selectedJellies[selectedJellies.length - 1];
        bombCoord = { row: lastJelly.row, col: lastJelly.col };
      }

      // Spark particles
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        selectedJellies.forEach((j) => {
          const px = ((j.col + 0.5) / COLS) * rect.width;
          const py = ((j.row + 0.5) / ROWS) * rect.height;
          spawnParticles(px, py, matchColor, 6, JELLY_TYPES[j.type].emoji);
        });
      }

      // Mark jellies for deletion
      const clearedIds = selectedJellies.map((j) => j.id);
      setJellies((prev) => prev.map((j) => (clearedIds.includes(j.id) ? { ...j, isFading: true } : j)));

      // Apply physics falling
      setTimeout(() => {
        applyGravity(clearedIds, bombCoord);
      }, 200);
    }

    setSelectedJellies([]);
  };

  // Re-order board so top jellies fall into cleared positions
  const applyGravity = (clearedIds: string[], bombCoord: { row: number; col: number } | null) => {
    setJellies((prev) => {
      // Step 1: Filter out deleted jellies
      const activeJellies = prev.filter((j) => !clearedIds.includes(j.id) && !j.isFading);

      // Step 2: Push items down and generate replacement jellies
      const finalBoard: Jelly[] = [];

      for (let c = 0; c < COLS; c++) {
        // Find remaining jellies in this column, sorted by row ascending (top to bottom)
        const colJellies = activeJellies.filter((j) => j.col === c).sort((a, b) => a.row - b.row);

        // Put them at the bottom slots first
        let currentFillRow = ROWS - 1;
        const columnResult: Jelly[] = [];

        // Push existing from bottom up
        for (let i = colJellies.length - 1; i >= 0; i--) {
          const oldJelly = colJellies[i];
          columnResult.push({
            ...oldJelly,
            row: currentFillRow
          });
          currentFillRow--;
        }

        // Fill remaining top slots with fresh jellies
        while (currentFillRow >= 0) {
          columnResult.push(createRandomJelly(currentFillRow, c));
          currentFillRow--;
        }

        finalBoard.push(...columnResult);
      }

      // If bomb creation criteria met, override that cell with a bomb
      if (bombCoord) {
        const bombIdx = finalBoard.findIndex((j) => j.row === bombCoord.row && j.col === bombCoord.col);
        if (bombIdx !== -1) {
          finalBoard[bombIdx] = {
            ...finalBoard[bombIdx],
            isBomb: true
          };
        }
      }

      return finalBoard;
    });
  };

  // Calculate percentage of remaining time
  const timePercent = (timeLeft / GAME_DURATION) * 100;

  return (
    <div 
      className="baseline-game-wrapper"
      style={{
        background: isFever 
          ? 'radial-gradient(circle, #2d124d 0%, #0c021f 100%)' // Hot purple fever background
          : 'linear-gradient(180deg, #180828 0%, #0d0415 100%)', // Sleek dark velvet
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none'
      }}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      {/* Upper Status Panel */}
      <div 
        style={{
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.4)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Score indicator */}
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</span>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: isFever ? '#f43f5e' : '#fff', margin: 0, fontFamily: 'monospace' }}>
            {score}
          </h2>
        </div>

        {/* Fever Badge */}
        {isFever && (
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
              color: 'white',
              fontSize: '11px',
              fontWeight: '950',
              padding: '4px 10px',
              borderRadius: '999px',
              boxShadow: '0 0 15px #ec4899',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Zap style={{ width: '12px', height: '12px', fill: 'white' }} /> FEVER x3
          </motion.div>
        )}

        {/* Timer UI */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Timer style={{ width: '13px', height: '13px', color: timeLeft <= 10 ? '#f43f5e' : '#60a5fa' }} />
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: timeLeft <= 10 ? '#f43f5e' : '#eaeaea', fontFamily: 'monospace' }}>
              {timeLeft}s
            </span>
          </div>
          {/* Time Progress Bar */}
          <div style={{ width: '100%', height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
            <div 
              style={{
                height: '100%',
                width: `${timePercent}%`,
                background: timeLeft <= 10 ? '#f43f5e' : '#3b82f6',
                transition: 'width 0.2s linear'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100% - 150px)',
          position: 'relative',
          padding: '10px'
        }}
      >
        <AnimatePresence>
          {gameState === 'ready' && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              style={{
                position: 'absolute',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                ぷるぷるゼリーリンク
              </span>
              <h1 style={{ fontSize: '72px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 0 20px rgba(167,139,250,0.5)' }}>
                {countdown}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle Board Box */}
        <div 
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            gap: '6px',
            width: '100%',
            maxWidth: '330px',
            aspectRatio: '6 / 7',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            border: '2px solid rgba(255, 255, 255, 0.05)',
            padding: '10px',
            position: 'relative',
            touchAction: 'none'
          }}
        >
          {/* Path connection SVGs overlay */}
          <svg 
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 20
            }}
          >
            {selectedJellies.length > 1 && (
              <polyline
                points={selectedJellies
                  .map((j) => {
                    const cx = `${((j.col + 0.5) / COLS) * 100}%`;
                    const cy = `${((j.row + 0.5) / ROWS) * 100}%`;
                    return `${cx},${cy}`;
                  })
                  .join(' ')}
                style={{
                  fill: 'none',
                  stroke: JELLY_TYPES[selectedJellies[0].type].particleColor,
                  strokeWidth: 8,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  opacity: 0.7,
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'
                }}
              />
            )}
          </svg>

          {/* Render individual jellies */}
          {jellies.map((jelly) => {
            const isSelected = selectedJellies.some((s) => s.id === jelly.id);
            const typeInfo = JELLY_TYPES[jelly.type];

            return (
              <motion.div
                key={jelly.id}
                layoutId={jelly.id}
                data-jelly-id={jelly.id}
                onMouseDown={() => handleDragStart(jelly)}
                onTouchStart={() => handleDragStart(jelly)}
                style={{
                  gridRowStart: jelly.row + 1,
                  gridColumnStart: jelly.col + 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  position: 'relative',
                  touchAction: 'none',
                  zIndex: isSelected ? 30 : 10,
                  opacity: jelly.isFading ? 0 : 1,
                  transition: 'opacity 0.2s ease-out'
                }}
              >
                {/* Visual Circle Bubble */}
                <motion.div
                  animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
                  className="w-full h-full rounded-full flex items-center justify-center relative"
                  style={{
                    width: '90%',
                    height: '90%',
                    background: jelly.isBomb 
                      ? 'radial-gradient(circle, #f43f5e 0%, #1e1b4b 100%)' // Bomb look
                      : typeInfo.color,
                    border: isSelected 
                      ? '2px solid #ffffff' 
                      : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: isSelected 
                      ? `0 0 15px ${typeInfo.particleColor}, inset 0 2px 8px rgba(255,255,255,0.6)`
                      : '0 4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.25)',
                    pointerEvents: 'none' // Click passes through inner bubble to wrapper data-jelly-id
                  }}
                >
                  {/* Glossy overlay effect */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '10%',
                      left: '15%',
                      width: '25%',
                      height: '15%',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.4)',
                      transform: 'rotate(-25deg)'
                    }} 
                  />

                  {/* Character emoji */}
                  <span style={{ fontSize: '20px' }}>
                    {jelly.isBomb ? '💣' : typeInfo.emoji}
                  </span>

                  {/* Bomb glowing ring indicator */}
                  {jelly.isBomb && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ border: '2px solid #ef4444', opacity: 0.3 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer: Fever Gauge Container */}
      <div 
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '0',
          right: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '330px', marginBottom: '6px', fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}>
          <span>FEVER GAUGE</span>
          <span>{Math.round(feverGauge)}%</span>
        </div>
        <div style={{ width: '100%', maxWidth: '330px', height: '10px', background: '#1e293b', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
          <div 
            style={{
              height: '100%',
              width: `${isFever ? (feverTimer / 10) * 100 : feverGauge}%`,
              background: isFever 
                ? 'linear-gradient(90deg, #ec4899 0%, #a78bfa 100%)' 
                : 'linear-gradient(90deg, #fb7185 0%, #f43f5e 100%)',
              transition: isFever ? 'width 1s linear' : 'width 0.2s ease-out'
            }}
          />
        </div>
      </div>

      {/* Render Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              transform: 'translate(-50%, -50%)',
              color: p.color,
              opacity: p.size / 20,
              pointerEvents: 'none'
            }}
          >
            {p.emoji ? (
              <span style={{ fontSize: `${p.size}px` }}>{p.emoji}</span>
            ) : (
              <div 
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  background: p.color,
                  boxShadow: `0 0 10px ${p.color}`
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* GAME OVER RESULT OVERLAY */}
      <AnimatePresence>
        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              zIndex: 100
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                maxWidth: '300px',
                width: '100%'
              }}
            >
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(253, 224, 71, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fde047'
                }}
              >
                <Award style={{ width: '32px', height: '32px' }} />
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '950', color: 'white', margin: 0 }}>
                おつかれさまでした！
              </h2>

              {/* Stats Card */}
              <div 
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#94a3b8' }}>スコア</span>
                  <span style={{ fontWeight: 'bold', color: 'white', fontFamily: 'monospace' }}>{score}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#94a3b8' }}>消したゼリー</span>
                  <span style={{ fontWeight: 'bold', color: 'white', fontFamily: 'monospace' }}>{totalJelliesCleared} 個</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                  <span style={{ color: '#ff9f43', fontWeight: 'bold' }}>獲得したしずく</span>
                  <span style={{ fontWeight: 'black', color: '#ff9f43', fontFamily: 'monospace' }}>💧 +{earnedPoints}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
                <button
                  onClick={initBoard}
                  className="baseline-locked-back-btn"
                  style={{
                    flex: 1,
                    margin: 0,
                    background: '#1e293b',
                    borderColor: '#334155',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '12px 0'
                  }}
                >
                  <RotateCcw style={{ width: '14px', height: '14px' }} /> もう一度
                </button>
                <button
                  onClick={onBackToPortal}
                  className="baseline-btn-play"
                  style={{
                    flex: 1,
                    margin: 0,
                    background: 'linear-gradient(135deg, #00c3e3 0%, #00a4bf 100%)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '12px 0'
                  }}
                >
                  <Home style={{ width: '14px', height: '14px' }} /> おわる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
