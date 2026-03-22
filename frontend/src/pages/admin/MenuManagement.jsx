// import { useState } from 'react';

// export default function MenuManager() {
//     const [menuItems, setMenuItems] = useState([
//         { id: 1, name: 'Wagyu Beef Steak', category: 'Main Course', price: 89, status: 'Active' },
//         { id: 2, name: 'Lobster Thermidor', category: 'Main Course', price: 75, status: 'Active' },
//         { id: 3, name: 'Truffle Pasta', category: 'Main Course', price: 62, status: 'Active' },
//         { id: 4, name: 'Chocolate Soufflé', category: 'Desserts', price: 28, status: 'Inactive' }
//     ]);

//     const [showAddForm, setShowAddForm] = useState(false);

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-serif text-white">Menu Manager</h1>
//                 <button
//                     onClick={() => setShowAddForm(!showAddForm)}
//                     className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-2 rounded-md font-semibold"
//                 >
//                     + Add Item
//                 </button>
//             </div>

//             {/* Add Form */}
//             {showAddForm && (
//                 <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
//                     <h3 className="text-xl text-white mb-4">Add New Menu Item</h3>
//                     <form className="grid grid-cols-2 gap-4">
//                         <input
//                             type="text"
//                             placeholder="Item Name"
//                             className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Category"
//                             className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
//                         />
//                         <input
//                             type="number"
//                             placeholder="Price"
//                             className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
//                         />
//                         <select className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white">
//                             <option>Active</option>
//                             <option>Inactive</option>
//                         </select>
//                         <textarea
//                             placeholder="Description"
//                             className="col-span-2 px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
//                             rows="3"
//                         ></textarea>
//                         <button
//                             type="submit"
//                             className="col-span-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black py-2 rounded-md font-semibold"
//                         >
//                             Add Item
//                         </button>
//                     </form>
//                 </div>
//             )}

//             {/* Menu Items Table */}
//             <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
//                 <div className="p-6">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
//                                 <th className="pb-3">Name</th>
//                                 <th className="pb-3">Category</th>
//                                 <th className="pb-3">Price</th>
//                                 <th className="pb-3">Status</th>
//                                 <th className="pb-3">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {menuItems.map((item) => (
//                                 <tr key={item.id} className="border-b border-amber-400/10">
//                                     <td className="py-4 text-white">{item.name}</td>
//                                     <td className="py-4 text-gray-400">{item.category}</td>
//                                     <td className="py-4 text-amber-400 font-semibold">${item.price}</td>
//                                     <td className="py-4">
//                                         <span className={`px-3 py-1 rounded-full text-xs ${item.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
//                                             }`}>
//                                             {item.status}
//                                         </span>
//                                     </td>
//                                     <td className="py-4">
//                                         <button className="text-amber-400 hover:text-amber-300 mr-3">Edit</button>
//                                         <button className="text-red-400 hover:text-red-300">Delete</button>
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function MenuManager() {
    const navigate = useNavigate();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        image: '',
    });

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const { data } = await API.get('/admin/menu');
            setMenuItems(data || []);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            image: '',
        });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const openCreateForm = () => {
        resetForm();
        setErrorMessage('');
        setSuccessMessage('');
        setShowAddForm(true);
    };

    const handleEditStart = (item) => {
        setFormData({
            name: item.name || '',
            description: item.description || '',
            category: item.category || '',
            price: item.price ?? '',
            image: item.image || '',
        });
        setEditingId(item._id);
        setShowAddForm(true);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.name || !formData.category || !formData.price || !formData.image) {
            setErrorMessage('Name, category, price, and image are required');
            return;
        }

        try {
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                price: Number(formData.price),
                image: formData.image.trim(),
            };

            if (editingId) {
                await API.put('/admin/menu/' + editingId, payload);
                setSuccessMessage('Menu item updated successfully');
            } else {
                await API.post('/admin/menu', payload);
                setSuccessMessage('Menu item created successfully');
            }

            setShowAddForm(false);
            resetForm();
            fetchMenuItems();
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to save menu item');
        }
    };

    const handleDelete = async (id) => {
        const ok = confirm('Are you sure you want to delete this menu item?');
        if (!ok) return;

        setErrorMessage('');
        setSuccessMessage('');

        try {
            await API.delete('/admin/menu/' + id);
            setSuccessMessage('Menu item deleted successfully');
            fetchMenuItems();
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to delete menu item');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif text-white">Menu Manager</h1>
                <button
                    onClick={openCreateForm}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-2 rounded-md font-semibold"
                >
                    + Add Item
                </button>
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

            {showAddForm && (
                <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                    <h3 className="text-xl text-white mb-4">
                        {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h3>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Item Name"
                            className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                            required
                        />

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            placeholder="Category"
                            className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                            required
                        />

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Price"
                            className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                            min="0"
                            step="0.01"
                            required
                        />

                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="Image URL"
                            className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                            required
                        />

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="md:col-span-2 px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                            rows="3"
                        />

                        <div className="md:col-span-2 flex gap-3">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black py-2 px-5 rounded-md font-semibold"
                            >
                                {editingId ? 'Update Item' : 'Create Item'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    resetForm();
                                }}
                                className="bg-zinc-800 text-gray-300 py-2 px-5 rounded-md border border-amber-400/20"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-zinc-900 rounded-lg border border-amber-400/20">
                <div className="p-6 overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-400">Loading menu items...</p>
                    ) : (
                        <table className="w-full min-w-[720px]">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Category</th>
                                    <th className="pb-3">Price</th>
                                    <th className="pb-3">Image</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.length === 0 ? (
                                    <tr>
                                        <td className="py-6 text-gray-400" colSpan={5}>
                                            No menu items found
                                        </td>
                                    </tr>
                                ) : (
                                    menuItems.map((item) => (
                                        <tr key={item._id} className="border-b border-amber-400/10">
                                            <td className="py-4 text-white">{item.name}</td>
                                            <td className="py-4 text-gray-400">{item.category}</td>
                                            <td className="py-4 text-amber-400 font-semibold">${item.price}</td>
                                            <td className="py-4 text-gray-400 truncate max-w-[220px]">{item.image}</td>
                                            <td className="py-4">
                                                <button
                                                    onClick={() => handleEditStart(item)}
                                                    className="text-amber-400 hover:text-amber-300 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
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