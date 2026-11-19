import HomeLayout from "@/layouts/home/layout";
import { usePage } from "@inertiajs/react";
import { Shield, Lock } from "lucide-react";
import { type SharedData } from "@/types";

export default function Privacy() {
  const { appConfig } = usePage<SharedData>().props;
  const privacyEmail = appConfig?.contact?.privacy_email || "privacy@fylo.ng";
  const locationFull = appConfig?.location?.full || "Abuja, Federal Capital Territory (FCT), Nigeria";

  return (
    <HomeLayout title="Privacy Policy — Fylo Cloud Storage">
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection &amp; Privacy</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Fylo Privacy Policy</h1>
          <p className="text-sm text-gray-400">Operated from {locationFull}</p>
        </div>
      </section>

      <section className="py-16 bg-[#1c2431]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-300 space-y-8 leading-relaxed text-sm">
          <div className="bg-[#202a3c] p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center">
              <Lock className="w-5 h-5 text-teal-400 mr-2" />
              1. Our Privacy Principle
            </h2>
            <p>
              At Fylo, your uploaded files belong to you. We do not sell your personal information,
              analyze your private documents for advertising, or expose your files to unauthorized
              third parties.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">2. Information We Collect</h3>
            <p>
              When you register for a Fylo account, we collect your name, email address, optional
              Nigerian or international phone number, and a bcrypt-hashed password. When you upgrade
              to a paid storage plan in Nigerian Naira (₦ / NGN), transaction references and billing
              records are stored for your invoice history.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">3. How Your Files Are Stored &amp; Served</h3>
            <p>
              Uploaded files are stored in private server storage and served through authenticated
              controller endpoints that verify ownership or shared access rights. File metadata
              (name, extension, size, and folder assignment) is stored in our database to power
              search, folder organization, and storage quota calculations.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">4. File Sharing &amp; Public Tokens</h3>
            <p>
              When you generate a public share link, a unique 32-character token is created. Only
              visitors with that link (and the optional password you configure) can preview or
              download the shared file. You can revoke public share links at any time.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">5. Data Retention &amp; Account Deletion</h3>
            <p>
              Files moved to the Recycle Bin remain recoverable until you permanently delete them or
              empty your Trash. When you permanently delete a file or delete your account from
              Profile Settings, your physical files and associated metadata are permanently removed
              from our storage system.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">6. Nigeria Data Protection Compliance</h3>
            <p>
              We handle personal data in accordance with the Nigeria Data Protection Act (NDPA). For
              privacy inquiries or data requests, contact our team in Abuja at{" "}
              <a href={`mailto:${privacyEmail}`} className="text-teal-400 hover:underline">
                {privacyEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
