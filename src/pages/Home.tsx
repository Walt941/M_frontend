import { useNavigate } from "react-router";
import RestApiClient from '../services/api'; 
import { useAuthStore } from "../stores/AuthStore"; 


export default function TypingPractice() {
  
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
        <div>
          <div className="flex flex-col items-center justify-center py-10">
            {userData ? (
              <>
                <div className="mb-6"> 
                  <h1 className="text-4xl text-text-primary font-bold">Práctica de Mecanografía</h1>
                  <p className="mt-6 text-gray-600"> 
                    Escriba las palabras que aparecerán a continuación. Las letras correctas se mostrarán en verde y las incorrectas en rojo.
                  </p>
                </div>
                <p className="mb-8 text-center text-text-primary"> 
                  ¡Bienvenido, <span className="font-bold">{userData.username}</span>! Haz clic para comenzar una nueva sesión.
                </p>
                <button
                  onClick={handleStartSession}
                  className="bg-main-primary text-text-secondary px-4 py-2 rounded-md hover:bg-blue-600 mb-8" 
                >
                  Comenzar Sesión
                </button>
              </>
            ) : (
              <>
                <div className="mb-8"> 
                  <h1 className="text-5xl text-text-primary font-bold">Bienvenido a MecaType</h1>
                </div>
                <p className="mb-8 text-center text-text-primary"> 
                  ¡Bienvenido! Para comenzar, necesitas iniciar sesión.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-main-primary text-text-secondary px-4 py-2 rounded-md hover:bg-blue-600 mb-8" 
                >
                  Ir a Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
