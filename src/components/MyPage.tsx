import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, Award, Heart } from 'lucide-react';
import type { SaveData } from '../hooks/useSaveData';
import { avatarsList } from '../data/avatars';
import { achievementsList, type Achievement } from '../data/achievements';

interface MyPageProps {
  saveData: SaveData;
  setActiveAvatar: (avatarId: string) => void;
  onBack: () => void;
}

export const MyPage: React.FC<MyPageProps> = ({ saveData, setActiveAvatar, onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements'>('profile');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const currentAvatar = avatarsList.find((a) => a.id === saveData.activeAvatarId) || avatarsList[0];

  return (
    <div 
      className="switch-container"
      style={{
        background: '#2d2d2d',
        color: '#eaeaea',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Upper Navigation Header */}
      <div className="baseline-header">
        <button onClick={onBack} className="baseline-btn-back">
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
        </button>
        <span className="baseline-header-title">マイページ</span>
        <div style={{ width: '36px' }} /> {/* Spacer to balance back button */}
      </div>

      {/* Switch-like Tab Bar */}
      <div 
        style={{
          display: 'flex',
          borderBottom: '1px solid #3c3c3c',
          background: '#242424',
          padding: '0 16px'
        }}
      >
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            padding: '14px 0',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid #00c3e3' : '3px solid transparent',
            color: activeTab === 'profile' ? '#ffffff' : '#8e8e93',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          プロフィール
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          style={{
            flex: 1,
            padding: '14px 0',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'achievements' ? '3px solid #00c3e3' : '3px solid transparent',
            color: activeTab === 'achievements' ? '#ffffff' : '#8e8e93',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          がんばり記録 (実績)
        </button>
      </div>

      {/* Main Tab Contents */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px 20px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Card Summary */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: '#202020',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #3a3a3a',
                  marginBottom: '24px'
                }}
              >
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: currentAvatar.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    border: '3px solid #eaeaea',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  {currentAvatar.emoji}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>ユーザー1</h3>
                  <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    💧 {saveData.points} しずくポイント所持
                  </span>
                </div>
              </div>

              {/* Avatar Selector */}
              <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', textAlign: 'left' }}>
                所持アバター（きせかえ）
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
                {avatarsList.map((avatar) => {
                  const isOwned = saveData.unlockedAvatarIds.includes(avatar.id);
                  const isActive = saveData.activeAvatarId === avatar.id;

                  if (!isOwned) return null; // Only show owned avatars

                  return (
                    <motion.div
                      key={avatar.id}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveAvatar(avatar.id)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '50%',
                        backgroundColor: avatar.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: isActive ? '0 0 0 3px #ffffff, 0 0 0 6px #00c3e3' : '0 2px 6px rgba(0,0,0,0.2)',
                        transition: 'box-shadow 0.2s'
                      }}
                    >
                      {avatar.emoji}
                      {isActive && (
                        <div 
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            backgroundColor: '#00c3e3',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid #2d2d2d'
                          }}
                        >
                          <CheckCircle2 style={{ width: '12px', height: '12px', color: 'white' }} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Play Activity (Switch style) */}
              <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', textAlign: 'left' }}>
                がんばりの記録 (プレイ履歴)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#202020', borderRadius: '12px', padding: '16px', border: '1px solid #3a3a3a', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #2d2d2d', paddingBottom: '8px' }}>
                  <span style={{ color: '#8e8e93' }}>アプリを起動した回数</span>
                  <span style={{ fontWeight: 'bold', color: 'white' }}>{saveData.stats.appLaunches} 回</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #2d2d2d', paddingBottom: '8px', paddingTop: '4px' }}>
                  <span style={{ color: '#8e8e93' }}>遊んだゲームの総数</span>
                  <span style={{ fontWeight: 'bold', color: 'white' }}>{saveData.stats.gamesPlayed} 回</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '4px' }}>
                  <span style={{ color: '#8e8e93' }}>割った泡の総数</span>
                  <span style={{ fontWeight: 'bold', color: 'white' }}>{saveData.stats.totalPops} 回</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {achievementsList.map((ach) => {
                const isUnlocked = saveData.unlockedAchievementIds.includes(ach.id);

                return (
                  <motion.div
                    key={ach.id}
                    whileTap={isUnlocked ? { scale: 0.98 } : {}}
                    onClick={() => isUnlocked && setSelectedAchievement(ach)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: isUnlocked ? 'rgba(167, 139, 250, 0.05)' : '#202020',
                      border: isUnlocked ? '1.5px solid #a78bfa' : '1px solid #3a3a3a',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      textAlign: 'left',
                      position: 'relative',
                      opacity: isUnlocked ? 1 : 0.6
                    }}
                  >
                    {/* Badge Icon */}
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: isUnlocked ? 'rgba(167, 139, 250, 0.15)' : '#323232',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isUnlocked ? '#a78bfa' : '#666666'
                      }}
                    >
                      {isUnlocked ? <Award style={{ width: '22px', height: '22px' }} /> : <Lock style={{ width: '18px', height: '18px' }} />}
                    </div>

                    {/* Meta info */}
                    <div style={{ flexGrow: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: isUnlocked ? 'white' : '#8e8e93' }}>
                        {isUnlocked ? ach.title : '???'}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#8e8e93', marginTop: '2px' }}>
                        {ach.description}
                      </p>
                    </div>

                    {/* Unlocked marker */}
                    {isUnlocked && (
                      <div 
                        style={{
                          fontSize: '9px',
                          fontWeight: 'bold',
                          color: '#a78bfa',
                          border: '1px solid rgba(167, 139, 250, 0.4)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          background: 'rgba(167, 139, 250, 0.05)'
                        }}
                      >
                        メッセージ開封
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COMFORT MESSAGE MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="switch-system-popup"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 0,
              background: 'rgba(20, 20, 20, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '28px',
              zIndex: 100
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                maxWidth: '320px'
              }}
            >
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(244, 114, 182, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f472b6',
                  boxShadow: '0 0 20px rgba(244, 114, 182, 0.15)'
                }}
              >
                <Heart style={{ width: '28px', height: '28px', fill: '#f472b6' }} />
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>
                {selectedAchievement.title}
              </h3>
              
              <div style={{ height: '1.5px', width: '32px', background: 'rgba(255,255,255,0.1)' }} />

              <p 
                style={{
                  fontSize: '13px',
                  color: '#e2e8f0',
                  lineHeight: '1.7',
                  textAlign: 'left',
                  textIndent: '1em'
                }}
              >
                {selectedAchievement.comfortMessage}
              </p>

              <button
                onClick={() => setSelectedAchievement(null)}
                className="baseline-locked-back-btn"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  marginTop: '16px',
                  background: '#323232',
                  borderColor: '#4a4a4a',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                とじる
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
