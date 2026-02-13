import { useState } from 'react';

export default function MenuManager() {
    const [menuItems, setMenuItems] = useState([
        { id: 1, name: 'Wagyu Beef Steak', category: 'Main Course', price: 89, status: 'Active' },
        { id: 2, name: 'Lobster Thermidor', category: 'Main Course', price: 75, status: 'Active' },
        { id: 3, name: 'Truffle Pasta', category: 'Main Course', price: 62, status: 'Active' },
        { id: 4, name: 'Chocolate Soufflé', category: 'Desserts', price: 28, status: 'Inactive' }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif text-white">Menu Manager</h1>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-2 rounded-md font-semibold"
                >
                    + Add Item
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                    <h3 className="text-xl text-white mb-4">Add New Menu Item</h3>
                    <form className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Item Name"
                            className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                        />
                        <select className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <textarea
                            placeholder="Description"
                            className="col-span-2 px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                            rows="3"
                        ></textarea>
                        <button
                            type="submit"
                            className="col-span-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black py-2 rounded-md font-semibold"
                        >
                            Add Item
                        </button>
                    </form>
                </div>
            )}

            {/* Menu Items Table */}
            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                <th className="pb-3">Name</th>
                                <th className="pb-3">Category</th>
                                <th className="pb-3">Price</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map((item) => (
                                <tr key={item.id} className="border-b border-amber-400/10">
                                    <td className="py-4 text-white">{item.name}</td>
                                    <td className="py-4 text-gray-400">{item.category}</td>
                                    <td className="py-4 text-amber-400 font-semibold">${item.price}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${item.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button className="text-amber-400 hover:text-amber-300 mr-3">Edit</button>
                                        <button className="text-red-400 hover:text-red-300">Delete</button>
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