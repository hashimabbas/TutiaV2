import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

import {
    LayoutDashboard,
    Gift, // Ideal for Public Promotions
    Users,
    MessageSquareText,
    Building2,
    Contact,
    Lightbulb,
    CheckSquare,
    Filter,
    Rss,
    ClipboardList,
    Package, // New icon for Product Catalog
    Eye, // For Visitors
} from 'lucide-react';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Companies',
        href: '/companies',
        icon: Building2,
    },
    {
        title: 'Contacts',
        href: '/contacts',
        icon: Contact,
    },
    {
        title: 'Opportunities',
        href: '/opportunities',
        icon: Lightbulb,
    },
    {
        title: 'Tasks',
        href: '/tasks',
        icon: CheckSquare,
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Messages',
        href: '/messages',
        icon: MessageSquareText,
    },
    {
        title: 'Lead Source',
        href: '/leadSources',
        icon: Filter,
    },
    {
        title: 'CRM Offers', // Renamed for clarity
        href: '/crm/offers', // Updated path for CRM-specific offers (quotes, proposals)
        icon: ClipboardList,
    },
    {
        title: 'Public Promotions',
        href: '/crm/promotions',
        icon: Gift,
    },
    {
        title: 'Product Catalog',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Visitors',
        href: '/visitors',
        icon: Eye,
    },
    // {
    //     title: 'Blog / CMS',
    //     href: 'dashboard/blog',
    //     icon: Rss,
    // },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
