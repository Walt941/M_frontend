import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router";


export const useAuthGuard = (): void => {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login"); 
        }
    }, [isAuthenticated, navigate]);
};