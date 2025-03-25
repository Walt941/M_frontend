export interface TypingStats {
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    correctWords: number;
    incorrectWords: number;
    totalWords: number;
    startTime: number | null;
    endTime: number | null;
    wpm: number;
    accuracy: number;
  }
  
  export interface Word {
    id: string;
    word: string; 
  }
  
  export interface LetterData {
    letter: string;
    isError: boolean;
    position: number;
    timeTaken: number;
  }