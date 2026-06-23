import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Volume2, VolumeX, Sparkles, Lock } from 'lucide-react';

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
      <div className="switch-loading-boot">
        {/* Glowing game logo placeholder */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 0.5 }}
          className="switch-boot-logo-box"
        >
          <div className="switch-boot-icon-holder">
            <Sparkles style={{ width: '36px', height: '36px', color: '#c084fc' }} className="animate-pulse-soft" />
          </div>
          <span className="switch-system-btn-label" style={{ letterSpacing: '0.2em', marginTop: '8px' }}>
            Loading
          </span>
        </motion.div>

        {/* Small spinning icon at bottom right */}
        <div className="switch-boot-spinner-wrap">
          <div className="switch-boot-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="baseline-game-wrapper">
      
      {/* Upper Navigation Header */}
      <div className="baseline-header">
        <button onClick={onBackToPortal} className="baseline-btn-back">
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
        </button>

        <span className="baseline-header-title">
          {gameId === 'soothing-bubbles' ? 'ぷにぷに泡ポチ (開発ベース)' : '開発中のゲーム'}
        </span>

        <button onClick={() => setMuted(!muted)} className="baseline-btn-back">
          {muted ? <VolumeX style={{ width: '16px', height: '16px', color: '#52525b' }} /> : <Volume2 style={{ width: '16px', height: '16px' }} />}
        </button>
      </div>

      {/* Main Sandbox / Game Placeholder */}
      <div className="baseline-content">
        {gameId === 'soothing-bubbles' ? (
          <div className="baseline-game-info-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
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
              className="baseline-bubble-visual"
              whileTap={{ scale: 0.9 }}
              onClick={() => alert('ゲーム本編は次のステップで実装されます！')}
            >
              <Sparkles style={{ width: '48px', height: '48px', color: '#fbcfe8' }} className="animate-pulse-soft" />
              <div className="baseline-bubble-highlight" />
            </motion.div>

            <div style={{ marginTop: '24px' }}>
              <h3 className="baseline-game-h3">ぷにぷに泡ポチ</h3>
              <p className="baseline-game-desc">
                これは最初の基準ゲームのプレースホルダーです。
                次回のステップで、この画面内に「ぷにぷに泡を消す心地よいゲームプレイ」をバグのない堅牢なコードで構築します。
              </p>
            </div>

            <button
              onClick={() => alert('ゲーム本編は次のステップで実装されます！')}
              className="baseline-btn-play"
            >
              <Play style={{ width: '16px', height: '16px' }} /> テストプレイ
            </button>
          </div>
        ) : (
          <div className="baseline-placeholder-locked">
            <div className="baseline-locked-icon-holder">
              <Lock style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <h3 className="baseline-locked-h3">準備中</h3>
              <p className="baseline-locked-desc">
                このゲームは現在開発中です。
                基準ゲームが完成した後、この枠組みを横展開して実装されます。
              </p>
            </div>
            <button onClick={onBackToPortal} className="baseline-locked-back-btn">
              ホームに戻る
            </button>
          </div>
        )}
      </div>

      {/* Scanline overlay */}
      <div className="switch-scanlines" />
    </div>
  );
};
