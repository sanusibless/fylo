import HomeLayout from "@/layouts/home/layout";
import { FileCheck, AlertCircle, ShieldAlert } from "lucide-react";

export default function Terms() {
  return (
    <HomeLayout title="Terms and Conditions - Fylo Cloud Storage">
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Terms and Conditions</h1>
          <p className="text-sm text-gray-400">Effective Date: November 2026</p>
        </div>
      </section>

      <section className="py-16 bg-[#1c2431]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-300 space-y-8 leading-relaxed text-sm">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">1. Acceptance of Terms</h3>
            <p>
              By creating an account, browsing the website, or uploading any assets to the Fylo
              cloud platform, you agree to be bound by these Terms and Conditions and our Privacy
              Policy. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">2. User Accounts &amp; Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your credentials and account
              access. You agree to notify Fylo immediately if you suspect any unauthorized access to
              your account. Fylo will not be liable for any loss resulting from unauthorized use of
              your account.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">3. Acceptable Use Policy</h3>
            <p>
              You may not use Fylo to store, distribute, or transmit any illegal materials, malware,
              copyright-infringing works, or content that violates intellectual property rights. Fylo
              reserves the right to terminate accounts that violate this policy.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">4. Subscriptions, Payments &amp; Cancellations</h3>
            <p>
              Paid subscription plans are billed in advance on either a monthly or annual recurring
              cycle. You may cancel your subscription at any time via your Account Settings; your
              premium benefits will remain active until the end of your prepaid billing term.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">5. Service Availability &amp; Limitations</h3>
            <p>
              While Fylo maintains an uptime SLA of 99.99%, we cannot guarantee uninterrupted access
              during scheduled maintenance or force majeure events. We recommend maintaining regular
              local backups of mission-critical files.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">6. Governing Law</h3>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the
              applicable laws, without regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
