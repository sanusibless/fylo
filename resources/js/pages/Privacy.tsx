import HomeLayout from "@/layouts/home/layout";
import { Shield, Lock, FileText, CheckCircle } from "lucide-react";

export default function Privacy() {
  return (
    <HomeLayout title="Privacy Policy - Fylo Cloud Storage">
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection Commitment</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Fylo Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: November 2026</p>
        </div>
      </section>

      <section className="py-16 bg-[#1c2431]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-300 space-y-8 leading-relaxed text-sm">
          <div className="bg-[#202a3c] p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center">
              <Lock className="w-5 h-5 text-teal-400 mr-2" />
              1. Our Foundational Privacy Principle
            </h2>
            <p>
              At Fylo, we believe your files belong exclusively to you. We do not sell your personal
              information, scan your uploaded documents for advertising purposes, or share telemetry
              data with third-party tracking networks.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">2. Information We Collect</h3>
            <p>
              When you register for a Fylo account, we collect basic credentials including your name,
              email address, optional contact phone number, and hashed passwords. When subscribing to
              a paid storage tier, transaction tokens are securely verified via regulated payment
              processors (such as Paystack, Flutterwave, or Stripe); Fylo never stores raw credit card
              numbers on our servers.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">3. How Your Files Are Handled</h3>
            <p>
              All files uploaded through Fylo are encrypted in transit via TLS 1.3 and at rest with
              AES-256 standard encryption algorithms. File metadata (such as file name, file type,
              and size) is indexed strictly to power your file search, folder organization, and
              storage analytics.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">4. File Sharing &amp; Public Tokens</h3>
            <p>
              When you choose to generate a public share link, an unguessable cryptographic token is
              created. Only holders of that unique link (and the optional password you establish)
              can view or download that file. You can revoke access or set expiration dates at any
              moment directly from your file manager.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">5. Data Retention &amp; Deletion</h3>
            <p>
              When you move files to your Trash bin, you retain the ability to restore them for your
              plan's retention period (7 to 90 days). Once you permanently delete a file or close
              your account, all associated storage objects are permanently erased from our physical
              disks.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">6. Contact Our Data Protection Officer</h3>
            <p>
              If you have any questions or data access requests under GDPR or NDPR regulations,
              contact us directly at <span className="text-teal-400">privacy@fylo.storage</span>.
            </p>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
