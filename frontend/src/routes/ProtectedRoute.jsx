import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');

    let user = null;
    try {
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch {
        user = null;
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}