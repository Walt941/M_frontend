import React from 'react';

interface SessionStatsProps {
  currentWordIndex: number;
  totalWords: number;
}

const SessionStats: React.FC<SessionStatsProps> = ({
  currentWordIndex,
  totalWords
}) => {
  return (
    <p className="mt-4 text-sm text-gray-600">
      Palabra {currentWordIndex + 1} de {totalWords}
    </p>
  );
};

export default SessionStats;