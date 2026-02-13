import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/customer/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Register';
import Cart from './pages/customer/Cart'
import MenuPage from './pages/customer/MenuPage';
import Checkout from './pages/customer/Checkout'
import Profile from './pages/customer/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import ReservePage from './pages/customer/ReservePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Customer Routes */}
        <Route
          path="/cart"
          element={
            // <ProtectedRoute>
            <Cart />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            // <ProtectedRoute>
            <MenuPage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            // <ProtectedRoute>
            <Checkout />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            // <ProtectedRoute>
            <Profile />
            // </ProtectedRoute>
          }
        />

        <Route path="/reserve" element={<ReservePage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminDashboard />
            // <ProtectedRoute role="admin">
            //   <AdminDashboard />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
