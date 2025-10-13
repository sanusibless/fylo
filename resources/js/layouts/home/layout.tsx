import { faqs, features, home, login } from "@/routes";
import { Head, Link } from "@inertiajs/react";



export default function HomeLayout({ title, children }: { title : string, children: React.ReactNode }) {
    return <>
                <Head title={title} />
                <header className="bg-[#0b1523] flex justify-between items-center px-6 py-4">
                    <div className="w-1/3">
                        <Link href={home()}><img src="images/logo.svg" alt="Fylo Logo" className="w-32" />
                        </Link>
                    </div>
                    <nav className="w-2/3 text-right">
                    <ul className="flex justify-end space-x-8">
                        <li><Link href={features()} className="text-gray-300 hover:text-white">Features </Link></li>
                        <li><Link href="" className="text-gray-300 hover:text-white">Team </Link></li>
                        <li><Link href={faqs()} className="text-gray-300 hover:text-white">FAQs </Link></li>
                        <li><Link href={login()}  className="text-gray-300 hover:text-white">Sign in</Link></li>
                    </ul>
                    </nav>
                </header>
                <section className="bg-[#1c2431] text-white">
                {children}
                </section>
                <footer className="bg-[#0b1523] text-gray-400 px-6 py-16">
                            <div className="max-w-6xl mx-auto">
                            <img src="images/logo.svg" alt="Fylo Logo" className="mb-6 w-32" />
                            <div className="grid md:grid-cols-4 gap-10">
                                <div className="flex items-start space-x-4">
                                <img src="images/icon-location.svg" alt="location" />
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam,
                                    sequi rerum.
                                </p>
                                </div>
                                <div>
                                <p className="flex items-center mb-3">
                                    <img src="images/icon-phone.svg" className="mr-2" /> +1-543-123-4567
                                </p>
                                <p className="flex items-center">
                                    <img src="images/icon-email.svg" className="mr-2" /> example@fylo.com
                                </p>
                                </div>
                                <ul>
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Jobs</a></li>
                                <li><a href="#" className="hover:text-white">Press</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                </ul>
                                <ul>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">Terms</a></li>
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                                </ul>
                            </div>
                            </div>
                </footer>
            </>
}
