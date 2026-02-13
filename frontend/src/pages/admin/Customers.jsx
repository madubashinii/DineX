export default function Customers() {
    const customers = [
        { id: 1, name: 'Kamal Perera', email: 'kamal@example.com', phone: '+94 71 2316253', orders: 12, spent: 850 },
        { id: 2, name: 'Supuni Herath', email: 'supuni@example.com', phone: '+94 71 2316452', orders: 8, spent: 620 },
        { id: 3, name: 'Mike Silva', email: 'mike@example.com', phone: '+94 71 2317252', orders: 15, spent: 1240 },
        { id: 4, name: 'Sara Pranandu', email: 'sara@example.com', phone: '+94 71 8316252', orders: 5, spent: 380 },
        { id: 5, name: 'Tani Antony', email: 'tani@example.com', phone: '+94 71 2346252', orders: 20, spent: 1850 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif text-white">Customers</h1>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                    />
                    <button className="px-4 py-2 bg-zinc-800 text-gray-400 rounded-md border border-amber-400/30">
                        Search
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                <th className="pb-3">Name</th>
                                <th className="pb-3">Email</th>
                                <th className="pb-3">Phone</th>
                                <th className="pb-3">Orders</th>
                                <th className="pb-3">Total Spent</th>
                                <th className="pb-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="border-b border-amber-400/10">
                                    <td className="py-4 text-white">{customer.name}</td>
                                    <td className="py-4 text-gray-400">{customer.email}</td>
                                    <td className="py-4 text-gray-400">{customer.phone}</td>
                                    <td className="py-4 text-white">{customer.orders}</td>
                                    <td className="py-4 text-amber-400 font-semibold">${customer.spent}</td>
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