import HomeLayout from '@/layouts/home/layout';
import React, { useState } from 'react';

const FaqItem = ({ question, answer, isOpen, toggle }) => {
    return (
        
            <div className="border-b border-gray-200 last:border-0">
                <button
                    onClick={toggle}
                    className="flex w-full items-center justify-between py-5 text-left transition-all hover:text-indigo-600 focus:outline-none"
                >
                    <span className="text-lg font-semibold">{question}</span>
                    <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <p className="text-base leading-relaxed text-gray-600">
                        {answer}
                    </p>
                </div>
            </div>
        
    );
};

export default function FaqAccordion({ faqs }) {
    // Stores the index of the open question (null = all closed)
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <HomeLayout>
            <section className="mx-auto max-w-3xl px-6 py-16">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight  sm:text-4xl">
                        Common Questions
                    </h2>
                    <p className="mt-4 text-gray-500">
                        Everything you need to know about Fylo's platform and security.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 text-white p-2 shadow-sm">
                    <div className="d-flex flex-col-3 px-6 divide-y divide-gray-100 ">
                        {faqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={activeIndex === index}
                                toggle={() => handleToggle(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}
