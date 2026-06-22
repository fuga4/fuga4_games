import React from 'react';
import { Aquarium } from './games/Aquarium/Aquarium';
import { TidyUp } from './games/TidyUp/TidyUp';

interface GameContainerProps {
  gameId: string;
  onBackToPortal: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ gameId, onBackToPortal }) => {
  switch (gameId) {
    case 'aquarium':
      return <Aquarium onBackToPortal={onBackToPortal} />;
    case 'tidyup':
      return <TidyUp onBackToPortal={onBackToPortal} />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <p className="text-red-400 font-bold mb-4">お探しのゲームが見つかりませんでした。</p>
          <button 
            onClick={onBackToPortal}
            className="tap-button px-6 py-2.5"
          >
            ポータルに戻る
          </button>
        </div>
      );
  }
};
