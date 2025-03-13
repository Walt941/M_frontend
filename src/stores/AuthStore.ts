import { create } from "zustand";
import LocalService from "../services/local_service";

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
}


export const useAuthStore = create<AuthStore>((set, get) => ({
    userData: null,
    isAuthenticated: false,
    accessToken: null,
    fetching: false,

    
    getUserData: () => {
        return get().userData;
    },

   
    setUserData: (userAndToken) =>
        set({
            accessToken: userAndToken.token,
            userData: userAndToken.user,
            isAuthenticated: true,
        }),

   
    login: (userAndToken) => {
        get().setFetching(true);
        localService.setAccessToken(userAndToken.token);
        localService.setItem("user", JSON.stringify(userAndToken.user));
        get().setUserData(userAndToken);
        get().setFetching(false);
    },

    
    logout: () => {
        console.log("Cerrando sesión...");
        localService.removeAccessToken();
        set({
            accessToken: null,
            userData: null,
            isAuthenticated: false,
        });
        window.location.href = "/login";
        localService.removeItem("user");
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
}));