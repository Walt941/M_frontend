import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import toast from 'react-hot-toast';
import Modal from '../components/modals/modal';
import WordList from '../components/WritingSession/WordList';
import WordDisplay from '../components/WritingSession/WordDisplay';
import InputThemed from "../components/inputs/InputThemed";
import SessionStats from '../components/WritingSession/SessionStats';
import { TypingStats, Word, LetterData } from '../types/type';
import useApiRequest from '../Hooks/useApiRequest';
import ActionButton from '../components/ActionButton';

interface SessionStatsResponse extends TypingStats {
  isCompleted: boolean;
  totalWords: number;
  writtenWords: number;
}

export default function WritingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = location.state?.sessionId;
  const { makeRequest, isLoading } = useApiRequest();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsToType, setWordsToType] = useState<Word[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [letterStatus, setLetterStatus] = useState<Record<number, boolean>>({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [stats, setStats] = useState<SessionStatsResponse>({
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    correctWords: 0,
    incorrectWords: 0,
    totalWords: 0,
    writtenWords: 0,
    startTime: null,
    endTime: null,
    wpm: 0,
    accuracy: 0,
    isCompleted: false,
  });

  const [startTime, setStartTime] = useState<number | null>(null);
  const [lettersBuffer, setLettersBuffer] = useState<LetterData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSessionWords = async () => {
    await makeRequest({
      url: `/sessions/${sessionId}/words`,
      method: 'get',
      onSuccess: (response) => {
        if (Array.isArray(response.words)) {
          setWordsToType(response.words);
          setIsSessionActive(true);
          setStats(prev => ({
            ...prev,
            totalWords: response.words.length,
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
      },
      onError: (error) => {
        console.error("Error al obtener las palabras:", error);
        toast.error("Error al obtener las palabras");
      }
    });
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionWords();
    } else {
      toast.error("No se encontró el ID de la sesión");
      navigate("/home");
    }
  }, [sessionId]);

  const sendLettersToBackend = async (letters: LetterData[], wordId: string, sessionId: string) => {
    await makeRequest({
      url: '/letters/batch',
      method: 'post',
      data: {
        wordId,
        letters,
        sessionId,
      },
      onSuccess: () => {
        console.log("Letras enviadas correctamente");
      },
      onError: (error) => {
        console.error("Error al enviar las letras:", error);
      }
    });
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSessionActive || isSessionComplete || isLoading) return;

    const value = e.target.value;
    const currentWord = wordsToType[currentWordIndex].word;

    if (value.length === currentWord.length) {
      const isWordCorrect = value === currentWord;
      const lastLetter = value[value.length - 1];
      const isLastLetterCorrect = lastLetter === currentWord[currentWord.length - 1];
      const endTime = Date.now();
      const timeTaken = startTime ? endTime - startTime : 0;

      const updatedLettersBuffer = [
        ...lettersBuffer,
        {
          letter: lastLetter,
          isError: !isLastLetterCorrect,
          position: value.length - 1,
          timeTaken,
        },
      ];

      const currentWordId = wordsToType[currentWordIndex].id;
      await sendLettersToBackend(updatedLettersBuffer, currentWordId, sessionId);
      setLettersBuffer([]);

      setStats(prev => ({
        ...prev,
        correctWords: prev.correctWords + (isWordCorrect ? 1 : 0),
        incorrectWords: prev.incorrectWords + (isWordCorrect ? 0 : 1),
        correctChars: prev.correctChars + (isWordCorrect ? currentWord.length : 0),
        incorrectChars: prev.incorrectChars + (isWordCorrect ? 0 : 1),
        writtenWords: prev.writtenWords + 1,
      }));

      if (currentWordIndex < wordsToType.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
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

        if (isCorrect) correctCount++;
        else incorrectCount++;

        const endTime = Date.now();
        const timeTaken = startTime ? endTime - startTime : 0;

        setLettersBuffer(prev => [
          ...prev,
          {
            letter: value[i],
            isError: !isCorrect,
            position: i,
            timeTaken,
          },
        ]);

        setStartTime(Date.now());
      }

      setLetterStatus(newLetterStatus);
      setCurrentLetterIndex(value.length);

      setStats(prev => ({
        ...prev,
        correctChars: prev.correctChars + correctCount,
        incorrectChars: prev.incorrectChars + incorrectCount,
        totalChars: prev.totalChars + correctCount + incorrectCount,
      }));
    }
  };

  const endSession = async () => {
    setIsSessionActive(false);
    setIsSessionComplete(true);

    const currentWordId = wordsToType[currentWordIndex].id;

    if (lettersBuffer.length > 0) {
      await sendLettersToBackend(lettersBuffer, currentWordId, sessionId);
      setLettersBuffer([]);
    }

    await makeRequest({
      url: `/sessions/${sessionId}/calculate-stats`,
      method: 'post',
      data: {},
      onSuccess: (response: SessionStatsResponse) => {
        setStats(prev => ({
          ...prev,
          endTime: Date.now(),
          correctWords: response.correctWords,
          incorrectWords: response.incorrectWords,
          correctChars: response.correctChars,
          incorrectChars: response.incorrectChars,
          accuracy: response.accuracy,
          isCompleted: response.isCompleted,
          totalWords: response.totalWords,
          writtenWords: response.writtenWords,
        }));

        if (response.isCompleted) {
          toast.success("¡Sesión completada con éxito!");
        } else {
          toast("Sesión no completada", {
            icon: 'ℹ️',
            duration: 4000,
          });
        }
      },
      onError: (error) => {
        console.error("Error al calcular las estadísticas:", error);
      }
    });
  };

  const handleCloseModal = () => {
    navigate("/home");
  };

  useEffect(() => {
    if (isSessionActive && inputRef.current) {
      inputRef.current.focus();
      setStartTime(Date.now());
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
            <Modal
              isOpen={isSessionComplete}
              onClose={handleCloseModal}
              stats={{
                correctWords: stats.correctWords,
                incorrectWords: stats.incorrectWords,
                correctChars: stats.correctChars,
                incorrectChars: stats.incorrectChars,
                accuracy: stats.accuracy,
                isCompleted: stats.isCompleted,
              }}
            />
          ) : (
            <div className="flex flex-col items-center">
              <WordList words={wordsToType} currentWordIndex={currentWordIndex} />
              <WordDisplay
                word={wordsToType[currentWordIndex]?.word || ""}
                letterStatus={letterStatus}
                currentLetterIndex={currentLetterIndex}
              />
              <InputThemed
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Escribe aquí..."
                className="w-full p-2 border rounded-md text-center text-lg font-mono"
                
              />
              <SessionStats
                currentWordIndex={currentWordIndex}
                totalWords={wordsToType.length}
              />
            </div>
          )}
        </div>
        {isSessionActive && (
          <div className="flex justify-center mt-6">
            <ActionButton
              onClick={endSession}
              text="Terminar Sesión"
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}