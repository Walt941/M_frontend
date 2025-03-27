import { create } from "zustand";
import { persist } from "zustand/middleware";
import LocalService from "../services/localService";

const localService = new LocalService();

interface AuthStore {
    userData: any | null; 
    isAuthenticated: boolean;
    accessToken: string | null;
    fetching: boolean;
    getUserData: () => any | null;
    setUserData: (userAndToken: { user: any; token: string }) => void;
    login: (userAndToken: { user: any; token: string }) => void;
    logout: () => void;
    getUser: () => any | null;
    setFetching: (fetchValue: boolean) => void;
    setUserName: (newName: string) => void;
    initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            userData: null,
            isAuthenticated: false,
            accessToken: null,
            fetching: false,

           
            initializeAuth: async () => {
                const token = localService.getAccessToken();
                const user = localService.getItem("user");
                
                if (token && user) {
                    try {
                     
                        set({
                            accessToken: token,
                            userData: JSON.parse(user),
                            isAuthenticated: true
                        });
                    } catch (error) {
                        console.error("Error al inicializar autenticación:", error);
                        get().logout();
                    }
                }
            },

            getUserData: () => {
                return get().userData;
            },

            setUserData: (userAndToken) => {
                localService.setAccessToken(userAndToken.token);
                localService.setItem("user", JSON.stringify(userAndToken.user));
                set({
                    accessToken: userAndToken.token,
                    userData: userAndToken.user,
                    isAuthenticated: true,
                });
            },

            login: (userAndToken) => {
                get().setFetching(true);
                get().setUserData(userAndToken);
                get().setFetching(false);
            },

            logout: () => {
                console.log("Cerrando sesión...");
                localService.removeAccessToken();
                localService.removeItem("user");
                set({
                    accessToken: null,
                    userData: null,
                    isAuthenticated: false,
                    fetching: false
                });
                window.location.href = "/login";
            },

            getUser: () => {
                return get().userData;
            },

            setFetching: (fetchValue) => {
                set({
                    fetching: fetchValue,
                });
            },

            setUserName: (newName) => {
                const user = get().userData;
                if (user) {
                    user.name = newName;
                    localService.setItem("user", JSON.stringify(user));
                    set({
                        userData: user,
                    });
                }
            },
        }),
        {
            name: "auth-storage", 
            partialize: (state) => ({ 
                isAuthenticated: state.isAuthenticated,
                userData: state.userData,
                accessToken: state.accessToken
            }),
        }
    )
);

export const initializeAuthState = async () => {
    await useAuthStore.getState().initializeAuth();
};