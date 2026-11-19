import HomeLayout from "@/layouts/home/layout";
import { usePage } from "@inertiajs/react";
import { FileCheck } from "lucide-react";
import { type SharedData } from "@/types";

export default function Terms() {
  const { appConfig } = usePage<SharedData>().props;
  const locationFull = appConfig?.location?.full || "Abuja, Federal Capital Territory (FCT), Nigeria";

  return (
    <HomeLayout title="Terms and Conditions — Fylo Cloud Storage">
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Terms and Conditions</h1>
          <p className="text-sm text-gray-400">{locationFull}</p>
        </div>
      </section>

      <section className="py-16 bg-[#1c2431]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-300 space-y-8 leading-relaxed text-sm">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">1. Acceptance of Terms</h3>
            <p>
              By registering an account or uploading files to the Fylo platform, you agree to abide
              by these Terms and Conditions and our Privacy Policy.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">2. Account Security</h3>
            <p>
              You are responsible for safeguarding your account password and any password-protected
              share links you generate. Please notify our support team immediately if you suspect
              unauthorized access to your account.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">3. Acceptable Use &amp; File Restrictions</h3>
            <p>
              You may not use Fylo to store or distribute unlawful content, malware, or executable
              scripts. For security reasons, Fylo restricts uploads to approved document, image,
              audio, video, and archive formats within your plan&apos;s maximum file size limit.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">4. Storage Plans &amp; Naira (₦) Billing</h3>
            <p>
              All paid storage plans are priced and billed in Nigerian Naira (₦ / NGN) on a monthly
              or annual cycle. You may upgrade your plan or turn off automatic renewal at any time
              from your Subscription &amp; Billing dashboard.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">5. Service Availability &amp; Backups</h3>
            <p>
              We strive to keep Fylo reliable and responsive at all times, but we recommend keeping
              local backup copies of critical documents.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">6. Governing Law</h3>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws
              of the Federal Republic of Nigeria, with jurisdiction in Abuja, FCT.
            </p>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
