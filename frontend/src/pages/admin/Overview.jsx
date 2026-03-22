// export default function Overview() {
//     const stats = [
//         { label: 'Total Revenue', value: '$12,450', change: '+12%' },
//         { label: 'Orders Today', value: '48', change: '+8%' },
//         { label: 'Reservations', value: '24', change: '+5%' },
//         { label: 'Total Customers', value: '1,245', change: '+18%' }
//     ];

//     const recentOrders = [
//         { id: '#1234', customer: 'Kamal Perera', amount: '$85', status: 'Completed' },
//         { id: '#1235', customer: 'Supuni Herath', amount: '$120', status: 'Pending' },
//         { id: '#1236', customer: 'Mike Silva', amount: '$95', status: 'Completed' },
//         { id: '#1237', customer: 'Sara Pranandu', amount: '$150', status: 'Processing' }
//     ];

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-serif text-white">Overview</h1>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {stats.map((stat, index) => (
//                     <div key={index} className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
//                         <div className="flex items-center justify-between mb-4">
//                             <span className="text-sm text-green-400">{stat.change}</span>
//                         </div>
//                         <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
//                         <p className="text-2xl font-bold text-white">{stat.value}</p>
//                     </div>
//                 ))}
//             </div>

//             {/* Recent Orders */}
//             <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
//                 <div className="p-6 border-b border-amber-400/20">
//                     <h2 className="text-xl font-serif text-white">Recent Orders</h2>
//                 </div>
//                 <div className="p-6">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
//                                 <th className="pb-3">Order ID</th>
//                                 <th className="pb-3">Customer</th>
//                                 <th className="pb-3">Amount</th>
//                                 <th className="pb-3">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {recentOrders.map((order) => (
//                                 <tr key={order.id} className="border-b border-amber-400/10">
//                                     <td className="py-4 text-white">{order.id}</td>
//                                     <td className="py-4 text-white">{order.customer}</td>
//                                     <td className="py-4 text-amber-400 font-semibold">{order.amount}</td>
//                                     <td className="py-4">
//                                         <span className={`px-3 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
//                                             order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
//                                                 'bg-blue-500/20 text-blue-400'
//                                             }`}>
//                                             {order.status}
//                                         </span>
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

export default function Overview() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchOverviewData = async () => {
        try {
            setLoading(true);
            setErrorMessage('');

            const [ordersRes, reservationsRes, usersRes] = await Promise.all([
                API.get('/admin/orders'),
                API.get('/admin/reservations'),
                API.get('/admin/users'),
            ]);

            setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
            setReservations(Array.isArray(reservationsRes.data) ? reservationsRes.data : []);
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const stats = useMemo(() => {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const totalRevenue = orders
            .filter((o) => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

        const ordersToday = orders.filter((o) => {
            if (!o.createdAt) return false;
            return new Date(o.createdAt) >= startOfToday;
        }).length;

        const activeReservations = reservations.filter((r) =>
            ['Pending', 'Confirmed'].includes(r.status)
        ).length;

        return [
            { label: 'Total Revenue', value: '$' + totalRevenue.toFixed(2) },
            { label: 'Orders Today', value: String(ordersToday) },
            { label: 'Reservations', value: String(activeReservations) },
            { label: 'Total Customers', value: String(users.length) },
        ];
    }, [orders, reservations, users]);

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5);
    }, [orders]);

    const formatCurrency = (value) => '$' + Number(value || 0).toFixed(2);

    const statusClass = (status) => {
        if (status === 'Completed') return 'bg-green-500/20 text-green-400';
        if (status === 'Pending') return 'bg-yellow-500/20 text-yellow-400';
        if (status === 'Processing') return 'bg-blue-500/20 text-blue-400';
        return 'bg-red-500/20 text-red-400';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif text-white">Overview</h1>
                <button
                    onClick={fetchOverviewData}
                    className="px-4 py-2 bg-zinc-800 text-gray-300 rounded-md border border-amber-400/30 hover:text-white"
                >
                    Refresh
                </button>
            </div>

            {errorMessage && (
                <div className="p-3 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(loading ? [
                    { label: 'Total Revenue', value: '...' },
                    { label: 'Orders Today', value: '...' },
                    { label: 'Reservations', value: '...' },
                    { label: 'Total Customers', value: '...' },
                ] : stats).map((stat) => (
                    <div key={stat.label} className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                        <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6 border-b border-amber-400/20">
                    <h2 className="text-xl font-serif text-white">Recent Orders</h2>
                </div>

                <div className="p-6 overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-400">Loading recent orders...</p>
                    ) : recentOrders.length === 0 ? (
                        <p className="text-gray-400">No recent orders found</p>
                    ) : (
                        <table className="w-full min-w-[760px]">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-amber-400/10">
                                        <td className="py-4 text-white">{order._id.slice(-8).toUpperCase()}</td>
                                        <td className="py-4 text-white">{order.user?.name || 'Unknown'}</td>
                                        <td className="py-4 text-amber-400 font-semibold">
                                            {formatCurrency(order.totalPrice)}
                                        </td>
                                        <td className="py-4">
                                            <span className={'px-3 py-1 rounded-full text-xs ' + statusClass(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-400">
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}