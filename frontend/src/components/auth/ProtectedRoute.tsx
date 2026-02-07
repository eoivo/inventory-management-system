import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store';

export function ProtectedRoute() {
    const { token } = useAppSelector((state: RootState) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
