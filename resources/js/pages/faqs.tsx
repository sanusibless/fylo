import HomeLayout from '@/layouts/home/layout';
import React, { useState } from 'react';

interface FaqItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    toggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, toggle }) => {
    return (
        <div className="border-b border-gray-700/60 last:border-0">
            <button
                onClick={toggle}
                className="flex w-full items-center justify-between py-5 text-left transition-all hover:text-teal-400 focus:outline-none"
            >
                <span className="text-lg font-semibold text-white">{question}</span>
                <span className={`ml-4 flex-shrink-0 transition-transform duration-300 text-teal-400 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-base leading-relaxed text-gray-300">
                    {answer}
                </p>
            </div>
        </div>
    );
};

interface FaqsPageProps {
    faqs: Array<{
        question: string;
        answer: string;
    }>;
}

export default function FaqAccordion({ faqs = [] }: FaqsPageProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <HomeLayout title="Frequently Asked Questions - Fylo">
            <section className="mx-auto max-w-3xl px-6 py-16">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Common Questions
                    </h2>
                    <p className="mt-4 text-gray-400">
                        Everything you need to know about Fylo's platform and security.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-[#1c2431] text-white p-6 shadow-sm">
                    <div className="flex flex-col divide-y divide-gray-700/60">
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
