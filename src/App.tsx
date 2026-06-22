import { useState } from 'react';
import { Portal } from './components/Portal';
import { GameContainer } from './components/GameContainer';

function App() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const handleSelectGame = (gameId: string) => {
    setActiveGameId(gameId);
  };

  const handleBackToPortal = () => {
    setActiveGameId(null);
  };

  return (
    <>
      {activeGameId ? (
        <GameContainer gameId={activeGameId} onBackToPortal={handleBackToPortal} />
      ) : (
        <Portal onSelectGame={handleSelectGame} />
      )}
    </>
  );
}

export default App;
