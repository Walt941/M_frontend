import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { FaArrowRight } from "react-icons/fa";
import useApiRequest from '../hooks/useApiRequest';
import ActionButton from '../components/ActionButton';

export default function TypingPractice() {
    const navigate = useNavigate();
    const { userData } = useAuthStore();
    const { makeRequest, isLoading } = useApiRequest();

    const handleStartSession = async () => {
        if (!userData || !userData.id) {
            console.error("Usuario no autenticado o ID no disponible");
            return;
        }

        await makeRequest({
            url: '/sessions',
            method: 'post',
            data: { userId: userData.id },
            onSuccess: (responseData) => {
                navigate('/writing', { state: { sessionId: responseData.sessionId } });
            },
            successMessage: '¡Sesión creada! Redirigiendo...',
            onError: (error) => {
                console.error('Error al crear la sesión:', error);
            },
        });
    };

    return (
        <div className="container max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className={`${userData ? "bg-main-secondary shadow-xl border border-gray-200 rounded-lg p-6" : ""}`}>
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
                            <ActionButton
                                onClick={handleStartSession}
                                text={isLoading ? 'Cargando...' : 'Comenzar Sesión'}
                                color="primary"
                                disabled={isLoading}
                                className="mb-8"
                            />
                        </>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center w-full">
                            <div className="flex-1 md:mr-8 text-center md:text-left animate-left-to-right">
                                <h1 className="text-5xl text-text-primary font-bold ">Bienvenido a MecaType</h1>
                                <p className="mt-6 mb-8 text-gray-600 ">
                                    ¡Bienvenido! Antes de comenzar, por favor inicie sesión.
                                </p>
                                <ActionButton
                                    onClick={() => navigate('/login')}
                                    text={
                                        <span className="flex items-center justify-center gap-2 ">
                                            Ir a Login <FaArrowRight className="text-text-secondary" />
                                        </span>
                                    }
                                    color="primary"
                                    className=" mx-auto md:mx-0"
                                />
                            </div>

                            <div className="flex-1 hidden md:block">
                                <img
                                    src={"/typing.png"}
                                    alt="MecaType"
                                    className="object-cover w-full h-54 rounded-lg animate-right-to-left"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}