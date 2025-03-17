import { useNavigate } from "react-router";
import RestApiClient from '../services/api'; 
import { useAuthStore } from "../stores/AuthStore"; 
import { useAuthGuard } from "../Hooks/useAuthGuard";

export default function TypingPractice() {
  useAuthGuard();
  const navigate = useNavigate();
  const { userData } = useAuthStore(); 

  const handleStartSession = async () => {
    try {
      if (!userData || !userData.id) {
        console.error("Usuario no autenticado o ID no disponible");
        return;
      }

      const userId = userData.id; 

     
      const response = await RestApiClient.post('/sessions', { userId });

      if (response.status === 201) {
       
        navigate('/writing', { state: { sessionId: response.data.sessionId } });
      } else {
        console.error('Error al crear la sesión:', response.data.message);
      }
    } catch (error) {
      console.error('Error al crear la sesión:', error);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <div className="bg-main-secondary shadow-xl border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl text-text-primary font-bold">Práctica de Mecanografía</h1>
          <p className="text-gray-600">
            Escribe las palabras que aparecen. Las letras correctas se mostrarán en verde y las incorrectas en rojo.
          </p>
        </div>
        <div>
          <div className="flex flex-col items-center justify-center py-10">
            <p className="mb-6 text-center text-text-primary">Haz clic en el botón para comenzar una nueva sesión de mecanografía.</p>
            <button
              onClick={handleStartSession}
              className="bg-main-primary text-text-secondary px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Comenzar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}