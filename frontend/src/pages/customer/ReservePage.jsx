import { useState } from "react";
import API from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Validation helpers
const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
};

const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s()+-]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7;
};

export default function ReservePage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
        specialRequests: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setMessage("");

        // Client-side validation
        const errors = {};

        if (!validateName(formData.name)) {
            errors.name = 'Name must be between 2 and 100 characters';
        }

        if (!validatePhone(formData.phone)) {
            errors.phone = 'Invalid phone number. Must contain at least 7 digits';
        }

        if (!formData.date) {
            errors.date = 'Date is required';
        }

        if (!formData.time) {
            errors.time = 'Time is required';
        }

        if (!formData.guests || formData.guests < 1) {
            errors.guests = 'Number of guests must be at least 1';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setMessage('Please fix the errors below');
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            const { data } = await API.post('/reservations', {
                name: formData.name,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                guests: parseInt(formData.guests),
                specialRequests: formData.specialRequests
            });

            setMessage("Reservation successful!");
            setFormData({
                name: "",
                phone: "",
                date: "",
                time: "",
                guests: "",
                specialRequests: ""
            });
            setFieldErrors({});

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <section className="pt-32 py-16 px-6 bg-black">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-serif text-white mb-4">Reserve a Table</h1>
                        <p className="text-gray-400">Book your dining experience with us</p>
                    </div>

                    <div className="bg-zinc-900 rounded-lg p-8 border border-amber-400/20">

                        {message && (
                            <div className={`mb-6 p-4 rounded-md text-center ${message.includes('successful')
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Full Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-black border rounded-md 
                                                 text-white focus:outline-none transition-colors duration-300 ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-amber-400/30 focus:border-amber-400'}`}
                                        placeholder="John Doe"
                                    />
                                    {fieldErrors.name && (
                                        <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Phone Number <span className="text-red-400">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-black border rounded-md 
                                                 text-white focus:outline-none transition-colors duration-300 ${fieldErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-amber-400/30 focus:border-amber-400'}`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {fieldErrors.phone && (
                                        <p className="text-red-400 text-sm mt-1">{fieldErrors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 bg-black border rounded-md 
                                                 text-white focus:outline-none transition-colors duration-300 ${fieldErrors.date ? 'border-red-500/50 focus:border-red-500' : 'border-amber-400/30 focus:border-amber-400'}`}
                                    />
                                    {fieldErrors.date && (
                                        <p className="text-red-400 text-sm mt-1">{fieldErrors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 bg-black border rounded-md 
                                                 text-white focus:outline-none transition-colors duration-300 ${fieldErrors.time ? 'border-red-500/50 focus:border-red-500' : 'border-amber-400/30 focus:border-amber-400'}`}
                                    />
                                    {fieldErrors.time && (
                                        <p className="text-red-400 text-sm mt-1">{fieldErrors.time}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Number of Guests</label>
                                <input
                                    type="number"
                                    name="guests"
                                    placeholder="Enter number of guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    min="1"
                                    max="20"
                                    required
                                    className={`w-full px-4 py-3 bg-black border rounded-md 
                                             text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 ${fieldErrors.guests ? 'border-red-500/50 focus:border-red-500' : 'border-amber-400/30 focus:border-amber-400'}`}
                                />
                                {fieldErrors.guests && (
                                    <p className="text-red-400 text-sm mt-1">{fieldErrors.guests}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Special Requests (Optional)</label>
                                <textarea
                                    name="specialRequest"
                                    placeholder="Any dietary restrictions, allergies, or special occasions?"
                                    value={formData.specialRequests}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-black border border-amber-400/30 rounded-md 
                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                         py-3 rounded-md font-semibold uppercase tracking-wider
                                         hover:shadow-lg hover:shadow-amber-500/50 
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-all duration-300"
                            >
                                {loading ? "Processing..." : "Reserve Now"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}