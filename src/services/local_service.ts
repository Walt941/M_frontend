import {
    ACCESS_TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY,
    SESSION_DATA_STORAGE_KEY,
} from "../constants";

export default class LocalService {
    
    setItem = (item: string, content: string) => {
        localStorage.setItem(item, content);
    };

    
    getItem = (item: string): string | null => {
        return localStorage.getItem(item);
    };

   
    removeItem = (item: string) => {
        localStorage.removeItem(item);
    };

    
    getAccessToken = (): string | null => {
        return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    };

   
    setAccessToken = (accessToken: string) => {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    };

    
    removeAccessToken = () => {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    };

    
    getRefreshToken = (): string | null => {
        return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    };

    
    setRefreshToken = (refreshToken: string) => {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    };

   
    removeRefreshToken = () => {
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    };

   
    getSessionData = (): string | null => {
        return localStorage.getItem(SESSION_DATA_STORAGE_KEY);
    };

   
    setSessionData = (sessionData: string) => {
        localStorage.setItem(SESSION_DATA_STORAGE_KEY, sessionData);
    };

   
    removeSessionData = () => {
        localStorage.removeItem(SESSION_DATA_STORAGE_KEY);
    };

   
    clearStorage = () => {
        localStorage.clear();
    };
}