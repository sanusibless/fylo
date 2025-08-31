import HomeLayout from "@/layouts/home/layout";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQs() {

  const [openIndex, setOpenIndex] = useState(null as number | null);

  const toggleFAQ = (index : number | null) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Fylo?",
      answer:
        "Fylo is a secure cloud storage and collaboration platform where you can store, share, and work on files in real time with your team.",
    },
    {
      question: "Is Fylo free to use?",
      answer:
        "Yes! Fylo offers a free plan with generous storage. For advanced features like unlimited collaboration and enhanced security, you can upgrade to a paid plan anytime.",
    },
    {
      question: "How secure are my files on Fylo?",
      answer:
        "Security is our top priority. Fylo uses end-to-end encryption and two-factor authentication to ensure your files are safe from unauthorized access.",
    },
    {
      question: "Can I access Fylo on mobile devices?",
      answer:
        "Absolutely! Fylo works seamlessly on desktops, tablets, and mobile phones through our responsive web app and dedicated mobile apps.",
    },
    {
      question: "How does real-time collaboration work?",
      answer:
        "Fylo allows multiple users to view, edit, and comment on files at the same time. No more sending endless versions — everyone stays on the same page.",
    },
    {
      question: "What file types can I upload to Fylo?",
      answer:
        "You can upload almost any type of file — from documents and spreadsheets to images, videos, and audio files. Fylo supports it all.",
    },
    {
      question: "Can I share files with people who don’t use Fylo?",
      answer:
        "Yes! You can generate secure shareable links for anyone, even if they don’t have a Fylo account.",
    },
  ];

  return (
    <HomeLayout>
        <section className=" text-white">
        <div className="max-w-4xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">
                Got questions? We’ve answered some of the most common ones about Fylo below.
            </p>
            </div>
            {/* FAQ List */}
            <div className="space-y-6">
            {faqs.map((faq, index) => (
                <div
                key={index}
                className="w-1/2 mx-auto  rounded-xl p-6 shadow-md transition hover:shadow-lg"
                >
                <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left"
                >
                    <span className="text-xl font-semibold">{faq.question}</span>
                    {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-blue-400" />
                    ) : (
                    <ChevronDown className="w-6 h-6 text-blue-400" />
                    )}
                </button>

                {openIndex === index && (
                    <p className="text-gray-400 mt-4 leading-relaxed">{faq.answer}</p>
                )}
                </div>
            ))}
            </div>
        </div>
        </section>
    </HomeLayout>
  );

}
