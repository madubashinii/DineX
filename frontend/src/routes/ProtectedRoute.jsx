import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, role }) {
    const user = JSON.parse(localStorage.getItem('user'))

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Role-based protection
    if (role && user.role !== role) {
        return <Navigate to="/" replace />
    }

    return children
}
