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
    const formatDate = (date) => new Date(date).toLocaleDateString();

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

            const [profileRes, reservationsRes, ordersRes] = await Promise.all([
                API.get('/users/profile'),
                API.get('/reservations'),
                API.get('/orders'),
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
            <Header />

            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">My Profile</h1>
                    <p className="text-xl text-gray-400">Manage your account and reservations</p>
                </div>
            </section>

            {loading && <p className="text-gray-400 mb-4">Loading profile...</p>}
            {errorMessage && (
                <div className="mb-4 p-3 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="mb-4 p-3 rounded-md bg-green-500/20 text-green-400 border border-green-500/30">
                    {successMessage}
                </div>
            )}
            <section className="py-16 px-6 bg-black">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">

                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-amber-400 to-yellow-500 
                                                  rounded-full flex items-center justify-center text-4xl text-black font-bold">
                                        {userInfo.name.charAt(0)}
                                    </div>
                                    <h2 className="text-2xl font-serif text-white mt-4">{userInfo.name}</h2>
                                    <p className="text-gray-400 text-sm">{userInfo.email}</p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleEditToggle}
                                        className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                                 py-3 rounded-md font-semibold uppercase tracking-wider
                                                 hover:shadow-lg hover:shadow-amber-500/50 
                                                 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-zinc-800 text-gray-400 py-3 rounded-md font-semibold 
                                                 border border-amber-400/30 hover:border-red-500/50 hover:text-red-500
                                                 transition-all duration-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">

                            <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                                <h2 className="text-2xl font-serif text-white mb-6">Basic Information</h2>

                                {isEditing ? (
                                    <form onSubmit={handleSave} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full px-4 py-3 bg-black/50 border rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none 
                                                         transition-colors duration-300 ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-amber-400/30 focus:border-amber-400'}`}
                                            />
                                            {fieldErrors.name && (
                                                <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleInputChange}
                                                required
                                                disabled
                                                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-md 
                                                         text-gray-500 placeholder-gray-600 focus:outline-none 
                                                         transition-colors duration-300 cursor-not-allowed"
                                            />
                                            <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={editForm.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-black/50 border rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none 
                                                         transition-colors duration-300 ${fieldErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-amber-400/30 focus:border-amber-400'}`}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            {fieldErrors.phone && (
                                                <p className="text-red-400 text-sm mt-1">{fieldErrors.phone}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={editForm.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                                placeholder="123 Main Street"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={editForm.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                             transition-colors duration-300"
                                                    placeholder="New York"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={editForm.zipCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                             transition-colors duration-300"
                                                    placeholder="10001"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                                     py-3 rounded-md font-semibold uppercase tracking-wider
                                                     hover:shadow-lg hover:shadow-amber-500/50 
                                                     hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-3 border-b border-amber-400/10">
                                            <span className="text-gray-400">Name</span>
                                            <span className="text-white">{userInfo.name}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-amber-400/10">
                                            <span className="text-gray-400">Email</span>
                                            <span className="text-white">{userInfo.email}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-amber-400/10">
                                            <span className="text-gray-400">Phone</span>
                                            <span className="text-white">{userInfo.phone || '-'}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-amber-400/10">
                                            <span className="text-gray-400">Address</span>
                                            <span className="text-white">{userInfo.address || '-'}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-amber-400/10">
                                            <span className="text-gray-400">City</span>
                                            <span className="text-white">{userInfo.city || '-'}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-amber-400/10">
                                            <span className="text-gray-400">ZIP Code</span>
                                            <span className="text-white">{userInfo.zipCode || '-'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Reservations */}
                            <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                                <h2 className="text-2xl font-serif text-white mb-6">Upcoming Reservations</h2>

                                {upcomingReservations.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingReservations.map((reservation) => (
                                            <div key={reservation._1}
                                                className="bg-black/50 rounded-lg p-4 border border-amber-400/20">
                                                {editingReservationId === reservation._id ? (
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div>
                                                                <label className="text-sm text-gray-300">Date</label>
                                                                <input type="date" name="date" value={editReservationForm.date} onChange={handleReservationChange}
                                                                    className="w-full px-3 py-2 bg-black border border-amber-400/30 rounded text-white" />
                                                            </div>
                                                            <div>
                                                                <label className="text-sm text-gray-300">Time</label>
                                                                <input type="time" name="time" value={editReservationForm.time} onChange={handleReservationChange}
                                                                    className="w-full px-3 py-2 bg-black border border-amber-400/30 rounded text-white" />
                                                            </div>
                                                            <div>
                                                                <label className="text-sm text-gray-300">Guests</label>
                                                                <input type="number" name="guests" min="1" value={editReservationForm.guests} onChange={handleReservationChange}
                                                                    className="w-full px-3 py-2 bg-black border border-amber-400/30 rounded text-white" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-300">Special Requests</label>
                                                            <input type="text" name="specialRequests" value={editReservationForm.specialRequests} onChange={handleReservationChange}
                                                                className="w-full px-3 py-2 bg-black border border-amber-400/30 rounded text-white" />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => saveReservationEdit(reservation._id)} className="px-4 py-2 bg-amber-400 text-black rounded">Save</button>
                                                            <button onClick={cancelEditReservation} className="px-4 py-2 bg-zinc-800 text-gray-300 rounded">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <p className="text-white font-semibold text-lg">{formatDate(reservation.date)}</p>
                                                                <p className="text-gray-400 text-sm">{reservation.time}</p>
                                                            </div>
                                                            <span className="px-3 py-1 bg-amber-400/20 rounded-full text-xs text-amber-400 
                                                                   border border-amber-400/30">
                                                                {reservation.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2 text-gray-400">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                </svg>
                                                                <span className="text-sm">Table for {reservation.guests}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button onClick={() => startEditReservation(reservation)} className="text-sm text-amber-400 hover:text-amber-300">Edit</button>
                                                                <button
                                                                    onClick={() => handleCancelReservation(reservation._id)}
                                                                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
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
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">No upcoming reservations</p>
                                        <a href="/menu"
                                            className="inline-block mt-4 text-amber-400 hover:text-amber-300 transition-colors">
                                            Make a Reservation
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Past Reservations */}
                            <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                                <h2 className="text-2xl font-serif text-white mb-6">Past Reservations</h2>

                                {pastReservations.length > 0 ? (
                                    <div className="space-y-3">
                                        {pastReservations.map((reservation) => (
                                            <div key={reservation._id}
                                                className="bg-black/30 rounded-lg p-4 border border-amber-400/10">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-semibold">{formatDate(reservation.date)}</p>
                                                        <p className="text-gray-500 text-sm">{reservation.time}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            <span>Table for {reservation.guests}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-600">{reservation.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">No past reservations</p>
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
                        <h2 className="text-3xl font-serif text-white">Recent Orders</h2>
                        <button
                            onClick={() => navigate('/orders')}
                            className="text-amber-400 hover:text-amber-300 transition-colors text-sm"
                        >
                            View All Orders →
                        </button>
                    </div>

                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.slice(0, 3).map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-black/50 rounded-lg p-4 border border-amber-400/20 hover:border-amber-400/40 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <p className="text-white font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Items: {order.orderItems?.length || 0}</p>
                                                <p className="text-amber-400 font-semibold">${order.totalPrice?.toFixed(2) || '0.00'}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                    order.status === 'Completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                        'bg-red-500/20 text-red-400 border-red-500/30'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">No orders yet</p>
                            <button
                                onClick={() => navigate('/menu')}
                                className="inline-block text-amber-400 hover:text-amber-300 transition-colors"
                            >
                                Browse Menu
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}