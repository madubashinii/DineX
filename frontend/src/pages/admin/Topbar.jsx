export default function Topbar() {
    return (
        <div className="bg-zinc-900 border-b border-amber-400/20 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">Dashboard</h2>
                    <p className="text-sm text-gray-400">Welcome back, Admin</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-white">Admin User</p>
                        <p className="text-xs text-gray-400">admin@dinex.com</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                        A
                    </div>
                </div>
            </div>
        </div>
    );
}