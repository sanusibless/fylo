import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";


export default function DashboardLayout({ title,  children } : { title: string , children: ReactNode }) {
    return (
        <>
            <Head title={title} />
            <section className="bg-[#1c2431] text-white min-h-screen flex w-full">
                {children}
            </section>
            <Toaster position="top-right" richColors />
        </>

    );
}
