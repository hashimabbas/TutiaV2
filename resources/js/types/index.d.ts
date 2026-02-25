import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}
export interface ProductCatalogItem {
    id: number;
    name: string;
    sku: string;
    description?: string;
    category?: string;
    unit_price: number;
    currency: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
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
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export type UserType = User;

export interface CompanyType {
    id: number;
    name: string;
    [key: string]: unknown;
}

export interface ContactType {
    id: number;
    first_name: string;
    last_name: string;
    company_id?: number | null;
    [key: string]: unknown;
}
export interface FlashMessageType {
    success?: string;
    error?: string;
}

// --- New Promotion Type for Public Offers ---
export interface Promotion {
    id: number;
    title: string;
    title_ar?: string;
    slug: string;
    description?: string;
    description_ar?: string;
    value?: number; // Original price for the promotion
    currency: string;
    discount_percentage?: number;
    start_date?: string; // ISO string
    end_date?: string; // ISO string
    is_active: boolean;
    image?: string;
    code?: string;
    usage_limit?: number;
    usage_count: number;
    user_usage_limit?: number;
    created_at: string;
    updated_at: string;
}

// --- Renamed OfferType to CrmOfferType for CRM Offers ---
export interface CrmOfferType {
    // Renamed from OfferType
    id: number;
    title: string;
    title_ar?: string;
    slug: string; // Still useful for unique identification
    description?: string;
    description_ar?: string;
    status: string; // e.g., 'draft', 'proposed', 'accepted'
    value?: number; // Monetary value of the CRM offer
    currency: string;
    probability?: number; // 0-100%
    expected_close_date?: string; // ISO date string
    actual_close_date?: string; // ISO date string
    offer_type: 'quote' | 'proposal' | 'service_package'; // CRM specific types
    notes?: string;

    company_id?: number;
    company?: CompanyType; // Eager loaded relationship
    contact_id?: number;
    contact?: ContactType; // Eager loaded relationship
    assigned_user_id?: number;
    assigned_user?: UserType; // Eager loaded relationship

    created_at: string;
    updated_at: string;

    // items will be loaded separately, so it's not a direct property unless eagerly loaded.
    // When eagerly loaded, it will be an array of OfferItemType
    items?: OfferItemType[];
}

export interface LeadSource {
    id: number;
    name: string;
}

export interface Opportunity {
    id: number;
    title: string;
    description?: string;
    value: number;
    stage: string;
    probability: number;
    expected_close_date?: string;
    company_id?: number;
    company?: CompanyType;
    contact_id?: number;
    contact?: ContactType;
    assigned_user_id?: number;
    assignedUser?: UserType;
    source_id?: number;
    source?: LeadSource;
    notes?: string;
    next_step_label?: string;
    next_step_due_date?: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: Auth;
    flash: FlashMessageType;
    [key: string]: unknown;
};

declare global {
    function route(name?: string, params?: any, absolute?: boolean): string;
}
