// resources/js/Components/Navbar.tsx
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Menu, Moon, Settings, Sun, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js'; // <-- Ensure Ziggy is imported

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavLink } from './NavLink'; // Assuming NavLink is your custom styled Link

// --- START: TUTIA SPECIFIC LINK CONFIGURATION ---
const serviceLinks = [
    { title: 'E-Commerce', href: route('ecommerce') },
    { title: 'Bulk SMS', href: route('sms') },
    { title: 'Web Development', href: route('web') },
    { title: 'Connectivity Solution', href: route('connectivity') },
    { title: 'ICT Consulting', href: route('ict') },
    { title: 'Call Center', href: route('call_center') },
    { title: 'Ticketing System', href: route('ticketing') },
    { title: 'VPN', href: route('vpn') },
    { title: 'Payment Gateway', href: route('payment') },
    { title: 'ERP System', href: route('erp') },
];

const mainNavItems = [
    { href: route('home'), label: 'Home' },
    { href: '#', label: 'Services', isDropdown: true, children: serviceLinks },
    { href: route('public.promotions.index'), label: 'Offers' },
    { href: route('contact'), label: 'Contact Us' },
];
// --- END: TUTIA SPECIFIC LINK CONFIGURATION ---

export default function Navbar() {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // useEffect(() => {
    //     if (theme === 'dark') {
    //         document.documentElement.classList.add('dark');
    //     } else {
    //         document.documentElement.classList.remove('dark');
    //     }
    //     localStorage.setItem('theme', theme);
    // }, [theme]);

    // const toggleTheme = () => {
    //     setTheme(theme === 'light' ? 'dark' : 'light');
    // };

    // Dropdown Renderer
    const renderDropdown = (links: typeof serviceLinks) => (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        Services <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {links.map(item => (
                        <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href}>{item.title}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    return (
        <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-[#161615]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    {/* Left Section: Logo and Main Nav */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center py-1">
                            <img src="/logo-transparent.png" alt="Tutia Logo" className="h-12 w-auto rounded-full" />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden sm:flex space-x-8">
                            {mainNavItems.map((link) => {
                                if (link.isDropdown) {
                                    return <div key={link.href}>{renderDropdown(serviceLinks)}</div>;
                                }
                                return (
                                    <NavLink key={link.href} href={link.href}>
                                        {link.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Section: Theme Toggle and Hamburger (Mobile Only) */}
                    <div className="flex items-center space-x-4 sm:hidden">
                        {/* Mobile Theme Toggle */}
                        {/* <button onClick={toggleTheme} className="rounded-full p-2 text-gray-500 dark:text-gray-400">
                            <Sun className="h-5 w-5 dark:hidden" />
                            <Moon className="h-5 w-5 hidden dark:block" />
                            <span className="sr-only">Toggle theme</span>
                        </button> */}

                        {/* Mobile Hamburger Menu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-500 dark:text-gray-400"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
                <div
                    className="sm:hidden fixed inset-x-0 top-16 z-40 bg-white dark:bg-[#161615] shadow-xl overflow-y-auto"
                    // Set a max height to prevent it from exceeding the viewport height
                    style={{ maxHeight: 'calc(100vh - 4rem)' }}
                    id="mobile-menu"
                >
                    <div className="space-y-2 px-4 py-3">
                        {mainNavItems.map((link) => {
                            if (link.isDropdown) {
                                // --- SERVICE DROPDOWN GROUP ---
                                return (
                                    <div key={link.href} className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">
                                        {/* Group Title */}
                                        <div className="text-sm font-extrabold text-[#2980b9] dark:text-[#fdbe33] pb-2 px-1">
                                            {link.label.toUpperCase()}
                                        </div>
                                        {/* Child Links */}
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                            {link.children!.map(child => (
                                                <NavLink
                                                    key={child.href}
                                                    href={child.href}
                                                    // FIX: Use grid columns for side-by-side links (matches image concept)
                                                    className="rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {child.title}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            // --- STANDARD LINKS (Home, Offers, Blog, Contact Us) ---
                            return (
                                <NavLink
                                    key={link.href}
                                    href={link.href}
                                    // Make these main links stand out more
                                    className="block rounded-md px-3 py-3 text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
