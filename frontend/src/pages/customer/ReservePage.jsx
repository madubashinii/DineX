import { useState } from "react";
import axios from "axios";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ReservePage() {
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        guests: "",
        specialRequest: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            const { data } = await axios.post(
                "http://localhost:5000/api/reservations",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Reservation successful 🎉");
            setFormData({
                date: "",
                time: "",
                guests: "",
                specialRequest: ""
            });

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
                                    <label className="block text-sm text-gray-300 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-black border border-amber-400/30 rounded-md 
                                                 text-white focus:outline-none focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-black border border-amber-400/30 rounded-md 
                                                 text-white focus:outline-none focus:border-amber-400"
                                    />
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
                                    className="w-full px-4 py-3 bg-black border border-amber-400/30 rounded-md 
                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Special Requests (Optional)</label>
                                <textarea
                                    name="specialRequest"
                                    placeholder="Any dietary restrictions, allergies, or special occasions?"
                                    value={formData.specialRequest}
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