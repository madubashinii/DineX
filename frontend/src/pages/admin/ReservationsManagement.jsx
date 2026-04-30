// export default function ReservationsManager() {
//     const reservations = [
//         { id: 1, customer: 'Kamal Perera', date: '2026-02-15', time: '7:00 PM', guests: 4, status: 'Confirmed' },
//         { id: 2, customer: 'Supuni Herath', date: '2026-02-15', time: '8:30 PM', guests: 2, status: 'Confirmed' },
//         { id: 3, customer: 'Mike Silva', date: '2026-02-16', time: '6:30 PM', guests: 6, status: 'Pending' },
//         { id: 4, customer: 'Sarah Johnson', date: '2026-02-16', time: '7:30 PM', guests: 3, status: 'Confirmed' },
//         { id: 5, customer: 'Tani Antony', date: '2026-02-17', time: '8:00 PM', guests: 2, status: 'Cancelled' }
//     ];

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-serif text-white">Reservations Manager</h1>
//                 <button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-2 rounded-md font-semibold">
//                     + New Reservation
//                 </button>
//             </div>

//             {/* Reservations Table */}
//             <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
//                 <div className="p-6">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
//                                 <th className="pb-3">Customer</th>
//                                 <th className="pb-3">Date</th>
//                                 <th className="pb-3">Time</th>
//                                 <th className="pb-3">Guests</th>
//                                 <th className="pb-3">Status</th>
//                                 <th className="pb-3">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reservations.map((reservation) => (
//                                 <tr key={reservation.id} className="border-b border-amber-400/10">
//                                     <td className="py-4 text-white">{reservation.customer}</td>
//                                     <td className="py-4 text-gray-400">{reservation.date}</td>
//                                     <td className="py-4 text-gray-400">{reservation.time}</td>
//                                     <td className="py-4 text-white">{reservation.guests} guests</td>
//                                     <td className="py-4">
//                                         <span className={`px-3 py-1 rounded-full text-xs ${reservation.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
//                                             reservation.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
//                                                 'bg-red-500/20 text-red-400'
//                                             }`}>
//                                             {reservation.status}
//                                         </span>
//                                     </td>
//                                     <td className="py-4">
//                                         <button className="text-amber-400 hover:text-amber-300 mr-3">Edit</button>
//                                         <button className="text-red-400 hover:text-red-300">Cancel</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const RESERVATION_STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

export default function ReservationsManager() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const fetchReservations = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const { data } = await API.get('/admin/reservations');
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleStatusChange = async (reservationId, nextStatus) => {
        try {
            setUpdatingId(reservationId);
            setErrorMessage('');
            setSuccessMessage('');

            await API.put('/admin/reservations/' + reservationId, { status: nextStatus });

            setReservations((prev) =>
                prev.map((reservation) =>
                    reservation._id === reservationId
                        ? { ...reservation, status: nextStatus }
                        : reservation
                )
            );
            setSuccessMessage('Reservation status updated');
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to update reservation status');
        } finally {
            setUpdatingId('');
        }
    };

    const filteredReservations = useMemo(() => {
        let filtered = reservations;

        if (statusFilter !== 'All') {
            filtered = filtered.filter((reservation) => reservation.status === statusFilter);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((reservation) =>
                reservation._id.toLowerCase().includes(term) ||
                reservation.user?.name?.toLowerCase().includes(term) ||
                reservation.name?.toLowerCase().includes(term) ||
                reservation.phone?.includes(term)
            );
        }

        return filtered;
    }, [reservations, statusFilter, searchTerm]);

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        return new Date(dateValue).toLocaleDateString();
    };

    const formatTime = (timeValue) => {
        return timeValue || 'N/A';
    };

    const paginatedReservations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReservations.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredReservations, currentPage]);

    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-serif text-white">Reservations Manager</h1>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">Filter:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-zinc-800 text-gray-200 rounded-md border border-amber-400/30"
                    >
                        <option value="All">All</option>
                        {RESERVATION_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search by name, ID, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 bg-zinc-800 text-gray-200 rounded-md border border-amber-400/30 text-sm"
                    />

                    <button
                        onClick={fetchReservations}
                        className="px-4 py-2 bg-zinc-800 text-gray-300 rounded-md border border-amber-400/30 hover:text-white"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="p-3 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="p-3 rounded-md bg-green-500/20 text-green-400 border border-green-500/30">
                    {successMessage}
                </div>
            )}

            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6 overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-400">Loading reservations...</p>
                    ) : (
                        <table className="w-full min-w-[980px]">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Time</th>
                                    <th className="pb-3">Guests</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservations.length === 0 ? (
                                    <tr>
                                        <td className="py-6 text-gray-400" colSpan={7}>
                                            No reservations found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedReservations.map((reservation) => (
                                        <tr key={reservation._id} className="border-b border-amber-400/10">
                                            <td className="py-4 text-white">
                                                {reservation.user?.name || 'Unknown'}
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {reservation.user?.email || 'N/A'}
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {formatDate(reservation.date)}
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {formatTime(reservation.time)}
                                            </td>
                                            <td className="py-4 text-white">
                                                {reservation.guests}
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={
                                                        'px-3 py-1 rounded-full text-xs ' +
                                                        (reservation.status === 'Confirmed'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : reservation.status === 'Pending'
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : 'bg-red-500/20 text-red-400')
                                                    }
                                                >
                                                    {reservation.status}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <select
                                                    value={reservation.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(reservation._id, e.target.value)
                                                    }
                                                    disabled={updatingId === reservation._id}
                                                    className="px-2 py-1 bg-black border border-amber-400/30 rounded text-gray-200 text-sm"
                                                >
                                                    {RESERVATION_STATUSES.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}