import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Validation helpers
const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
};

const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') return true; // Phone is optional
    const phoneRegex = /^[\d\s()+-]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7;
};

export default function ProfilePage() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
    });

    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
    });

    const [reservations, setReservations] = useState([]);
    const [editingReservationId, setEditingReservationId] = useState(null);
    const [editReservationForm, setEditReservationForm] = useState({
        date: '',
        time: '',
        guests: 1,
        specialRequests: ''
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [reviews, setReviews] = useState([]);

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const now = new Date();
    const upcomingReservations = reservations.filter((r) => {
        const dateOnly = new Date(r.date);
        return dateOnly >= new Date(now.toDateString()) && r.status !== 'Cancelled';
    });
    const pastReservations = reservations.filter((r) => {
        const dateOnly = new Date(r.date);
        return dateOnly < new Date(now.toDateString()) || r.status === 'Cancelled';
    });

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setErrorMessage('');

            const [profileRes, reservationsRes, ordersRes, reviewsRes] = await Promise.all([
                API.get('/users/profile'),
                API.get('/reservations'),
                API.get('/orders'),
                API.get('/reviews/me')
            ]);

            const user = profileRes.data;
            setUserInfo({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                zipCode: user.zipCode || '',
            });

            setEditForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                zipCode: user.zipCode || '',
            });

            setReservations(reservationsRes.data || []);
            setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
            setReviews(reviewsRes.data || []);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleEditToggle = () => {
        if (isEditing) {
            setEditForm({ ...userInfo });
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setFieldErrors({});

        // Client-side validation
        const errors = {};

        if (!validateName(editForm.name)) {
            errors.name = 'Name must be between 2 and 100 characters';
        }

        if (!validatePhone(editForm.phone)) {
            errors.phone = 'Invalid phone number. Must contain at least 7 digits';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setErrorMessage('Please fix the errors below');
            return;
        }

        try {
            await API.put('/users/profile', {
                name: editForm.name,
                phone: editForm.phone,
                address: editForm.address,
                city: editForm.city,
                zipCode: editForm.zipCode,
            });

            setUserInfo({ ...editForm });
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const handleCancelReservation = async (id) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        try {
            await API.delete(`/reservations/${id}`);
            setSuccessMessage('Reservation cancelled successfully');
            fetchProfileData();
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to cancel reservation');
        }
    };

    const startEditReservation = (reservation) => {
        setEditingReservationId(reservation._id);
        setEditReservationForm({
            date: new Date(reservation.date).toISOString().slice(0, 10),
            time: reservation.time || '',
            guests: reservation.guests || 1,
            specialRequests: reservation.specialRequests || ''
        });
    };

    const handleReservationChange = (e) => {
        const { name, value } = e.target;
        setEditReservationForm(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
    };

    const saveReservationEdit = async (id) => {
        // basic validation
        if (!editReservationForm.date) {
            setErrorMessage('Date is required');
            return;
        }
        if (!editReservationForm.time) {
            setErrorMessage('Time is required');
            return;
        }
        if (!editReservationForm.guests || editReservationForm.guests < 1) {
            setErrorMessage('Guests must be at least 1');
            return;
        }

        try {
            setErrorMessage('');
            await API.put(`/reservations/${id}`, {
                date: editReservationForm.date,
                time: editReservationForm.time,
                guests: editReservationForm.guests,
                specialRequests: editReservationForm.specialRequests
            });
            setSuccessMessage('Reservation updated');
            setEditingReservationId(null);
            fetchProfileData();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to update reservation');
        }
    };

    const cancelEditReservation = () => {
        setEditingReservationId(null);
        setEditReservationForm({ date: '', time: '', guests: 1, specialRequests: '' });
        setErrorMessage('');
    };

    return (
        <div className="min-h-screen bg-black">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Sora:wght@400;500;600&display=swap');
                
                :root {
                    --primary: #fbbf24;
                    --primary-dark: #d97706;
                    --primary-light: #fcd34d;
                }

                * {
                    font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .serif-title {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                .glass-card {
                    background: linear-gradient(135deg, rgba(24, 24, 27, 0.8) 0%, rgba(39, 39, 42, 0.6) 100%);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(251, 191, 36, 0.15);
                }

                .glass-card:hover {
                    border-color: rgba(251, 191, 36, 0.25);
                    background: linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(39, 39, 42, 0.7) 100%);
                }

                .btn-primary {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: #000;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 10px 25px rgba(251, 191, 36, 0.15);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px rgba(251, 191, 36, 0.25);
                    background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%);
                }

                .btn-primary:active {
                    transform: translateY(0);
                }

                .btn-secondary {
                    background: rgba(39, 39, 42, 0.8);
                    color: #d1d5db;
                    border: 1.5px solid rgba(251, 191, 36, 0.25);
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .btn-secondary:hover {
                    background: rgba(39, 39, 42, 1);
                    border-color: rgba(251, 191, 36, 0.4);
                    color: #f3f4f6;
                }

                .input-field {
                    background: rgba(0, 0, 0, 0.5);
                    border: 1.5px solid rgba(251, 191, 36, 0.2);
                    color: #fff;
                    transition: all 0.3s ease;
                    border-radius: 0.5rem;
                    padding: 0.875rem 1rem;
                }

                .input-field:focus {
                    outline: none;
                    border-color: rgba(251, 191, 36, 0.5);
                    background: rgba(0, 0, 0, 0.7);
                    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
                }

                .input-field::placeholder {
                    color: #6b7280;
                }

                .input-field:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .section-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent);
                }

                .status-badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border: 1px solid;
                    transition: all 0.3s ease;
                }

                .avatar {
                    width: 6rem;
                    height: 6rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #000;
                    box-shadow: 0 20px 50px rgba(251, 191, 36, 0.2);
                    margin: 0 auto;
                }

                .fade-in {
                    animation: fadeIn 0.6s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .alert {
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px solid rgba(251, 191, 36, 0.1);
                    transition: all 0.2s ease;
                }

                .info-row:last-child {
                    border-bottom: none;
                }

                .info-row:hover {
                    background: rgba(251, 191, 36, 0.05);
                }

                .reservation-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .reservation-card:hover {
                    transform: translateY(-2px);
                }

                .order-card {
                    transition: all 0.3s ease;
                }

                .order-card:hover {
                    transform: translateY(-1px);
                    border-color: rgba(251, 191, 36, 0.35);
                }

                .icon-accent {
                    color: #fbbf24;
                }
            `}</style>

            <Header />

            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="serif-title text-5xl md:text-6xl text-white mb-3">My Profile</h1>
                    <p className="text-lg text-gray-400 font-light tracking-wide">Manage your account, reservations & orders</p>
                </div>
            </section>

            {loading && (
                <div className="text-center py-12 px-6">
                    <div className="inline-flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                        <p className="text-gray-400">Loading your profile...</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="px-6 pt-6 alert">
                    <div className="max-w-5xl mx-auto p-4 rounded-lg bg-red-500/10 text-red-300 border border-red-500/30 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                        </svg>
                        <p>{errorMessage}</p>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="px-6 pt-6 alert">
                    <div className="max-w-5xl mx-auto p-4 rounded-lg bg-green-500/10 text-green-300 border border-green-500/30 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                        <p>{successMessage}</p>
                    </div>
                </div>
            )}

            <section className="py-16 px-6 bg-black">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar - User Card */}
                        <div className="lg:col-span-1 fade-in">
                            <div className="glass-card rounded-xl p-8 sticky top-24">
                                <div className="text-center mb-8">
                                    <div className="avatar mb-6">
                                        {userInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="serif-title text-2xl text-white mb-2">{userInfo.name}</h2>
                                    <p className="text-sm text-gray-400 break-all">{userInfo.email}</p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleEditToggle}
                                        className="btn-primary w-full py-3 px-4 rounded-lg"
                                    >
                                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-secondary w-full py-3 px-4 rounded-lg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Basic Information */}
                            <div className="glass-card rounded-xl p-8 fade-in">
                                <h2 className="serif-title text-2xl text-white mb-8 flex items-center gap-3">
                                    Basic Information
                                </h2>

                                {isEditing ? (
                                    <form onSubmit={handleSave} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleInputChange}
                                                required
                                                className={`input-field w-full ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                            />
                                            {fieldErrors.name && (
                                                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                                    <span>⚠</span> {fieldErrors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                disabled
                                                className="input-field w-full opacity-60 cursor-not-allowed"
                                            />
                                            <p className="text-gray-500 text-xs mt-2">Email cannot be changed</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={editForm.phone}
                                                onChange={handleInputChange}
                                                className={`input-field w-full ${fieldErrors.phone ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            {fieldErrors.phone && (
                                                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                                    <span>⚠</span> {fieldErrors.phone}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={editForm.address}
                                                onChange={handleInputChange}
                                                className="input-field w-full"
                                                placeholder="123 Main Street"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={editForm.city}
                                                    onChange={handleInputChange}
                                                    className="input-field w-full"
                                                    placeholder="New York"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={editForm.zipCode}
                                                    onChange={handleInputChange}
                                                    className="input-field w-full"
                                                    placeholder="10001"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn-primary w-full py-3 px-4 rounded-lg mt-2"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-0">
                                        <div className="info-row">
                                            <span className="text-gray-400 font-medium">Name</span>
                                            <span className="text-white">{userInfo.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="text-gray-400 font-medium">Email</span>
                                            <span className="text-white">{userInfo.email}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="text-gray-400 font-medium">Phone</span>
                                            <span className="text-white">{userInfo.phone || '—'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="text-gray-400 font-medium">Address</span>
                                            <span className="text-white">{userInfo.address || '—'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="text-gray-400 font-medium">City</span>
                                            <span className="text-white">{userInfo.city || '—'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="text-gray-400 font-medium">ZIP Code</span>
                                            <span className="text-white">{userInfo.zipCode || '—'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Reservations */}
                            <div className="glass-card rounded-xl p-8 fade-in">
                                <h2 className="serif-title text-2xl text-white mb-8 flex items-center gap-3">
                                    Upcoming Reservations
                                </h2>

                                {upcomingReservations.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingReservations.map((reservation) => (
                                            <div
                                                key={reservation._id}
                                                className="reservation-card bg-black/40 rounded-lg p-6 border border-amber-400/20 hover:border-amber-400/30"
                                            >
                                                {editingReservationId === reservation._id ? (
                                                    <div className="space-y-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                                                <input
                                                                    type="date"
                                                                    name="date"
                                                                    value={editReservationForm.date}
                                                                    onChange={handleReservationChange}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                                                                <input
                                                                    type="time"
                                                                    name="time"
                                                                    value={editReservationForm.time}
                                                                    onChange={handleReservationChange}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                                                                <input
                                                                    type="number"
                                                                    name="guests"
                                                                    min="1"
                                                                    value={editReservationForm.guests}
                                                                    onChange={handleReservationChange}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests</label>
                                                            <input
                                                                type="text"
                                                                name="specialRequests"
                                                                value={editReservationForm.specialRequests}
                                                                onChange={handleReservationChange}
                                                                className="input-field w-full"
                                                                placeholder="Any special requests?"
                                                            />
                                                        </div>
                                                        <div className="flex gap-3 pt-2">
                                                            <button
                                                                onClick={() => saveReservationEdit(reservation._id)}
                                                                className="btn-primary py-2 px-6 rounded-lg flex-1"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEditReservation}
                                                                className="btn-secondary py-2 px-6 rounded-lg flex-1"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <p className="serif-title text-lg text-white">{formatDate(reservation.date)}</p>
                                                                <p className="text-amber-400/80 text-sm font-medium mt-1">{reservation.time}</p>
                                                            </div>
                                                            <span className="status-badge bg-amber-400/10 text-amber-400 border-amber-400/30">
                                                                {reservation.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center pt-4 border-t border-amber-400/10">
                                                            <div className="flex items-center gap-2 text-gray-300">
                                                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                </svg>
                                                                <span className="text-sm">Table for {reservation.guests}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <button
                                                                    onClick={() => startEditReservation(reservation)}
                                                                    className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelReservation(reservation._id)}
                                                                    className="text-sm text-gray-400 hover:text-red-400 font-medium transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-400 mb-4">No upcoming reservations</p>
                                        <a
                                            href="/menu"
                                            className="inline-block text-amber-400 hover:text-amber-300 font-medium transition-colors"
                                        >
                                            Make a Reservation →
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Past Reservations */}
                            <div className="glass-card rounded-xl p-8 fade-in">
                                <h2 className="serif-title text-2xl text-white mb-8 flex items-center gap-3">
                                    Past Reservations
                                </h2>

                                {pastReservations.length > 0 ? (
                                    <div className="space-y-3">
                                        {pastReservations.map((reservation) => (
                                            <div
                                                key={reservation._id}
                                                className="bg-black/30 rounded-lg p-5 border border-amber-400/10 hover:border-amber-400/15 transition-all"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-medium">{formatDate(reservation.date)}</p>
                                                        <p className="text-gray-500 text-sm">{reservation.time}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                            <span>Table for {reservation.guests}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-600 mt-1 block">{reservation.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No past reservations</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Orders Section */}
            <section className="py-16 px-6 bg-zinc-950 border-t border-amber-400/20">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="serif-title text-3xl text-white flex items-center gap-3">
                            Recent Orders
                        </h2>
                        <button
                            onClick={() => navigate('/orders')}
                            className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-2"
                        >
                            View All
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.slice(0, 3).map((order) => (
                                <div
                                    key={order._id}
                                    className="order-card bg-black/50 rounded-lg p-5 border border-amber-400/20 hover:bg-black/60"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <p className="text-white font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-gray-400 text-sm mt-1">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-gray-400 text-sm">Items</p>
                                                <p className="text-white font-semibold">{order.orderItems?.length || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Total</p>
                                                <p className="text-amber-400 font-semibold text-lg">${order.totalPrice?.toFixed(2) || '0.00'}</p>
                                            </div>
                                            <span className={`status-badge ${order.status === 'Pending'
                                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                                : order.status === 'Processing'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                    : order.status === 'Completed'
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">No orders yet</p>
                            <button
                                onClick={() => navigate('/menu')}
                                className="inline-block text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            >
                                Browse Menu →
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* My Reviews Section */}
            <section className="py-16 px-6 bg-black border-t border-amber-400/20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="serif-title text-3xl text-white mb-8 flex items-center gap-3">
                        My Reviews
                    </h2>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="glass-card rounded-lg p-6 fade-in"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">⭐</span>
                                            <p className="text-white font-semibold">{review.rating}/5</p>
                                        </div>
                                        <p className="text-gray-500 text-xs">{formatDate(review.createdAt)}</p>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                            </svg>
                            <p className="text-gray-400">No reviews yet</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}