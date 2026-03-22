// export default function OrdersManager() {
//     const orders = [
//         { id: '#1234', customer: 'Kamal Perera', items: 3, total: 85, status: 'Completed', date: '2026-02-13' },
//         { id: '#1235', customer: 'Supuni Herath', items: 2, total: 120, status: 'Pending', date: '2026-02-13' },
//         { id: '#1236', customer: 'Mike Silva', items: 4, total: 95, status: 'Processing', date: '2026-02-12' },
//         { id: '#1237', customer: 'Sara Pranandu', items: 5, total: 150, status: 'Completed', date: '2026-02-12' },
//         { id: '#1238', customer: 'Tani Antony', items: 2, total: 75, status: 'Cancelled', date: '2026-02-11' }
//     ];

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-serif text-white">Orders Manager</h1>
//                 <div className="flex gap-2">
//                     <button className="px-4 py-2 bg-zinc-800 text-gray-400 rounded-md border border-amber-400/30">
//                         Filter
//                     </button>
//                     <button className="px-4 py-2 bg-zinc-800 text-gray-400 rounded-md border border-amber-400/30">
//                         Export
//                     </button>
//                 </div>
//             </div>

//             {/* Orders Table */}
//             <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
//                 <div className="p-6">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
//                                 <th className="pb-3">Order ID</th>
//                                 <th className="pb-3">Customer</th>
//                                 <th className="pb-3">Items</th>
//                                 <th className="pb-3">Total</th>
//                                 <th className="pb-3">Status</th>
//                                 <th className="pb-3">Date</th>
//                                 <th className="pb-3">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {orders.map((order) => (
//                                 <tr key={order.id} className="border-b border-amber-400/10">
//                                     <td className="py-4 text-white font-semibold">{order.id}</td>
//                                     <td className="py-4 text-white">{order.customer}</td>
//                                     <td className="py-4 text-gray-400">{order.items} items</td>
//                                     <td className="py-4 text-amber-400 font-semibold">${order.total}</td>
//                                     <td className="py-4">
//                                         <span className={`px-3 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
//                                             order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
//                                                 order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
//                                                     'bg-red-500/20 text-red-400'
//                                             }`}>
//                                             {order.status}
//                                         </span>
//                                     </td>
//                                     <td className="py-4 text-gray-400">{order.date}</td>
//                                     <td className="py-4">
//                                         <button className="text-amber-400 hover:text-amber-300">View</button>
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

const ORDER_STATUSES = ['Pending', 'Processing', 'Completed', 'Cancelled'];

export default function OrdersManager() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const { data } = await API.get('/admin/orders');
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, nextStatus) => {
        try {
            setUpdatingId(orderId);
            setErrorMessage('');
            setSuccessMessage('');

            await API.put('/admin/orders/' + orderId, { status: nextStatus });
            setSuccessMessage('Order status updated');
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? { ...order, status: nextStatus } : order
                )
            );
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to update order status');
        } finally {
            setUpdatingId('');
        }
    };

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'All') return orders;
        return orders.filter((order) => order.status === statusFilter);
    }, [orders, statusFilter]);

    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return '$' + num.toFixed(2);
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        return new Date(dateValue).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-serif text-white">Orders Manager</h1>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">Filter:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-zinc-800 text-gray-200 rounded-md border border-amber-400/30"
                    >
                        <option value="All">All</option>
                        {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={fetchOrders}
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
                        <p className="text-gray-400">Loading orders...</p>
                    ) : (
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Items</th>
                                    <th className="pb-3">Total</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td className="py-6 text-gray-400" colSpan={7}>
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="border-b border-amber-400/10">
                                            <td className="py-4 text-white font-semibold">
                                                {order._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="py-4 text-white">
                                                {order.user?.name || 'Unknown'}
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {order.orderItems?.length || 0} items
                                            </td>
                                            <td className="py-4 text-amber-400 font-semibold">
                                                {formatCurrency(order.totalPrice)}
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={
                                                        'px-3 py-1 rounded-full text-xs ' +
                                                        (order.status === 'Completed'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : order.status === 'Pending'
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : order.status === 'Processing'
                                                                    ? 'bg-blue-500/20 text-blue-400'
                                                                    : 'bg-red-500/20 text-red-400')
                                                    }
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    disabled={updatingId === order._id}
                                                    className="px-2 py-1 bg-black border border-amber-400/30 rounded text-gray-200 text-sm"
                                                >
                                                    {ORDER_STATUSES.map((status) => (
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