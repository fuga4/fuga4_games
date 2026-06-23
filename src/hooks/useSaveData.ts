import { useState, useEffect, useCallback } from 'react';
import { achievementsList } from '../data/achievements';

export interface SaveData {
  points: number;
  unlockedAvatarIds: string[];
  activeAvatarId: string;
  unlockedAchievementIds: string[];
  stats: {
    totalPops: number;
    appLaunches: number;
    gamesPlayed: number;
  };
}

const DEFAULT_SAVE_DATA: SaveData = {
  points: 100, // Give 100 points initially so they can buy their first cheap avatar immediately
  unlockedAvatarIds: ['avatar-default'],
  activeAvatarId: 'avatar-default',
  unlockedAchievementIds: [],
  stats: {
    totalPops: 0,
    appLaunches: 0,
    gamesPlayed: 0
  }
};

const LOCAL_STORAGE_KEY = 'fuga4_games_save_data';

export const useSaveData = () => {
  const [saveData, setSaveData] = useState<SaveData>(DEFAULT_SAVE_DATA);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<string[]>([]);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let parsedData = DEFAULT_SAVE_DATA;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with default data to handle any schema additions
        parsedData = {
          ...DEFAULT_SAVE_DATA,
          ...parsed,
          stats: {
            ...DEFAULT_SAVE_DATA.stats,
            ...(parsed.stats || {})
          }
        };
      } catch (e) {
        console.error('Failed to parse save data, using defaults', e);
      }
    }

    // Increment launch count on start
    parsedData.stats.appLaunches += 1;
    setSaveData(parsedData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedData));
  }, []);


  // 2. Add points (e.g. from playing games)
  const addPoints = useCallback((amount: number) => {
    setSaveData((prev) => {
      const next = { ...prev, points: prev.points + amount };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // 3. Purchase / Unlock Avatar
  const unlockAvatar = useCallback((avatarId: string, price: number) => {
    let success = false;
    setSaveData((prev) => {
      if (prev.points < price || prev.unlockedAvatarIds.includes(avatarId)) {
        return prev;
      }
      success = true;
      const next = {
        ...prev,
        points: prev.points - price,
        unlockedAvatarIds: [...prev.unlockedAvatarIds, avatarId]
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return success;
  }, []);

  // 4. Set Active Avatar
  const setActiveAvatar = useCallback((avatarId: string) => {
    setSaveData((prev) => {
      if (!prev.unlockedAvatarIds.includes(avatarId)) {
        return prev;
      }
      const next = { ...prev, activeAvatarId: avatarId };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // 5. Increment stats (and automatically check achievements)
  const incrementStat = useCallback((statName: keyof SaveData['stats'], amount: number = 1) => {
    setSaveData((prev) => {
      const nextStats = {
        ...prev.stats,
        [statName]: prev.stats[statName] + amount
      };

      // Check for newly unlocked achievements
      const newlyUnlocked: string[] = [];
      let pointsToGain = 0;
      const nextAchievements = [...prev.unlockedAchievementIds];

      achievementsList.forEach((ach) => {
        if (!nextAchievements.includes(ach.id)) {
          const currentVal = nextStats[ach.targetStat];
          if (currentVal >= ach.targetValue) {
            nextAchievements.push(ach.id);
            newlyUnlocked.push(ach.title);
            pointsToGain += ach.rewardPoints;
          }
        }
      });

      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedAchievements((current) => [...current, ...newlyUnlocked]);
      }

      const next = {
        ...prev,
        points: prev.points + pointsToGain,
        unlockedAchievementIds: nextAchievements,
        stats: nextStats
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Clear achievement popup trigger
  const clearNewAchievements = useCallback(() => {
    setNewlyUnlockedAchievements([]);
  }, []);

  return {
    saveData,
    addPoints,
    unlockAvatar,
    setActiveAvatar,
    incrementStat,
    newlyUnlockedAchievements,
    clearNewAchievements
  };
};
export type UseSaveDataReturn = ReturnType<typeof useSaveData>;
