import axios, { InternalAxiosRequestConfig } from "axios";
import LocalService from "./local_service";
import { getEnv } from "./env_service";
import { useAuthStore } from "../stores/AuthStore";

const localServices = new LocalService();
const apiUrl = getEnv().publicApiUrl + "/api";

const RestApiClient = axios.create({
    baseURL: `${apiUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

RestApiClient.interceptors.request.use(
    async function (req: InternalAxiosRequestConfig<unknown>) {
        const token = await localServices.getAccessToken();

        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
    },
    async function (error) {
        console.log("Interceptor request error", error);
        return Promise.reject(error);
    }
);

RestApiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const logout = useAuthStore.getState().logout;
            if (error.config.url !== "/login" && error.config.url !== "/forgot-password") {
                logout();
            }
            console.error("Token inválido.");
        }
        return Promise.reject(error);
    }
);

export default RestApiClient;
