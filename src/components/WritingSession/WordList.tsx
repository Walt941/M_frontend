import React from 'react';
import { Word } from '../../types/type';

interface WordListProps {
  words: Word[];
  currentWordIndex: number;
}

const WordList: React.FC<WordListProps> = ({ words, currentWordIndex }) => {
  return (
    <div className="flex gap-4 mb-4 overflow-x-hidden w-full flex-wrap justify-center">
      {words.map((word, index) => (
        <span
          key={index}
          className={`px-4 py-2 text-lg rounded-full ${
            index === currentWordIndex
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {word.word}
        </span>
      ))}
    </div>
  );
};

export default WordList;