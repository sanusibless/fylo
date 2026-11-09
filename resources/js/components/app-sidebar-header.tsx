import { type BreadcrumbItem } from "@/types";

interface AppSidebarHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppSidebarHeader({ breadcrumbs = [] }: AppSidebarHeaderProps) {
    const title = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : 'Dashboard';
    return (
        <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
                {title}
            </h2>
        </div>
    );
}
