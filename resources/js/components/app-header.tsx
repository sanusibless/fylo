import { type BreadcrumbItem } from "@/types";

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const title = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : 'Fylo';
    return (
        <header className="px-6 py-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </header>
    );
}
