import React from 'react';

interface WordDisplayProps {
  word: string;
  letterStatus: Record<number, boolean>;
  currentLetterIndex: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  letterStatus,
  currentLetterIndex
}) => {
  return (
    <div className="text-3xl font-mono tracking-wide my-6">
      {word.split("").map((letter, index) => {
        let className = "px-0.5";
        if (index < currentLetterIndex) {
          className += letterStatus[index] ? " text-green-500" : " text-red-500";
        }
        return (
          <span key={index} className={className}>
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export default WordDisplay;