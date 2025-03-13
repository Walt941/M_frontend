
  export type User = {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    progress?: {
      totalCorrectChars: number;
      totalIncorrectChars: number;
      totalCorrectWords: number;
      totalWords: number;
    };
  };