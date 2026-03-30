export function AppSidebar({ children }) {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
            <div className="h-full flex flex-col">
                {children}
            </div>
        </aside>
    );
}
