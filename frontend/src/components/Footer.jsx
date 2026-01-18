export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'Menu', href: '#menu' },
            { name: 'Reservations', href: '#reservations' },
            { name: 'Private Events', href: '#private-events' },
            { name: 'Careers', href: '#careers' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#privacy' },
            { name: 'Terms of Service', href: '#terms' },
            { name: 'Cookie Policy', href: '#cookies' },
            { name: 'Accessibility', href: '#accessibility' },
        ],
    };

    return (
        <footer className="bg-zinc-950 border-t border-amber-400/10" id="contact">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    <div className="lg:col-span-1">
                        <h2 className="text-3xl font-serif tracking-[0.25em] text-amber-400 font-bold mb-4">
                            DineX
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Where culinary artistry meets timeless elegance. Experience fine dining
                            reimagined for the modern palate.
                        </p>

                    </div>

                    <div>
                        <h3 className="text-amber-400 font-semibold text-lg mb-4 uppercase tracking-wider">
                            Contact
                        </h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>123 Hotpot<br />Galle Road, Colombo</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-amber-400 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <a href="tel:+15551234567" className="hover:text-amber-400 transition-colors">
                                    (94) 7123-45672
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-amber-400 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <a href="mailto:info@luxedining.com" className="hover:text-amber-400 transition-colors">
                                    info@dinexdining.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-amber-400 font-semibold text-lg mb-4 uppercase tracking-wider">
                            Hours
                        </h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-500">Monday - Thursday</span>
                                <span className="text-gray-300">5:00 PM - 10:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500">Friday - Saturday</span>
                                <span className="text-gray-300">5:00 PM - 11:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500">Sunday</span>
                                <span className="text-gray-300">4:00 PM - 9:00 PM</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-amber-400 font-semibold text-lg mb-4 uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="hover:text-amber-400 transition-colors duration-300 
                             inline-flex items-center group"
                                    >
                                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                                            {link.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-amber-400/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} DineX Dining. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-500">
                            {footerLinks.legal.map((link, index) => (
                                <span key={link.name} className="flex items-center gap-6">
                                    <a
                                        href={link.href}
                                        className="hover:text-amber-400 transition-colors duration-300"
                                    >
                                        {link.name}
                                    </a>
                                    {index < footerLinks.legal.length - 1 && (
                                        <span className="text-gray-700">|</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
}