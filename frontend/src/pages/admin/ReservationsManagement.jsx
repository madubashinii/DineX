export default function ReservationsManager() {
    const reservations = [
        { id: 1, customer: 'Kamal Perera', date: '2026-02-15', time: '7:00 PM', guests: 4, status: 'Confirmed' },
        { id: 2, customer: 'Supuni Herath', date: '2026-02-15', time: '8:30 PM', guests: 2, status: 'Confirmed' },
        { id: 3, customer: 'Mike Silva', date: '2026-02-16', time: '6:30 PM', guests: 6, status: 'Pending' },
        { id: 4, customer: 'Sarah Johnson', date: '2026-02-16', time: '7:30 PM', guests: 3, status: 'Confirmed' },
        { id: 5, customer: 'Tani Antony', date: '2026-02-17', time: '8:00 PM', guests: 2, status: 'Cancelled' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif text-white">Reservations Manager</h1>
                <button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-2 rounded-md font-semibold">
                    + New Reservation
                </button>
            </div>

            {/* Reservations Table */}
            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                <th className="pb-3">Customer</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Time</th>
                                <th className="pb-3">Guests</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id} className="border-b border-amber-400/10">
                                    <td className="py-4 text-white">{reservation.customer}</td>
                                    <td className="py-4 text-gray-400">{reservation.date}</td>
                                    <td className="py-4 text-gray-400">{reservation.time}</td>
                                    <td className="py-4 text-white">{reservation.guests} guests</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${reservation.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                                            reservation.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {reservation.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button className="text-amber-400 hover:text-amber-300 mr-3">Edit</button>
                                        <button className="text-red-400 hover:text-red-300">Cancel</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}