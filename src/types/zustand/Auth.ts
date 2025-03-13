import { User } from "../models/User";

export type AuthStore = {
    userData: User | null; 
    isAuthenticated: boolean; 
    accessToken: string | null; 
    fetching: boolean; 
    getUserData: () => User | null; 
    setUserData: (userAndToken: { token: string; user: User }) => void; 
    login: (userAndToken: { token: string; user: User }) => void; 
    logout: () => void; 
    getUser: () => User | null; 
    setFetching: (fetchValue: boolean) => void; 
    setUserName: (newName: string) => void; 
};