import HomeLayout from '@/layouts/home/layout';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <HomeLayout title="Welcome to Fylo, a secure cloud storage and collaboration platform.">
                <main className="bg-[#1c2431]/95 p-6">
                    {/* Intro */}
                    <section className="text-center mb-16">
                    <div className="w-3/4 mx-auto mb-6">
                        <img src="images/illustration-intro.png" alt="Intro Illustration" className="mx-auto" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        All your files in one location, accessible anywhere
                    </h2>
                    <p className="mb-6 text-gray-300">
                        Fylo stores all your most important files in one secure location.
                        Access them wherever you need, share and collaborate with friends,
                        family, and co-workers.
                    </p>
                    <a href="#" className="inline-block bg-gradient-to-r from-teal-300 to-blue-500 text-white px-6 py-3 rounded-full hover:from-teal-200 hover:to-teal-400 transition">Get Started</a>
                    </section>
                    {/* Features */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 text-center">
                    <div>
                        <img src="images/icon-access-anywhere.svg" className="mx-auto mb-4" />
                        <h4 className="text-lg font-semibold">Access your files, anywhere</h4>
                        <p className="text-gray-300">
                        The ability to use a smartphone, tablet, or computer to access your
                        account means your files follow you everywhere.
                        </p>
                    </div>
                    <div>
                        <img src="images/icon-security.svg" className="mx-auto mb-4" />
                        <h4 className="text-lg font-semibold">Security you can trust</h4>
                        <p className="text-gray-300">
                        2-factor authentication and user-controlled encryption are just a
                        couple of the security features we allow to help secure your files.
                        </p>
                    </div>
                    <div>
                        <img src="images/icon-collaboration.svg" className="mx-auto mb-4" />
                        <h4 className="text-lg font-semibold">Real-time collaboration</h4>
                        <p className="text-gray-300">
                        Securely share files and folders with friends, family, and
                        colleagues for live collaboration. No email attachments required.
                        </p>
                    </div>
                    <div>
                        <img src="images/icon-any-file.svg" className="mx-auto mb-4" />
                        <h4 className="text-lg font-semibold">Store any type of file</h4>
                        <p className="text-gray-300">
                        Whether you're sharing holiday photos or work documents, Fylo has
                        you covered allowing all file types to be securely stored and
                        shared.
                        </p>
                    </div>
                    </section>
                    {/* Productive Section */}
                    <section className="flex flex-col md:flex-row items-center gap-10 mb-20">
                    <div className="md:w-1/2">
                        <img src="images/illustration-stay-productive.png" alt="Stay Productive" className="mx-auto" />
                    </div>
                    <div className="md:w-1/2">
                        <h4 className="text-xl font-semibold mb-4">
                        Stay productive, wherever you are
                        </h4>
                        <p className="mb-3 text-gray-300">
                        Never let location be an issue when accessing your files. Fylo has
                        you covered for all your storage needs.
                        </p>
                        <p className="mb-3 text-gray-300">
                        Securely share files and folders with friends, family, and
                        colleagues for live collaboration. No email attachments required.
                        </p>
                        <a href="#" className="text-teal-300 border-b border-teal-300 hover:text-white">See how Fylo works <img src="images/icon-arrow.svg" className="inline" /></a>
                    </div>
                    </section>
                    {/* Testimonials */}
                    <section className="grid md:grid-cols-3 gap-6 mb-32">
                    <div className="bg-[#202a3c] p-6 rounded">
                        <p className="mb-6">
                        Fylo has improved our team productivity by an order of magnitude.
                        Since making the switch our team has become a well-oiled machine.
                        </p>
                        <div className="flex items-center">
                        <img src="images/profile-1.jpg" alt="profile-1" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="font-bold">Satish Patel</p>
                            <p className="text-gray-400 text-sm">Founder &amp; CEO, Huddle</p>
                        </div>
                        </div>
                    </div>
                    <div className="bg-[#202a3c] p-6 rounded">
                        <p className="mb-6">
                        Fylo has improved our team productivity by an order of magnitude.
                        Since making the switch our team has become a well-oiled machine.
                        </p>
                        <div className="flex items-center">
                        <img src="images/profile-2.jpg" alt="profile-2" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="font-bold">Bruce McKenzie</p>
                            <p className="text-gray-400 text-sm">Founder &amp; CEO, Huddle</p>
                        </div>
                        </div>
                    </div>
                    <div className="bg-[#202a3c] p-6 rounded">
                        <p className="mb-6">
                        Fylo has improved our team productivity by an order of magnitude.
                        Since making the switch our team has become a well-oiled machine.
                        </p>
                        <div className="flex items-center">
                        <img src="images/profile-3.jpg" alt="profile-3" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="font-bold">Iva Boyd</p>
                            <p className="text-gray-400 text-sm">Founder &amp; CEO, Huddle</p>
                        </div>
                        </div>
                    </div>
                    </section>
                    {/* Register */}
                    <section className="bg-[#1c2431] p-8 text-center rounded-lg max-w-3xl mx-auto mb-20">
                    <h1 className="text-2xl font-bold mb-4">Get early access today</h1>
                    <p className="text-gray-300 mb-6">
                        It only takes a minute to sign up and our free starter tier is very
                        generous. If you have questions, our support team would be happy to
                        help.
                    </p>
                    <form className="flex flex-col md:flex-row gap-4 justify-center">
                        <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded-full text-white flex-1 border-1 border-white focus:outline-none" />
                        <button type="submit" className="bg-gradient-to-r from-teal-300 to-blue-500 px-6 py-3 rounded-full text-white hover:from-teal-200 hover:to-teal-400">
                        Get Started For Free
                        </button>
                    </form>
                    </section>
                </main>
        </HomeLayout>
    );
}
