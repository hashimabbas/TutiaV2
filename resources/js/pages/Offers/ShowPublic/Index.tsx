import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Offer } from '@/types'; // Assuming Offer includes value, currency, discount_percentage
import { format, differenceInDays, isBefore } from 'date-fns';
import { enUS, ar } from 'date-fns/locale'; // Import the Arabic locale
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CalendarDays,
    Percent, // Keep Percent if you use it elsewhere, or remove if not needed at all
    Timer,
    Gift,
    Clock,
    ArrowRight,
    Star,
    Sparkles,
    Search,
    Share2,
    Bookmark,
    BookmarkCheck,
    MessageCircle, // Added for WhatsApp
    Phone,
} from "lucide-react"
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
// import PublicTopBar from '@/pages/public/layouts/PublicTopBar';
// import PublicHero from '@/pages/Public/Partials/PublicHero';
import PublicLayout from '@/pages/public/layouts/PublicLayout';
import ServicesPageHeader from '@/pages/public/Partials/ServicesHeader';

interface Props {
    offers: Offer[];
    auth: {
        user: any;
    };
    flash: { success?: string; error?: string };
}

const breadcrumbs = [
    { label: 'Home', url: route('home') },
    { label: 'Offers' },
];
const defaultImageUrl = '/images/logo.png';

const MotionCard = motion(Card);

// --- New Helper for Currency Formatting ---
const formatCurrency = (value: number | null | undefined, currency?: string, locale: string = 'en-US'): string => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: currency || 'USD' }).format(value);
    } catch (e) {
        console.error("Error formatting currency:", e);
        return `${value} ${currency || 'USD'}`; // Fallback
    }
};
// --- End New Helper ---

const PublicOffersComponent: React.FC<Props> = ({ offers, auth, flash }) => {
    const { props } = usePage<{ locale: string }>();
    const { t, i18n } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [savedOffers, setSavedOffers] = useState<number[]>([]);

    const handleSaveOffer = (offerId: number) => {
        if (savedOffers.includes(offerId)) {
            setSavedOffers(savedOffers.filter(id => id !== offerId));
            toast({
                title: t('Offer removed from saved'),
                description: t('The offer has been removed from your saved items'),
                variant: 'default',
            });
        } else {
            setSavedOffers([...savedOffers, offerId]);
            toast({
                title: t('Offer saved'),
                description: t('The offer has been saved to your list'),
                variant: 'default',
            });
        }
    };

    const handleShare = async (offer: Offer) => {
        try {
            await navigator.share({
                title: getLocalizedText(offer, 'title'),
                text: getLocalizedText(offer, 'description'),
                url: window.location.href, // Or a specific offer URL if available
            });
        } catch (err) {
            toast({
                title: t('Sharing failed'),
                description: t('Unable to share the offer at this time'),
                variant: 'destructive',
            });
        }
    };

    const localizedFormat = (dateString: string | null, formatStr: string) => {
        if (!dateString) {
            return '';
        }
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return '';
            }
            const selectedLocale = i18n.language === 'ar' ? ar : enUS;

            return format(date, formatStr, { locale: selectedLocale });
        } catch (error) {
            console.error("Error formatting date:", error);
            return '';
        }
    };

    const getTimeRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const days = differenceInDays(end, now);
        return days > 0 ? days : 0;
    };

    const isRtl = i18n.language === 'ar';

    const getLocalizedText = (offer: Offer, field: string) => {
        const localizedFieldValue = i18n.language === 'ar' ? offer[`${field}_ar`] : offer[field];
        return localizedFieldValue || offer[field] || t('No description available.');
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const filterOffers = (offerList: Offer[]) => {
        return offerList
            .filter(offer => {
                const title = getLocalizedText(offer, 'title').toLowerCase();
                const description = getLocalizedText(offer, 'description').toLowerCase();
                const search = searchTerm.toLowerCase();
                return title.includes(search) || description.includes(search);
            })
            .sort((a, b) => {
                if (sortBy === 'discount') {
                    return (b.discount_percentage || 0) - (a.discount_percentage || 0);
                }
                if (sortBy === 'endingSoon') {
                    if (!a.end_date || !b.end_date) return 0;
                    return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
                }
                // Default: newest
                return new Date(b.start_date || '').getTime() - new Date(a.start_date || '').getTime();
            });
    };

    const activeOffers = filterOffers(offers.filter(offer => offer.is_active));
    const upcomingOffers = filterOffers(offers.filter(offer =>
        offer.is_active && offer.start_date && new Date(offer.start_date) > new Date()
    ));

    return (
        <PublicLayout
            title={t('Available Offers')}
            auth={auth}
            flash={flash}
        >

            <ServicesPageHeader title="Offers" breadcrumbs={breadcrumbs} />
            <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">

                <div className="py-16 px-4 sm:px-6 lg:px-8">
                    <Head title={t('Available Offers')} />

                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-block relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <h1 className="relative text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-4 py-2 px-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                                    <Sparkles className="inline-block w-8 h-8 mr-3 text-yellow-400 animate-pulse" />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-600">
                                        {t('Exclusive Offers')}
                                    </span>
                                </h1>
                            </motion.div>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
                                {t('Discover our amazing deals and special promotions, tailored specifically for your needs')}
                            </p>
                        </div>

                        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder={t('Search offers...')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder={t('Sort by')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">{t('Newest')}</SelectItem>
                                    <SelectItem value="discount">{t('Highest Discount')}</SelectItem>
                                    <SelectItem value="endingSoon">{t('Ending Soon')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Tabs defaultValue="active" className="w-full mb-8">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                                <TabsTrigger value="active">
                                    <Gift className="w-4 h-4 mr-2" />
                                    {t('Active Offers')}
                                </TabsTrigger>
                                <TabsTrigger value="upcoming">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {t('Upcoming Offers')}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="active">
                                <AnimatePresence>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                        {activeOffers.map((offer, index) => {
                                            const originalValue = offer.value || 0;
                                            const discountPercentage = offer.discount_percentage || 0;
                                            const finalPrice = originalValue * (1 - (discountPercentage / 100)); // Calculate final price if there's a discount
                                            const displayPrice = discountPercentage > 0 ? finalPrice : originalValue;
                                            const currency = offer.currency || 'SAR'; // Default currency

                                            return (
                                                <MotionCard
                                                    key={offer.id}
                                                    variants={cardVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    transition={{ delay: index * 0.1 }}
                                                    className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden flex flex-col h-full"
                                                >
                                                    <motion.div
                                                        className="relative overflow-hidden"
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.4 }}
                                                    >
                                                        <img
                                                            src={offer.image ? `/storage/${offer.image}` : defaultImageUrl}
                                                            alt={getLocalizedText(offer, 'title')}
                                                            className="w-full h-64 object-cover object-center transition-transform duration-500"
                                                            onError={(e: any) => {
                                                                e.target.src = defaultImageUrl;
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                            <p className="text-white text-sm font-medium line-clamp-2">
                                                                {getLocalizedText(offer, 'description')}
                                                            </p>
                                                        </div>
                                                        <div className="absolute top-4 right-4 space-x-2 flex z-10">
                                                            <Badge className="bg-green-500/90 backdrop-blur-md border-0 text-white font-semibold">
                                                                {t('Active')}
                                                            </Badge>
                                                        </div>
                                                        {offer.end_date && isBefore(new Date(offer.end_date), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) && (
                                                            <div className="absolute bottom-4 left-4 z-10">
                                                                <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-md border-0 text-white font-semibold flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {t('Ends in')} {getTimeRemaining(offer.end_date)} {t('days')}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </motion.div>

                                                    <CardHeader className="pb-2">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                                {getLocalizedText(offer, 'title')}
                                                            </CardTitle>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    onClick={() => handleShare(offer)}
                                                                    title={t('Share this offer')}
                                                                >
                                                                    <Share2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    onClick={() => handleSaveOffer(offer.id)}
                                                                    title={savedOffers.includes(offer.id) ? t('Remove from saved') : t('Save offer')}
                                                                >
                                                                    {savedOffers.includes(offer.id) ? (
                                                                        <BookmarkCheck className="h-4 w-4 text-primary" />
                                                                    ) : (
                                                                        <Bookmark className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <CardDescription className="text-sm line-clamp-2 text-gray-600 dark:text-gray-400">
                                                            {getLocalizedText(offer, 'description')}
                                                        </CardDescription>
                                                    </CardHeader>

                                                    <CardContent>
                                                        {/* --- Simplified Pricing Display --- */}
                                                        {displayPrice > 0 && (
                                                            <div className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                                                                {t('Price')}: {formatCurrency(displayPrice, currency, i18n.language)}
                                                            </div>
                                                        )}
                                                        {/* --- End Simplified Pricing Display --- */}

                                                        <Separator className="my-4" />
                                                        <div className="space-y-3">
                                                            <TooltipProvider>
                                                                {offer.start_date && (
                                                                    <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                        <CalendarDays className="h-5 w-5" />
                                                                        <span>{t('Starts')}: {localizedFormat(offer.start_date, 'PPP')}</span>
                                                                    </div>
                                                                )}

                                                                {offer.end_date && (
                                                                    <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                        <Timer className="h-5 w-5" />
                                                                        <span>{t('Ends')}: {localizedFormat(offer.end_date, 'PPP')}</span>
                                                                    </div>
                                                                )}
                                                            </TooltipProvider>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter>
                                                        <Button
                                                            asChild
                                                            className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0e6b60] text-white font-bold py-6 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-3 border-0"
                                                        >
                                                            <a
                                                                href={`https://api.whatsapp.com/send?phone=249912329449&text=${encodeURIComponent(t('Hello, I am interested in the offer: ') + getLocalizedText(offer, 'title'))}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-3 w-full h-full text-white no-underline hover:text-white"
                                                            >
                                                                <div className="bg-white/20 p-1.5 rounded-full ring-1 ring-white/30">
                                                                    <MessageCircle className="w-5 h-5" />
                                                                </div>
                                                                <span className="text-lg tracking-wide">{t('Contact on WhatsApp')}</span>
                                                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                            </a>
                                                        </Button>
                                                    </CardFooter>
                                                </MotionCard>
                                            );
                                        })}
                                    </div>
                                </AnimatePresence>
                                {activeOffers.length === 0 && (
                                    <div className="text-center py-12">
                                        <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                            {searchTerm ? t('No matching offers found') : t('No Active Offers')}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {searchTerm ? t('Try adjusting your search terms') : t('Check back soon for new offers and promotions!')}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="upcoming">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                    {upcomingOffers.map((offer, index) => {
                                        const originalValue = offer.value || 0;
                                        const discountPercentage = offer.discount_percentage || 0;
                                        const finalPrice = originalValue * (1 - (discountPercentage / 100));
                                        const displayPrice = discountPercentage > 0 ? finalPrice : originalValue;
                                        const currency = offer.currency || 'SAR';

                                        return (
                                            <MotionCard
                                                key={offer.id}
                                                variants={cardVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden flex flex-col h-full"
                                            >
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={offer.image ? `/storage/${offer.image}` : defaultImageUrl}
                                                        alt={getLocalizedText(offer, 'title')}
                                                        className="w-full h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e: any) => {
                                                            e.target.src = defaultImageUrl;
                                                        }}
                                                    />
                                                    <div className="absolute top-4 right-4 space-x-2">
                                                        <Badge variant="secondary" className="bg-blue-500/90 backdrop-blur-sm">
                                                            {t('Upcoming')}
                                                        </Badge>
                                                        {/* Removed the discount percentage badge here to match original image */}
                                                    </div>
                                                </div>

                                                <CardHeader>
                                                    <CardTitle className="text-2xl font-bold">
                                                        {getLocalizedText(offer, 'title')}
                                                    </CardTitle>
                                                    <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                                                        {getLocalizedText(offer, 'description')}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent>
                                                    {/* --- Simplified Pricing Display for Upcoming --- */}
                                                    {displayPrice > 0 && (
                                                        <div className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                                                            {t('Price')}: {formatCurrency(displayPrice, currency, i18n.language)}
                                                        </div>
                                                    )}
                                                    {/* --- End Simplified Pricing Display --- */}

                                                    <Separator className="my-4" />
                                                    <div className="space-y-3">
                                                        <TooltipProvider>
                                                            {offer.start_date && (
                                                                <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                    <CalendarDays className="h-5 w-5" />
                                                                    <span>{t('Starts')}: {localizedFormat(offer.start_date, 'PPP')}</span>
                                                                </div>
                                                            )}

                                                            {offer.end_date && (
                                                                <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                    <Timer className="h-5 w-5" />
                                                                    <span>{t('Ends')}: {localizedFormat(offer.end_date, 'PPP')}</span>
                                                                </div>
                                                            )}
                                                        </TooltipProvider>
                                                    </div>
                                                </CardContent>

                                                <CardFooter>
                                                    <Button
                                                        asChild
                                                        className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0e6b60] text-white font-bold py-6 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-3 border-0"
                                                    >
                                                        <a
                                                            href={`https://api.whatsapp.com/send?phone=249912329449&text=${encodeURIComponent(t('Hello, I am interested in the upcoming offer: ') + getLocalizedText(offer, 'title'))}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-3 w-full h-full text-white no-underline hover:text-white"
                                                        >
                                                            <div className="bg-white/20 p-1.5 rounded-full ring-1 ring-white/30">
                                                                <MessageCircle className="w-5 h-5" />
                                                            </div>
                                                            <span className="text-lg tracking-wide">{t('Notify on WhatsApp')}</span>
                                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                        </a>
                                                    </Button>
                                                </CardFooter>
                                            </MotionCard>
                                        );
                                    })}
                                </div>
                                {upcomingOffers.length === 0 && (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                            {t('No Upcoming Offers')}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {t('Stay tuned for future promotions!')}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
        </PublicLayout>
    );
};

export default PublicOffersComponent;
