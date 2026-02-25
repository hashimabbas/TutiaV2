// resources/js/Pages/PublicPromotions/Index.tsx

import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Promotion as PromotionType } from '@/types'; // Import as PromotionType to avoid conflict
import { format, differenceInDays, isBefore } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    CalendarDays, Timer, Gift, Clock, ArrowRight, Star, Sparkles,
    Search, Share2, Bookmark, BookmarkCheck, MessageCircle, Phone,
} from "lucide-react"
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import PublicLayout from '@/pages/public/layouts/PublicLayout';
import ServicesPageHeader from '@/pages/public/Partials/ServicesHeader';
import { route } from 'ziggy-js';

interface Props {
    offers: PromotionType[]; // Now receiving Promotions, but keeping 'offers' prop name for convenience
    auth: { user: any; };
    flash: { success?: string; error?: string };
}

const breadcrumbs = [
    { label: 'Home', url: route('home') },
    { label: 'Promotions' }, // Updated breadcrumb
];
const defaultImageUrl = '/images/logo.png';

const MotionCard = motion(Card);

const formatCurrency = (value: number | null | undefined, currency?: string, locale: string = 'en-US'): string => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: currency || 'SAR' }).format(value);
    } catch (e) {
        console.error("Error formatting currency:", e);
        return `${value} ${currency || 'SAR'}`;
    }
};

const PublicPromotionsIndex: React.FC<Props> = ({ offers, auth, flash }) => { // Renamed component
    const { props } = usePage<{ locale: string }>();
    const { t, i18n } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [savedPromotions, setSavedPromotions] = useState<number[]>([]); // Renamed savedOffers

    const handleSavePromotion = (promotionId: number) => { // Renamed handler
        if (savedPromotions.includes(promotionId)) {
            setSavedPromotions(savedPromotions.filter(id => id !== promotionId));
            toast({
                title: t('Promotion removed from saved'),
                description: t('The promotion has been removed from your saved items'),
                variant: 'default',
            });
        } else {
            setSavedPromotions([...savedPromotions, promotionId]);
            toast({
                title: t('Promotion saved'),
                description: t('The promotion has been saved to your list'),
                variant: 'default',
            });
        }
    };

    const handleShare = async (promotion: PromotionType) => {
        try {
            await navigator.share({
                title: getLocalizedText(promotion, 'title'),
                text: getLocalizedText(promotion, 'description'),
                url: route('public.promotions.show', promotion.slug), // Link to individual promotion page
            });
        } catch (err) {
            toast({
                title: t('Sharing failed'),
                description: t('Unable to share the promotion at this time'),
                variant: 'destructive',
            });
        }
    };

    const localizedFormat = (dateString: string | null, formatStr: string) => {
        if (!dateString) { return ''; }
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) { return ''; }
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

    const getLocalizedText = (promotion: PromotionType, field: string) => {
        const localizedFieldValue = i18n.language === 'ar' ? promotion[`${field}_ar`] : promotion[field];
        return localizedFieldValue || promotion[field] || t('No description available.');
    };

    const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    const filterPromotions = (promotionList: PromotionType[]) => { // Renamed filterOffers
        return promotionList
            .filter(promotion => {
                const title = getLocalizedText(promotion, 'title').toLowerCase();
                const description = getLocalizedText(promotion, 'description').toLowerCase();
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
                return new Date(b.start_date || '').getTime() - new Date(a.start_date || '').getTime();
            });
    };

    const activePromotions = filterPromotions(offers.filter(promotion => promotion.is_active)); // Renamed
    const upcomingPromotions = filterPromotions(offers.filter(promotion => // Renamed
        promotion.is_active && promotion.start_date && new Date(promotion.start_date) > new Date()
    ));

    return (
        <PublicLayout title={t('Available Promotions')} auth={auth} flash={flash}> {/* Updated title */}
            <ServicesPageHeader title="Promotions" breadcrumbs={breadcrumbs} /> {/* Updated title */}
            <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="py-16 px-4 sm:px-6 lg:px-8">
                    <Head title={t('Available Promotions')} /> {/* Updated title */}
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
                                        {t('Exclusive Promotions')}
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
                                    placeholder={t('Search promotions...')}
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
                                    {t('Active Promotions')} {/* Updated tab title */}
                                </TabsTrigger>
                                <TabsTrigger value="upcoming">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {t('Upcoming Promotions')} {/* Updated tab title */}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="active">
                                <AnimatePresence>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                        {activePromotions.map((promotion, index) => { // Renamed offer to promotion
                                            const originalValue = promotion.value || 0;
                                            const discountPercentage = promotion.discount_percentage || 0;
                                            const finalPrice = originalValue * (1 - (discountPercentage / 100));
                                            const displayPrice = discountPercentage > 0 ? finalPrice : originalValue;
                                            const currency = promotion.currency || 'SAR';

                                            return (
                                                <MotionCard
                                                    key={promotion.id}
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
                                                            src={promotion.image ? `/storage/${promotion.image}` : defaultImageUrl}
                                                            alt={getLocalizedText(promotion, 'title')}
                                                            className="w-full h-64 object-cover object-center transition-transform duration-500"
                                                            onError={(e: any) => { e.target.src = defaultImageUrl; }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                            <p className="text-white text-sm font-medium line-clamp-2">
                                                                {getLocalizedText(promotion, 'description')}
                                                            </p>
                                                        </div>
                                                        <div className="absolute top-4 right-4 space-x-2 flex">
                                                            <Badge className="bg-green-500/90 backdrop-blur-md border-0 text-white font-semibold">
                                                                {t('Active')}
                                                            </Badge>
                                                        </div>
                                                        {promotion.end_date && isBefore(new Date(promotion.end_date), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) && (
                                                            <div className="absolute bottom-4 left-4">
                                                                <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-md border-0 text-white font-semibold flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {t('Ends in')} {getTimeRemaining(promotion.end_date)} {t('days')}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </motion.div>

                                                    <CardHeader className="pb-2">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                                {getLocalizedText(promotion, 'title')}
                                                            </CardTitle>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    onClick={() => handleShare(promotion)}
                                                                    title={t('Share this promotion')}
                                                                >
                                                                    <Share2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    onClick={() => handleSavePromotion(promotion.id)}
                                                                    title={savedPromotions.includes(promotion.id) ? t('Remove from saved') : t('Save promotion')}
                                                                >
                                                                    {savedPromotions.includes(promotion.id) ? (
                                                                        <BookmarkCheck className="h-4 w-4 text-primary" />
                                                                    ) : (
                                                                        <Bookmark className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <CardDescription className="text-sm line-clamp-2 text-gray-600 dark:text-gray-400">
                                                            {getLocalizedText(promotion, 'description')}
                                                        </CardDescription>
                                                    </CardHeader>

                                                    <CardContent>
                                                        {displayPrice > 0 && (
                                                            <div className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                                                                {t('Price')}: {formatCurrency(displayPrice, currency, i18n.language)}
                                                            </div>
                                                        )}
                                                        <Separator className="my-4" />
                                                        <div className="space-y-3">
                                                            <TooltipProvider>
                                                                {promotion.start_date && (
                                                                    <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                        <CalendarDays className="h-5 w-5" />
                                                                        <span>{t('Starts')}: {localizedFormat(promotion.start_date, 'PPP')}</span>
                                                                    </div>
                                                                )}
                                                                {promotion.end_date && (
                                                                    <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                        <Timer className="h-5 w-5" />
                                                                        <span>{t('Ends')}: {localizedFormat(promotion.end_date, 'PPP')}</span>
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
                                                                href={`https://api.whatsapp.com/send?phone=249912329449&text=${encodeURIComponent(t('Hello, I am interested in the promotion: ') + getLocalizedText(promotion, 'title'))}`}
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
                                {activePromotions.length === 0 && (
                                    <div className="text-center py-12">
                                        <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                            {searchTerm ? t('No matching promotions found') : t('No Active Promotions')}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {searchTerm ? t('Try adjusting your search terms') : t('Check back soon for new promotions!')}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="upcoming">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                    {upcomingPromotions.map((promotion, index) => { // Renamed offer to promotion
                                        const originalValue = promotion.value || 0;
                                        const discountPercentage = promotion.discount_percentage || 0;
                                        const finalPrice = originalValue * (1 - (discountPercentage / 100));
                                        const displayPrice = discountPercentage > 0 ? finalPrice : originalValue;
                                        const currency = promotion.currency || 'SAR';

                                        return (
                                            <MotionCard
                                                key={promotion.id}
                                                variants={cardVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden flex flex-col h-full"
                                            >
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={promotion.image ? `/storage/${promotion.image}` : defaultImageUrl}
                                                        alt={getLocalizedText(promotion, 'title')}
                                                        className="w-full h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e: any) => { e.target.src = defaultImageUrl; }}
                                                    />
                                                    <div className="absolute top-4 right-4 space-x-2">
                                                        <Badge variant="secondary" className="bg-blue-500/90 backdrop-blur-md border-0 text-white font-semibold">
                                                            {t('Upcoming')}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <CardHeader>
                                                    <CardTitle className="text-2xl font-bold">
                                                        {getLocalizedText(promotion, 'title')}
                                                    </CardTitle>
                                                    <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                                                        {getLocalizedText(promotion, 'description')}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent>
                                                    {displayPrice > 0 && (
                                                        <div className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                                                            {t('Price')}: {formatCurrency(displayPrice, currency, i18n.language)}
                                                        </div>
                                                    )}
                                                    <Separator className="my-4" />
                                                    <div className="space-y-3">
                                                        <TooltipProvider>
                                                            {promotion.start_date && (
                                                                <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                    <CalendarDays className="h-5 w-5" />
                                                                    <span>{t('Starts')}: {localizedFormat(promotion.start_date, 'PPP')}</span>
                                                                </div>
                                                            )}
                                                            {promotion.end_date && (
                                                                <div className="flex items-center gap-x-2 text-gray-600 dark:text-gray-300">
                                                                    <Timer className="h-5 w-5" />
                                                                    <span>{t('Ends')}: {localizedFormat(promotion.end_date, 'PPP')}</span>
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
                                                            href={`https://api.whatsapp.com/send?phone=249912329449&text=${encodeURIComponent(t('Hello, I am interested in the upcoming promotion: ') + getLocalizedText(promotion, 'title'))}`}
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
                                {upcomingPromotions.length === 0 && (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                            {t('No Upcoming Promotions')}
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
            </div>
        </PublicLayout>
    );
};

export default PublicPromotionsIndex;
