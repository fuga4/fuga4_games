import React from 'react';
import { motion } from 'framer-motion';
import { Fish, Sparkles, Heart, Moon, ChevronRight } from 'lucide-react';
import { gamesList } from '../data/games';

interface PortalProps {
  onSelectGame: (gameId: string) => void;
}

// Icon helper to render the correct Lucide icon
const GameIcon: React.FC<{ name: string; className?: string; style?: React.CSSProperties }> = ({ name, className, style }) => {
  switch (name) {
    case 'Fish':
      return <Fish className={className} style={style} />;
    case 'Sparkles':
      return <Sparkles className={className} style={style} />;
    default:
      return <Heart className={className} style={style} />;
  }
};

export const Portal: React.FC<PortalProps> = ({ onSelectGame }) => {
  // Get current hour to personalize greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '清々しい朝ですね';
    if (hour >= 12 && hour < 17) return '穏やかな午後をお過ごしですか';
    return '今日もお疲れ様でした';
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-8" style={{ scrollbarWidth: 'none' }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 mt-4"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Moon className="w-6 h-6 text-indigo-300 animate-pulse-soft" style={{ color: 'var(--color-lavender)' }} />
        </div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {getGreeting()}
        </p>
        <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
          ココロほどくゲーム集
        </h1>
        <p className="text-xs px-4 mt-2" style={{ color: 'var(--text-muted)' }}>
          少しだけ頭を空っぽにして、心をゆるめていきませんか？
        </p>
      </motion.div>

      {/* Game Cards List */}
      <div className="flex flex-col gap-5 flex-grow">
        {gamesList.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame(game.id)}
            className="glass-panel p-5 cursor-pointer flex items-center justify-between transition-all"
            style={{
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="flex items-center gap-4 flex-grow pr-2">
              <div 
                className="p-3.5 rounded-2xl flex items-center justify-center"
                style={{ 
                  background: `rgba(255,255,255,0.03)`, 
                  border: `1px solid ${game.accentColor}`,
                  boxShadow: `0 0 15px rgba(255, 255, 255, 0.05)`
                }}
              >
                <GameIcon name={game.icon} className="w-7 h-7" style={{ color: game.accentColor }} />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {game.title}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                    {game.playTime}
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {game.description}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {game.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[9px] px-2 py-0.5 rounded-md font-medium"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)' 
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          </motion.div>
        ))}
      </div>

      {/* Footer / Quote */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-center mt-10 mb-4"
      >
        <p className="text-[10px] italic" style={{ color: 'var(--text-muted)' }}>
          "たまには立ち止まって、深呼吸を。"
        </p>
      </motion.div>
    </div>
  );
};
