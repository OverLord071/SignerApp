import React, {FC} from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    isAdmin?: boolean;
    children: React.ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({isAuthenticated, isAdmin, children}) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (isAdmin === true && !isAdmin) {
        // Si se requiere admin pero el usuario no es admin
        return <Navigate to="/documentos" />;
    }

    return children;
};

export default ProtectedRoute;