import { useState } from "react";
import HomeLayout from "@/layouts/home/layout";
import { useForm, usePage } from "@inertiajs/react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";

export default function Contact() {
  const { flash } = usePage<{ flash?: { success?: string } }>().props;

  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/contact", {
      onSuccess: () => reset(),
    });
  };

  return (
    <HomeLayout title="Contact Support & Sales - Fylo">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>We're Here To Help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Get in Touch with Fylo
          </h1>
          <p className="text-base text-gray-300 max-w-xl mx-auto">
            Have questions regarding storage quotas, security compliance, or team enterprise billing?
            Drop us a message and our technical team will respond in under 2 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[#1c2431]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Reach Our Global Support</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Our cloud engineers and account managers are situated across multiple time zones to
                  ensure prompt assistance whenever you need it.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-[#202a3c] border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Direct Email</h4>
                    <p className="text-xs text-gray-400 mt-1">General: support@fylo.storage</p>
                    <p className="text-xs text-gray-400">Enterprise: sales@fylo.storage</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-[#202a3c] border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Phone Support</h4>
                    <p className="text-xs text-gray-400 mt-1">+1 (800) 555-FYLO (US / International)</p>
                    <p className="text-xs text-gray-400">+234 1 234 5678 (West Africa Hub)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-[#202a3c] border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Response Time Guarantee</h4>
                    <p className="text-xs text-gray-400 mt-1">Free Tier: Within 24 business hours</p>
                    <p className="text-xs text-teal-300">Pro &amp; Business: 1 hour prioritized response</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-[#202a3c] p-8 md:p-10 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-2">Send us a Message</h3>
              <p className="text-sm text-gray-400 mb-8">
                Fill in the form below and we'll reply to your provided email address.
              </p>

              {(recentlySuccessful || flash?.success) && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>{flash?.success || "Your message has been sent successfully!"}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-xs font-semibold text-gray-300">
                      Your Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      className="mt-1.5 bg-[#1c2431] border-slate-700 text-white"
                    />
                    <InputError message={errors.name} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      className="mt-1.5 bg-[#1c2431] border-slate-700 text-white"
                    />
                    <InputError message={errors.email} className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-xs font-semibold text-gray-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    placeholder="e.g. Inquiry regarding Business Plan billing"
                    value={data.subject}
                    onChange={(e) => setData("subject", e.target.value)}
                    className="mt-1.5 bg-[#1c2431] border-slate-700 text-white"
                  />
                  <InputError message={errors.subject} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="message" className="text-xs font-semibold text-gray-300">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="How can our team help your workflow today?"
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    className="w-full mt-1.5 rounded-md bg-[#1c2431] border border-slate-700 text-white text-sm p-3 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-500"
                  />
                  <InputError message={errors.message} className="mt-1" />
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold py-3 rounded-xl shadow-md transition"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>{processing ? "Sending..." : "Send Message"}</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
