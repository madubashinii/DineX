export default function Sidebar({ activeSection, setActiveSection }) {
    const menuItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'menu', label: 'Menu' },
        { id: 'orders', label: 'Orders' },
        { id: 'reservations', label: 'Reservations' },
        { id: 'customers', label: 'Customers' }
    ];

    return (
        <div className="w-64 bg-zinc-900 border-r border-amber-400/20 min-h-screen">
            <div className="p-6 border-b border-amber-400/20">
                <h1 className="text-2xl font-serif text-amber-400 font-bold">DineX Admin</h1>
            </div>

            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${activeSection === item.id
                                    ? 'bg-amber-400 text-black font-semibold'
                                    : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-0 w-64 p-4 border-t border-amber-400/20">
                <button className="w-full px-4 py-3 bg-zinc-800 text-gray-400 rounded-md hover:text-red-500 transition-colors">
                    Logout
                </button>
            </div>
        </div>
    );
}