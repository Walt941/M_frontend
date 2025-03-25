import React from "react";
import ActionButton from "../ActionButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    correctWords: number;
    incorrectWords: number;
    correctChars: number;
    incorrectChars: number;
    accuracy: number;
    isCompleted: boolean;
    
  };
 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, stats}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {stats.isCompleted ? '✅ Sesión Completada' : '⚠️ Sesión Incompleta'}
        </h2>

        <div className="flex flex-col items-center mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="h-4 rounded-full bg-main-primary" 
              style={{ width: `${stats.accuracy}%` }}
            ></div>
          </div>
          <p className="font-bold">Precisión: {stats.accuracy}%</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-bold">Palabras correctas:</p>
            <p>{stats.correctWords}</p>
          </div>
          <div>
            <p className="font-bold">Palabras incorrectas:</p>
            <p>{stats.incorrectWords}</p>
          </div>
          <div>
            <p className="font-bold">Caracteres correctos:</p>
            <p>{stats.correctChars}</p>
          </div>
          <div>
            <p className="font-bold">Caracteres incorrectos:</p>
            <p>{stats.incorrectChars}</p>
          </div>
        </div>

        <ActionButton
          onClick={onClose}
          text="Cerrar"
          color="primary"
          fullWidth
        />
      </div>
    </div>
  );
};

export default Modal;