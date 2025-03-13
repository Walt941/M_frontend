import { ReactElement } from "react";
import { useAuthStore } from "../../stores/AuthStore";
import { Navigate } from "react-router";

export const ProtectedRoute = ({
    children,
}: {
    children: ReactElement;
}) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return children;
    }
    return <Navigate to="/login" />;
};
