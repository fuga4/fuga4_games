import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Sparkles, Check } from 'lucide-react';
import type { SaveData } from '../hooks/useSaveData';
import { avatarsList, type Avatar } from '../data/avatars';

interface ShopProps {
  saveData: SaveData;
  unlockAvatar: (avatarId: string, price: number) => boolean;
  onBack: () => void;
}

export const Shop: React.FC<ShopProps> = ({ saveData, unlockAvatar, onBack }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);

  const handleBuy = () => {
    if (!selectedAvatar) return;
    const success = unlockAvatar(selectedAvatar.id, selectedAvatar.price);
    if (success) {
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedAvatar(null);
      }, 2000);
    } else {
      alert('しずくポイントが不足しています。');
    }
  };

  return (
    <div 
      className="switch-container"
      style={{
        background: '#1a1a1a', // Switch eShop dark background is slightly darker
        color: '#eaeaea',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Upper Navigation Header */}
      <div className="baseline-header" style={{ borderBottom: '1px solid #ff7d00' }}> {/* Orange Accent for eShop */}
        <button onClick={onBack} className="baseline-btn-back">
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
        </button>
        <span className="baseline-header-title" style={{ color: '#ff7d00' }}>ひだまりショップ</span>
        
        {/* Wallet info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 'bold', color: '#ff9f43' }}>
          <Sparkles style={{ width: '12px', height: '12px' }} />
          <span>💧 {saveData.points}</span>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px' }}>
        
        {/* Helper guide */}
        <div style={{ background: 'rgba(255,125,0,0.05)', border: '1px solid rgba(255,125,0,0.15)', borderRadius: '12px', padding: '12px', fontSize: '11.5px', color: '#ff9f43', textAlign: 'left', marginBottom: '20px', lineHeight: '1.5' }}>
          ゲームで集めた「しずく」を使って、新しいアバターアイコンをむかえましょう。
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {avatarsList.map((avatar) => {
            const isOwned = saveData.unlockedAvatarIds.includes(avatar.id);
            const canAfford = saveData.points >= avatar.price;

            // Default avatar doesn't need to be bought
            if (avatar.price === 0) return null;

            return (
              <motion.div
                key={avatar.id}
                whileHover={!isOwned ? { scale: 1.02 } : {}}
                whileTap={!isOwned ? { scale: 0.98 } : {}}
                onClick={() => !isOwned && setSelectedAvatar(avatar)}
                style={{
                  background: '#242424',
                  border: isOwned ? '1px solid #333' : '1px solid #444',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isOwned ? 'default' : 'pointer',
                  opacity: isOwned ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                {/* Visual Circle */}
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: avatar.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    marginBottom: '12px'
                  }}
                >
                  {avatar.emoji}
                </div>

                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>
                  {avatar.name}
                </span>

                {/* Price tag / status */}
                <div style={{ marginTop: '10px', width: '100%' }}>
                  {isOwned ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '999px', fontSize: '10px', color: '#8e8e93', fontWeight: 'bold' }}>
                      <Check style={{ width: '10px', height: '10px' }} /> むかえ済
                    </div>
                  ) : (
                    <div 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        background: canAfford ? 'rgba(255, 125, 0, 0.1)' : 'rgba(255,255,255,0.03)', 
                        border: canAfford ? '1px solid rgba(255, 125, 0, 0.3)' : '1px solid #3c3c3c',
                        padding: '4px 12px', 
                        borderRadius: '999px', 
                        fontSize: '11px', 
                        color: canAfford ? '#ff9f43' : '#666', 
                        fontWeight: 'bold' 
                      }}
                    >
                      💧 {avatar.price}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CONFIRMATION / SUCCESS MODAL */}
      <AnimatePresence>
        {selectedAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="switch-system-popup"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 0,
              background: 'rgba(20, 20, 20, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 100
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                maxWidth: '300px'
              }}
            >
              {purchaseSuccess ? (
                <>
                  <div 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(52, 211, 153, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                      fontSize: '32px',
                      animation: 'bounce 0.6s infinite alternate'
                    }}
                  >
                    🎉
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                    むかえ入れ完了！
                  </h3>
                  <p style={{ fontSize: '12px', color: '#8e8e93', lineHeight: '1.6' }}>
                    新しいなかま {selectedAvatar.name} がアバターに加わりました！マイページからいつでも変更できます。
                  </p>
                </>
              ) : (
                <>
                  <div 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: selectedAvatar.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                    }}
                  >
                    {selectedAvatar.emoji}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
                    {selectedAvatar.name} をむかえますか？
                  </h3>
                  <p style={{ fontSize: '11px', color: '#8e8e93' }}>
                    このアバターのアンロックには 💧 {selectedAvatar.price} ポイントが必要です。
                  </p>
                  
                  <div style={{ display: 'flex', width: '100%', gap: '10px', marginTop: '12px' }}>
                    <button
                      onClick={() => setSelectedAvatar(null)}
                      className="baseline-locked-back-btn"
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        margin: 0,
                        background: '#323232',
                        borderColor: '#4a4a4a',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      やめる
                    </button>
                    <button
                      onClick={handleBuy}
                      className="baseline-btn-play"
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        margin: 0,
                        background: 'linear-gradient(135deg, #ff7d00 0%, #ff9f43 100%)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        justifyContent: 'center'
                      }}
                    >
                      <ShoppingBag style={{ width: '14px', height: '14px' }} /> むかえる
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
