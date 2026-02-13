export default function OrdersManager() {
    const orders = [
        { id: '#1234', customer: 'Kamal Perera', items: 3, total: 85, status: 'Completed', date: '2026-02-13' },
        { id: '#1235', customer: 'Supuni Herath', items: 2, total: 120, status: 'Pending', date: '2026-02-13' },
        { id: '#1236', customer: 'Mike Silva', items: 4, total: 95, status: 'Processing', date: '2026-02-12' },
        { id: '#1237', customer: 'Sara Pranandu', items: 5, total: 150, status: 'Completed', date: '2026-02-12' },
        { id: '#1238', customer: 'Tani Antony', items: 2, total: 75, status: 'Cancelled', date: '2026-02-11' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif text-white">Orders Manager</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-zinc-800 text-gray-400 rounded-md border border-amber-400/30">
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-zinc-800 text-gray-400 rounded-md border border-amber-400/30">
                        Export
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6">
                    <table className="w-full">
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
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-amber-400/10">
                                    <td className="py-4 text-white font-semibold">{order.id}</td>
                                    <td className="py-4 text-white">{order.customer}</td>
                                    <td className="py-4 text-gray-400">{order.items} items</td>
                                    <td className="py-4 text-amber-400 font-semibold">${order.total}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-400">{order.date}</td>
                                    <td className="py-4">
                                        <button className="text-amber-400 hover:text-amber-300">View</button>
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