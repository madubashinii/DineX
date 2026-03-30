import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function Customers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [updatingId, setUpdatingId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const { data } = await API.get('/admin/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, nextRole) => {
        try {
            setUpdatingId(userId);
            setErrorMessage('');
            setSuccessMessage('');

            await API.put('/admin/users/' + userId, { role: nextRole });

            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId ? { ...user, role: nextRole } : user
                )
            );

            setSuccessMessage('User role updated');
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to update user role');
        } finally {
            setUpdatingId('');
        }
    };

    const customerUsers = useMemo(() => {
        return users.filter((user) => user.role === 'customer');
    }, [users]);

    const filteredUsers = useMemo(() => {
        const q = searchText.trim().toLowerCase();
        if (!q) return customerUsers;
        return customerUsers.filter((user) => {
            const name = (user.name || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            return name.includes(q) || email.includes(q);
        });
    }, [customerUsers, searchText]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-3xl font-serif text-white">Customers</h1>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by name or email..."
                        className="px-4 py-2 bg-black border border-amber-400/30 rounded text-white"
                    />
                    <button
                        onClick={fetchUsers}
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
                        <p className="text-gray-400">Loading users...</p>
                    ) : (
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-amber-400/10">
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Phone</th>
                                    <th className="pb-3">Role</th>
                                    <th className="pb-3">Created</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td className="py-6 text-gray-400" colSpan={6}>
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="border-b border-amber-400/10">
                                            <td className="py-4 text-white">{user.name}</td>
                                            <td className="py-4 text-gray-400">{user.email}</td>
                                            <td className="py-4 text-gray-400">{user.phone || 'N/A'}</td>
                                            <td className="py-4">
                                                <span
                                                    className={
                                                        'px-3 py-1 rounded-full text-xs ' +
                                                        (user.role === 'admin'
                                                            ? 'bg-amber-500/20 text-amber-300'
                                                            : 'bg-blue-500/20 text-blue-300')
                                                    }
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                            <td className="py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    disabled={updatingId === user._id}
                                                    className="px-2 py-1 bg-black border border-amber-400/30 rounded text-gray-200 text-sm"
                                                >
                                                    <option value="customer">customer</option>
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