import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs }: AppLayoutProps) => {
    const title = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : 'Account Settings';
    return (
        <DashboardLayout title={`${title} - Fylo`}>
            {children}
        </DashboardLayout>
    );
};
