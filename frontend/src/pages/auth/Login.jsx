import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login submitted');
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">

            <div className="relative w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-5xl font-serif tracking-[0.3em] text-amber-400 font-bold mb-2">
                        DineX
                    </h1>
                    <p className="text-gray-400 text-sm">Fine Dining Experience</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-8 shadow-2xl shadow-amber-500/20 border border-amber-400/20">
                    <h2 className="text-3xl font-serif text-white mb-2 text-center">Welcome Back</h2>
                    <p className="text-gray-400 text-center mb-8 text-sm">Sign in to continue</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                         transition-colors duration-300"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                         transition-colors duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-400 cursor-pointer">
                                <input type="checkbox" className="mr-2 accent-amber-400" />
                                Remember me
                            </label>
                            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                     py-3 rounded-md font-semibold uppercase tracking-wider
                                     hover:shadow-lg hover:shadow-amber-500/50 
                                     transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}