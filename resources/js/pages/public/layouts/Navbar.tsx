// resources/js/Components/Navbar.tsx
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Rocket, Smartphone, Globe, Shield, HelpCircle, PhoneCall, Clock, CreditCard, Layout, Tractor, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- START: TUTIA SPECIFIC LINK CONFIGURATION ---
// const serviceLinks = [
//   { title: 'Satellite Agriculture', href: route('satellite_agriculture') },
//   { title: 'E-Commerce', href: route('ecommerce') },
//   { title: 'Bulk SMS', href: route('sms') },
//   { title: 'Web Development', href: route('web') },
//   { title: 'Connectivity Solution', href: route('connectivity') },
//   { title: 'ICT Consulting', href: route('ict') },
//   { title: 'Call Center', href: route('call_center') },
//   { title: 'Ticketing System', href: route('ticketing') },
//   { title: 'VPN', href: route('vpn') },
//   { title: 'Payment Gateway', href: route('payment') },
//   { title: 'ERP System', href: route('erp') },
// ];

// const mainNavItems = [
//   { href: route('home'), label: 'Home' },
//   { href: '#', label: 'Services', isDropdown: true, children: serviceLinks },
//   { href: route('public.promotions.index'), label: 'Offers' },
//   { href: route('contact'), label: 'Contact Us' },
// ];
// --- END: TUTIA SPECIFIC LINK CONFIGURATION ---

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const isRtl = i18n.language === 'ar';

  const navLinks = [
    { name: t('Home'), href: '/', icon: Layout },
    {
      name: t('Services'),
      href: '#',
      icon: Rocket,
      dropdown: [
        { name: t('Satellite Agriculture'), href: '/satellite-agriculture', icon: Tractor, desc: t('Precision farming solutions') },
        { name: t('Bulk SMS'), href: '/sms', icon: Smartphone, desc: t('Direct marketing reach') },
        { name: t('Web Development'), href: '/web', icon: Globe, desc: t('Custom digital experiences') },
        { name: t('Connectivity Solution'), href: '/connectivity', icon: Shield, desc: t('Secure network pipes') },
        { name: t('ICT Consulting'), href: '/ict', icon: HelpCircle, desc: t('Strategy & architecture') },
        { name: t('Call Center'), href: '/call_center', icon: PhoneCall, desc: t('Customer support excellence') },
        { name: t('Ticketing System'), href: '/ticketing', icon: Clock, desc: t('Support desk management') },
        { name: t('VPN'), href: '/vpn', icon: Shield, desc: t('Secure remote access') },
        { name: t('Payment Gateway'), href: '/payment', icon: CreditCard, desc: t('Seamless checkout flow') },
        { name: t('ERP System'), href: '/erp', icon: Layout, desc: t('Business resource planning') },
      ]
    },
    { name: t('Offers'), href: '/promotions', icon: Rocket },
    { name: t('Contact'), href: '/contact', icon: PhoneCall },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg py-2'
        : 'bg-white/95 dark:bg-slate-900 shadow-sm py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo-transparent.png"
              alt="Tutia logo"
              className="h-12 w-auto rounded-full transform group-hover:scale-110 transition-transform duration-300"
            />

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group px-1">
                {link.dropdown ? (
                  <button
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <link.icon className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''} ${isRtl ? 'mr-1' : 'ml-1'}`} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <link.icon className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {link.name}
                  </Link>
                )}

                {/* Mega Menu Style Dropdown */}
                {link.dropdown && (
                  <div
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 transition-all duration-300 transform origin-top ${activeDropdown === link.name ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                  >
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {link.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-start p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group/sub ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`p-2 bg-slate-100 dark:bg-slate-600 rounded-lg group-hover/sub:bg-primary/10 transition-colors ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <sub.icon className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover/sub:text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover/sub:text-primary">
                              {sub.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {sub.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1 ${isRtl ? 'mr-4' : 'ml-4'}`}
            >
              <Languages className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {i18n.language === 'en' ? 'عربي' : 'English'}
              </span>
            </button>


          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Languages className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {!link.dropdown ? (
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon className={`w-5 h-5 ${isRtl ? 'ml-3' : 'mr-3'}`} />
                      {link.name}
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <div className={`px-4 py-3 text-base font-bold text-slate-900 dark:text-white ${isRtl ? 'text-right' : 'text-left'}`}>
                        {link.name}
                      </div>
                      <div className="pl-4 grid grid-cols-1 gap-1">
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`flex items-center px-4 py-2 text-sm text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}
                            onClick={() => setIsOpen(false)}
                          >
                            <sub.icon className={`w-4 h-4 ${isRtl ? 'ml-3' : 'mr-3'}`} />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 px-4">
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t('Get Started')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
