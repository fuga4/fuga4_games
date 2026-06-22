import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, RefreshCw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface GameContainerProps {
  gameId: string;
  onBackToPortal: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ gameId, onBackToPortal }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);

  // Switch-like startup loader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800); // 1.8 seconds classic switch loader
    return () => clearTimeout(timer);
  }, [gameId]);

  // Loading Screen (Nintendo Switch style)
  if (isLoading) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full w-full relative"
        style={{ background: '#000' }} // Black screen during boot
      >
        {/* Glowing game logo placeholder */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
            <Sparkles className="w-9 h-9 text-purple-300 animate-pulse-soft" />
          </div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2">
            Loading
          </span>
        </motion.div>

        {/* Small spinning icon at bottom right */}
        <div className="absolute bottom-10 right-10 flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-5 h-5 rounded-full border-2 border-neutral-700 border-t-white"
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full overflow-hidden relative select-none"
      style={{
        background: 'linear-gradient(180deg, #18181b 0%, #09090b 100%)',
        color: '#f4f4f5'
      }}
    >
      {/* Upper Navigation Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-800 bg-neutral-900/20 z-10">
        <button
          onClick={onBackToPortal}
          className="tap-button p-2.5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <ArrowLeft className="w-4 h-4 text-neutral-300" />
        </button>

        <span className="text-xs font-extrabold tracking-wider text-neutral-400">
          {gameId === 'soothing-bubbles' ? 'ぷにぷに泡ポチ (開発ベース)' : '開発中のゲーム'}
        </span>

        <button
          onClick={() => setMuted(!muted)}
          className="tap-button p-2.5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {muted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-neutral-300" />}
        </button>
      </div>

      {/* Main Sandbox / Game Placeholder */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center z-10">
        {gameId === 'soothing-bubbles' ? (
          <div className="flex flex-col items-center gap-6 max-w-xs">
            {/* Soothing bubble representation */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-36 h-36 rounded-full flex items-center justify-center shadow-2xl relative cursor-pointer border border-white/20 overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.4) 0%, rgba(167, 139, 250, 0.2) 60%, rgba(0, 0, 0, 0.6) 100%)',
                boxShadow: '0 20px 50px rgba(167, 139, 250, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Sparkles className="w-12 h-12 text-pink-200 animate-pulse-soft" />
              {/* Highlight overlay */}
              <div className="absolute top-4 left-6 w-8 h-4 rounded-full bg-white/20 rotate-[-15deg] blur-[1px]" />
            </motion.div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">ぷにぷに泡ポチ</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                これは最初の基準ゲームのプレースホルダーです。
                次回のステップで、この画面内に「ぷにぷに泡を消す心地よいゲームプレイ」をバグのない堅牢なコードで構築します。
              </p>
            </div>

            <button
              onClick={() => alert('ゲーム本編は次のステップで実装されます！')}
              className="tap-button px-8 py-3 rounded-xl flex items-center gap-2 border border-purple-500/30 text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                color: 'var(--color-lavender)'
              }}
            >
              <Play className="w-4 h-4" /> テストプレイ
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 max-w-xs">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">準備中</h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                このゲームは現在開発中です。
                基準ゲームが完成した後、この枠組みを横展開して実装されます。
              </p>
            </div>
            <button 
              onClick={onBackToPortal}
              className="tap-button px-6 py-2.5 mt-2 text-xs"
            >
              ホームに戻る
            </button>
          </div>
        )}
      </div>

      {/* Retro scanline aesthetic overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />
    </div>
  );
};
