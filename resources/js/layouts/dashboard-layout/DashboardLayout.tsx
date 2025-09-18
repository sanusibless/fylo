

export default function DashboardLayout({ children } : React.PropsWithChildren) {
    return (
        <section className="bg-[#1c2431] text-white min-h-screen flex w-full">
            {children}
        </section>
    );
}