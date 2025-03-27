import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router";


export const usePublicGuard = (): void => {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home"); 
        }
    }, [isAuthenticated, navigate]);
};