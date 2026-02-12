import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567'
    });

    const [editForm, setEditForm] = useState({ ...userInfo });

    const upcomingReservations = [
        {
            id: 1,
            date: 'Feb 15, 2026',
            time: '7:00 PM',
            tableSize: 4,
            status: 'Confirmed'
        },
        {
            id: 2,
            date: 'Feb 22, 2026',
            time: '8:30 PM',
            tableSize: 2,
            status: 'Confirmed'
        }
    ];

    const pastReservations = [
        {
            id: 3,
            date: 'Jan 28, 2026',
            time: '6:30 PM',
            tableSize: 6,
            status: 'Completed'
        },
        {
            id: 4,
            date: 'Jan 15, 2026',
            time: '7:00 PM',
            tableSize: 2,
            status: 'Completed'
        },
        {
            id: 5,
            date: 'Dec 31, 2025',
            time: '9:00 PM',
            tableSize: 4,
            status: 'Completed'
        }
    ];

    const handleEditToggle = () => {
        if (isEditing) {
            setEditForm({ ...userInfo });
        }
        setIsEditing(!isEditing);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setUserInfo({ ...editForm });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = '/';
        }
    };

    const handleCancelReservation = (id) => {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            alert('Reservation cancelled');
        }
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
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={editForm.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                            />
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
                                            <span className="text-white">{userInfo.phone}</span>
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
                                            <div key={reservation.id}
                                                className="bg-black/50 rounded-lg p-4 border border-amber-400/20">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="text-white font-semibold text-lg">{reservation.date}</p>
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
                                                        <span className="text-sm">Table for {reservation.tableSize}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCancelReservation(reservation.id)}
                                                        className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
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
                                            <div key={reservation.id}
                                                className="bg-black/30 rounded-lg p-4 border border-amber-400/10">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-semibold">{reservation.date}</p>
                                                        <p className="text-gray-500 text-sm">{reservation.time}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            <span>Table for {reservation.tableSize}</span>
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

            <Footer />
        </div>
    );
}