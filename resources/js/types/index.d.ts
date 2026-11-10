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
    storage?: StorageUsage;
    flash?: {
        success?: string;
        status?: string;
        error?: string;
    };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_admin?: boolean;
    initial?: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    user_storage_plan?: {
        id: number;
        storage_plan_id: number;
        billing_cycle?: string;
        status?: string;
        expires_at?: string;
        storage_plan_detail?: StoragePlanItem;
    };
    [key: string]: unknown;
}

export interface FileItem {
    id: number | string;
    name: string;
    type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'folder' | 'unknown' | string;
    mime_type?: string;
    uuid: string;
    folder_id?: number | null;
    size: number | string;
    size_in_kb?: string;
    size_in_mb: number | string;
    formatted_date?: string;
    total_downloads?: string | number;
    downloads?: number;
    is_favorite?: boolean;
    is_public?: boolean;
    share_token?: string | null;
    share_expires_at?: string | null;
    thumbnail?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface FolderItem {
    id: number;
    uuid: string;
    name: string;
    parent_id?: number | null;
    color?: string;
    files_count?: number;
    created_at?: string;
    updated_at?: string;
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

export interface StoragePlanItem {
    id: number;
    name: string;
    slug?: string;
    capacity: string | number;
    price_monthly: number | string;
    price_yearly: number | string;
    currency?: string;
    description?: string;
    features?: string[];
    max_file_size_mb?: number;
    is_popular?: boolean;
    is_active?: boolean;
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

export interface PaymentItem {
    id: number;
    user_id: number;
    storage_plan_id: number;
    reference: string;
    amount: string | number;
    currency: string;
    billing_cycle: string;
    provider: string;
    status: 'successful' | 'pending' | 'failed' | string;
    metadata?: Record<string, unknown>;
    paid_at?: string | null;
    created_at: string;
    plan?: StoragePlanItem;
    user?: User;
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
