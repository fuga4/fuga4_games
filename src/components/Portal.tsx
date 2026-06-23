import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Wifi, Battery, ShoppingBag, Image, Sliders, Power, Gamepad2, ArrowLeft, ArrowRight, Lock
} from 'lucide-react';
import { type GameMetadata, gamesList } from '../data/games';

interface PortalProps {
  onSelectGame: (gameId: string) => void;
}

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
      setShowSystemPopup(`${game.title}は準備中です。次のアップデートをお楽しみに！`);
      setTimeout(() => setShowSystemPopup(null), 2500);
      return;
    }
    onSelectGame(game.id);
  };

  return (
    <div className="switch-container">
      
      {/* 1. STATUS BAR */}
      <div className="switch-status-bar">
        {/* Left: User Profile Icon */}
        <div className="switch-profile-area">
          <div className="switch-avatar-circle">
            <User className="w-4 h-4 text-white" style={{ width: '16px', height: '16px' }} />
            <div className="switch-avatar-online" />
          </div>
          <span className="switch-profile-name">ユーザー1</span>
        </div>

        {/* Right: Network, Battery and Time */}
        <div className="switch-status-right">
          <Wifi style={{ width: '16px', height: '16px', color: '#8e8e93' }} />
          
          <div className="switch-battery-container">
            <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}>{batteryLevel}%</span>
            <div className="switch-battery-icon-wrapper">
              <Battery style={{ width: '20px', height: '20px', color: '#8e8e93' }} />
              <div 
                className="switch-battery-fill"
                style={{ width: `${(batteryLevel / 100) * 11}px` }}
              />
            </div>
          </div>

          <span style={{ fontWeight: 'bold', marginLeft: '4px', fontFamily: 'monospace' }}>{time}</span>
        </div>
      </div>

      {/* 2. GAME SELECTION CAROUSEL ZONE */}
      <div className="switch-carousel-zone">
        
        {/* Horizontal Cards View */}
        <div className="switch-carousel-viewport">
          
          {/* Navigation Arrows */}
          <button onClick={handlePrev} className="switch-nav-arrow left">
            <ArrowLeft style={{ width: '16px', height: '16px', color: 'white' }} />
          </button>

          {/* Cards container */}
          <div className="switch-cards-wrapper">
            <AnimatePresence mode="popLayout">
              {gamesList.map((game, index) => {
                const offset = index - selectedIndex;
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
                    className={`switch-game-card ${offset === 0 ? 'switch-game-card-active' : ''}`}
                    style={{
                      backgroundImage: `url(${coverUrl})`,
                      position: 'absolute',
                      zIndex: offset === 0 ? 10 : 5,
                    }}
                  >
                    {/* Upper overlay metadata */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 10 }}>
                      <div className="switch-card-icon-badge">
                        <Gamepad2 style={{ width: '18px', height: '18px' }} />
                      </div>
                      
                      {game.isLocked && (
                        <div className="switch-card-lock-badge">
                          <Lock style={{ width: '10px', height: '10px' }} /> 準備中
                        </div>
                      )}
                    </div>

                    {/* Dark gradient overlay for text readability */}
                    <div className="switch-card-text-gradient" />

                    {/* Bottom Title card graphic */}
                    <div className="switch-card-title-area">
                      <div className="switch-card-title-bar" />
                      <span className="switch-card-title-text">
                        {game.title}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button onClick={handleNext} className="switch-nav-arrow right">
            <ArrowRight style={{ width: '16px', height: '16px', color: 'white' }} />
          </button>
        </div>

        {/* Selected Game Title & Description underneath */}
        <div className="switch-game-info-area">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="switch-game-title">
              {gamesList[selectedIndex].title}
            </h2>
            <p className="switch-game-desc">
              {gamesList[selectedIndex].description}
            </p>
          </motion.div>
        </div>

        {/* Start Game Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStartGame(gamesList[selectedIndex])}
          className={`switch-start-btn ${gamesList[selectedIndex].isLocked ? 'locked' : 'active'}`}
        >
          {gamesList[selectedIndex].isLocked ? (
            <>準備中</>
          ) : (
            <>あそぶ <Gamepad2 style={{ width: '16px', height: '16px' }} /></>
          )}
        </motion.button>
      </div>

      {/* 3. SYSTEM ROUND BUTTONS */}
      <div className="switch-system-bar">
        <div className="switch-system-buttons-row">
          
          {[
            { id: 'eshop', icon: ShoppingBag, label: 'ショップ' },
            { id: 'album', icon: Image, label: 'アルバム' },
            { id: 'controller', icon: Gamepad2, label: 'コントローラ' },
            { id: 'settings', icon: Sliders, label: '設定' },
            { id: 'power', icon: Power, label: 'スリープ' }
          ].map((btn) => (
            <div 
              key={btn.id} 
              className="switch-system-btn-item"
              onClick={() => {
                setShowSystemPopup(`${btn.label}機能は現在準備中です。`);
                setTimeout(() => setShowSystemPopup(null), 2000);
              }}
            >
              <div className="switch-system-btn-circle">
                <btn.icon />
              </div>
              <span className="switch-system-btn-label">
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
            className="switch-system-popup"
          >
            <span className="switch-system-popup-text">
              {showSystemPopup}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
