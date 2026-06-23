import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Portal } from './components/Portal';
import { GameContainer } from './components/GameContainer';
import { MyPage } from './components/MyPage';
import { Shop } from './components/Shop';
import { useSaveData } from './hooks/useSaveData';

function App() {
  const [activeScreen, setActiveScreen] = useState<'portal' | 'game' | 'mypage' | 'shop'>('portal');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const {
    saveData,
    addPoints,
    unlockAvatar,
    setActiveAvatar,
    incrementStat,
    newlyUnlockedAchievements,
    clearNewAchievements
  } = useSaveData();

  // Clear achievement notifications automatically
  useEffect(() => {
    if (newlyUnlockedAchievements.length > 0) {
      const timer = setTimeout(() => {
        clearNewAchievements();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlockedAchievements, clearNewAchievements]);

  const handleSelectGame = (gameId: string) => {
    setActiveGameId(gameId);
    setActiveScreen('game');
  };

  const handleBackToPortal = () => {
    setActiveGameId(null);
    setActiveScreen('portal');
  };

  return (
    <>
      {/* 1. Newly Unlocked Achievement Notification (Toast) */}
      <AnimatePresence>
        {newlyUnlockedAchievements.map((title, idx) => (
          <motion.div
            key={`${title}-${idx}`}
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 15, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              position: 'absolute',
              top: '10px',
              left: '20px',
              right: '20px',
              background: 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 999,
              textAlign: 'left'
            }}
          >
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#ddd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                がんばり達成！
              </span>
              <h4 style={{ fontSize: '13px', fontWeight: '900', color: 'white', marginTop: '1px' }}>
                {title}
              </h4>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 2. Main Screen Router */}
      <AnimatePresence mode="wait">
        {activeScreen === 'game' && activeGameId && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            <GameContainer 
              gameId={activeGameId} 
              onBackToPortal={handleBackToPortal} 
              addPoints={addPoints}
              incrementStat={incrementStat}
            />
          </motion.div>
        )}

        {activeScreen === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Portal 
              saveData={saveData}
              onSelectGame={handleSelectGame} 
              onOpenMyPage={() => setActiveScreen('mypage')}
              onOpenShop={() => setActiveScreen('shop')}
            />
          </motion.div>
        )}

        {activeScreen === 'mypage' && (
          <motion.div
            key="mypage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            <MyPage 
              saveData={saveData}
              setActiveAvatar={setActiveAvatar}
              onBack={() => setActiveScreen('portal')}
            />
          </motion.div>
        )}

        {activeScreen === 'shop' && (
          <motion.div
            key="shop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Shop 
              saveData={saveData}
              unlockAvatar={unlockAvatar}
              onBack={() => setActiveScreen('portal')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
