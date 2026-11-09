import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    initial?: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface FileItem {
    id: number | string;
    name: string;
    type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'folder' | 'unknown' | string;
    uuid: string;
    size: number | string;
    size_in_kb?: string;
    size_in_mb: number | string;
    formatted_date?: string;
    total_downloads?: string | number;
    downloads?: number;
    is_favorite?: boolean;
    thumbnail?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface SharedFileItem {
    file: FileItem;
    sharedBy: {
        name: string;
        email: string;
    };
    sharedDate: string;
}

export interface ActivityItem {
    id: number;
    description: string;
    created_at: string;
    updated_at?: string;
    causer_id?: number;
    causer_type?: string;
    properties?: Record<string, unknown>;
}

export interface StorageUsage {
    totalUsed: number | string;
    totalAvailable: number | string;
    planName?: string;
    availableStorage?: {
        id?: number;
        name?: string;
        capacity?: string | number;
    } | null;
}

export interface PaginatedData<T> {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page?: number;
}
