import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import RestApiClient from '../services/api'; 
import toast from 'react-hot-toast';

interface TypingStats {
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  correctWords: number;
  totalWords: number;
  startTime: number | null;
  endTime: number | null;
}

export default function WritingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = location.state?.sessionId; 

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsToType, setWordsToType] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [letterStatus, setLetterStatus] = useState<Record<number, boolean>>({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [stats, setStats] = useState<TypingStats>({
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    correctWords: 0,
    totalWords: 0,
    startTime: null,
    endTime: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);

 
  const fetchSessionWords = async () => {
    try {
      const response = await RestApiClient.get(`/sessions/${sessionId}/words`);

      if (response.status === 200 && Array.isArray(response.data.words)) {
        setWordsToType(response.data.words);
        setIsSessionActive(true);
        setStats((prev) => ({
          ...prev,
          totalWords: response.data.words.length,
          startTime: Date.now(),
        }));

       
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      } else {
        toast.error("Error al obtener las palabras de la sesión");
      }
    } catch (error) {
      console.error("Error al obtener las palabras:", error);
      toast.error("Error al obtener las palabras");
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionWords();
    } else {
      toast.error("No se encontró el ID de la sesión");
      navigate("/home");
    }
  }, [sessionId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSessionActive || isSessionComplete) return;

    const value = e.target.value;
    const currentWord = wordsToType[currentWordIndex];

    if (value.length === currentWord.length) {
      const isWordCorrect = value === currentWord;

      setStats((prev) => ({
        ...prev,
        correctWords: prev.correctWords + (isWordCorrect ? 1 : 0),
      }));

      if (currentWordIndex < wordsToType.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentLetterIndex(0);
        setUserInput("");
        setLetterStatus({});
      } else {
        endSession();
      }
    } else {
      setUserInput(value);

      const newLetterStatus: Record<number, boolean> = {};
      let correctCount = 0;
      let incorrectCount = 0;

      for (let i = 0; i < value.length; i++) {
        const isCorrect = i < currentWord.length && value[i] === currentWord[i];
        newLetterStatus[i] = isCorrect;

        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }

      setLetterStatus(newLetterStatus);
      setCurrentLetterIndex(value.length);

      setStats((prev) => ({
        ...prev,
        correctChars: prev.correctChars + correctCount,
        incorrectChars: prev.incorrectChars + incorrectCount,
        totalChars: prev.totalChars + correctCount + incorrectCount,
      }));
    }
  };

  const endSession = () => {
    setIsSessionActive(false);
    setIsSessionComplete(true);
    setStats((prev) => ({
      ...prev,
      endTime: Date.now(),
    }));
  };

  const calculateWPM = () => {
    if (!stats.startTime || !stats.endTime) return 0;
    const timeInMinutes = (stats.endTime - stats.startTime) / 60000;
    return Math.round(stats.correctWords / timeInMinutes);
  };

  const calculateAccuracy = () => {
    if (stats.totalChars === 0) return 0;
    return Math.round((stats.correctChars / stats.totalChars) * 100);
  };

  const renderWord = () => {
    if (!wordsToType.length) return null;

    const currentWord = wordsToType[currentWordIndex];

    return (
      <div className="text-3xl font-mono tracking-wide my-6">
        {currentWord.split("").map((letter, index) => {
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

  useEffect(() => {
    if (isSessionActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSessionActive]);

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <div className="bg-white shadow-xl border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Sesión de Escritura</h1>
          <p className="text-gray-600">
            Escribe las palabras que aparecen. Las letras correctas se mostrarán en verde y las incorrectas en rojo.
          </p>
        </div>
        <div>
          {isSessionComplete ? (
            <div className="flex flex-col items-center justify-center py-10">
              <h2 className="text-2xl font-bold mb-4">Resultados</h2>
              <div className="grid gap-4 text-center">
                <div>
                  <h3 className="text-xl font-bold">{calculateWPM()}</h3>
                  <p className="text-gray-600">Palabras por minuto</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{calculateAccuracy()}%</h3>
                  <p className="text-gray-600">Precisión</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{stats.correctWords}</h3>
                  <p className="text-gray-600">Palabras correctas</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-blue-600"
              >
                Volver al Inicio
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Contenedor de palabras */}
              <div className="flex gap-4 mb-4 overflow-x-hidden w-full flex-wrap justify-center">
                {wordsToType.map((word, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 text-lg rounded-full ${
                      index === currentWordIndex
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>

              <div className="w-full text-center">
                {renderWord()}

                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md text-center text-lg font-mono"
                  placeholder="Escribe aquí..."
                  autoFocus
                />

                <p className="mt-4 text-sm text-gray-600">
                  Palabra {currentWordIndex + 1} de {wordsToType.length}
                </p>
              </div>
            </div>
          )}
        </div>
        {isSessionActive && (
          <div className="flex justify-center mt-6">
            <button
              onClick={endSession}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Terminar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}