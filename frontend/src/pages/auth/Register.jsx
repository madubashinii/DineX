import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            console.log(res.data);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };


    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="relative w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-5xl font-serif tracking-[0.3em] text-amber-400 font-bold mb-2">
                        DineX
                    </h1>
                    <p className="text-gray-400 text-sm">Fine Dining Experience</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-8 shadow-2xl shadow-amber-500/20 border border-amber-400/20">
                    <h2 className="text-3xl font-serif text-white mb-2 text-center">Create Account</h2>
                    <p className="text-gray-400 text-center mb-8 text-sm">Join our exclusive dining experience</p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                         transition-colors duration-300"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email" value={formData.email} onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                         transition-colors duration-300"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone" value={formData.phone} onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                         transition-colors duration-300"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                name="password" value={formData.password} onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                         transition-colors duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                         transition-colors duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 mr-2 accent-amber-400"
                            />
                            <label className="text-sm text-gray-400">
                                I agree to the{' '}
                                <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                                    Terms & Conditions
                                </a>
                                {' '}and{' '}
                                <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                     py-3 rounded-md font-semibold uppercase tracking-wider
                                     hover:shadow-lg hover:shadow-amber-500/50 
                                     transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}