export default function Overview() {
    const stats = [
        { label: 'Total Revenue', value: '$12,450', change: '+12%' },
        { label: 'Orders Today', value: '48', change: '+8%' },
        { label: 'Reservations', value: '24', change: '+5%' },
        { label: 'Total Customers', value: '1,245', change: '+18%' }
    ];

    const recentOrders = [
        { id: '#1234', customer: 'Kamal Perera', amount: '$85', status: 'Completed' },
        { id: '#1235', customer: 'Supuni Herath', amount: '$120', status: 'Pending' },
        { id: '#1236', customer: 'Mike Silva', amount: '$95', status: 'Completed' },
        { id: '#1237', customer: 'Sara Pranandu', amount: '$150', status: 'Processing' }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-white">Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-green-400">{stat.change}</span>
                        </div>
                        <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6 border-b border-amber-400/20">
                    <h2 className="text-xl font-serif text-white">Recent Orders</h2>
                </div>
                <div className="p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                <th className="pb-3">Order ID</th>
                                <th className="pb-3">Customer</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-amber-400/10">
                                    <td className="py-4 text-white">{order.id}</td>
                                    <td className="py-4 text-white">{order.customer}</td>
                                    <td className="py-4 text-amber-400 font-semibold">{order.amount}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {order.status}
                                        </span>
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