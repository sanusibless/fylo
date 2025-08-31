import HomeLayout from "@/layouts/home/layout";

export default function Features() {
  return (
        <HomeLayout>
            <section className="bg-gray-900 text-white py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Heading */}
                        <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                            Stay productive, wherever you are
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Fylo brings all your files together in one secure location.
                            Access them anytime, collaborate in real-time, and share with ease.
                        </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid gap-20 lg:gap-32">
                            <div className="flex flex-col-2 gap-12">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full max-w-sm mx-auto"
                                    fill="none"
                                    viewBox="0 0 100 100"
                                    >
                                    <path
                                        d="M20 70h60v10H20zM30 20h40l10 15H20z"
                                        stroke="white"
                                        strokeWidth="3"
                                        fill="transparent"
                                    />
                                    <circle cx="50" cy="60" r="8" fill="white" />
                                    </svg>
                                    <div>
                                    <h3 className="text-2xl font-bold mb-4">
                                        Access your files, anywhere
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Whether on your computer, tablet, or phone, your files follow
                                        you everywhere. Enjoy seamless synchronization across devices
                                        and platforms.
                                    </p>
                                    </div>
                                </div>
                                {/* Feature 2 */}
                                <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full max-w-sm mx-auto"
                                    fill="none"
                                    viewBox="0 0 100 100"
                                    >
                                    <rect
                                        x="25"
                                        y="30"
                                        width="50"
                                        height="40"
                                        stroke="white"
                                        strokeWidth="3"
                                        rx="5"
                                        ry="5"
                                    />
                                    <path d="M35 30v-8a15 15 0 0130 0v8" stroke="white" strokeWidth="3" />
                                    </svg>
                                    <div>
                                    <h3 className="text-2xl font-bold mb-4">Security you can trust</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        With two-factor authentication and end-to-end encryption, your
                                        files are safe from prying eyes. You control your data — always.
                                    </p>
                                    </div>
                                </div>
                            </div>
                            {/* Feature 1 */}

                            <div className="flex flex-col-2 gap-12">
                                {/* Feature 3 */}
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full max-w-sm mx-auto"
                                    fill="none"
                                    viewBox="0 0 100 100"
                                    >
                                    <circle cx="30" cy="40" r="10" stroke="white" strokeWidth="3" />
                                    <circle cx="70" cy="40" r="10" stroke="white" strokeWidth="3" />
                                    <path d="M30 60c10 5 30 5 40 0" stroke="white" strokeWidth="3" />
                                    </svg>
                                    <div>
                                    <h3 className="text-2xl font-bold mb-4">Real-time collaboration</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Work together with teammates as if you’re in the same room.
                                        Comment, share, and edit documents instantly without sending
                                        countless versions back and forth.
                                    </p>
                                    </div>
                                </div>

                                {/* Feature 4 */}
                                <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full max-w-sm mx-auto"
                                    fill="none"
                                    viewBox="0 0 100 100"
                                    >
                                    <rect
                                        x="20"
                                        y="25"
                                        width="60"
                                        height="50"
                                        stroke="white"
                                        strokeWidth="3"
                                    />
                                    <line x1="20" y1="40" x2="80" y2="40" stroke="white" strokeWidth="2" />
                                    <line x1="20" y1="55" x2="80" y2="55" stroke="white" strokeWidth="2" />
                                    </svg>
                                    <div>
                                    <h3 className="text-2xl font-bold mb-4">Store any type of file</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        From documents and spreadsheets to photos and videos — Fylo
                                        lets you store all types of files in one place, securely.
                                    </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="text-center mt-28">
                        <h3 className="text-3xl font-semibold mb-6">
                            Ready to simplify your file management?
                        </h3>
                        <a
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition"
                        >
                            Get Started
                        </a>
                        </div>
                    </div>
                </section>
        </HomeLayout>
  );
}
