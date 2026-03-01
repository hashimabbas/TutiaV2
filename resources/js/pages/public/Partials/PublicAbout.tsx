import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Target, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function PublicAbout() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const aboutContent = useMemo(() => ({
        about: {
            title: t("About Us"),
            icon: <Building2 className="w-5 h-5" />,
            text: t("About Text")
        },
        mission: {
            title: t("Mission"),
            icon: <Target className="w-5 h-5" />,
            text: t("Mission Text")
        },
        vision: {
            title: t("Vision"),
            icon: <Eye className="w-5 h-5" />,
            text: t("Vision Text")
        }
    }), [t]);

    type TabKey = keyof typeof aboutContent;
    const [activeTab, setActiveTab] = useState<TabKey>('about');

    return (
        <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden relative" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Background elements */}
            <div className={cn(
                "absolute top-0 w-80 h-80 rounded-full bg-tutia/5 blur-3xl",
                isRtl ? "left-0 -ml-20 -mt-20" : "right-0 -mr-20 -mt-20"
            )} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Image Stack */}
                    <motion.div
                        initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl ring-1 ring-black/5">
                            <img
                                src="/images/desk.jpg"
                                alt={t("Modern office environment")}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-tutia/40 to-transparent mix-blend-multiply" />
                        </div>

                        {/* Decorative floating card */}
                        <div className={cn(
                            "absolute -bottom-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 max-w-xs backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hidden sm:block",
                            isRtl ? "-left-8" : "-right-8"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tutia/10 text-tutia">
                                    <span className="font-bold text-xl">10+</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{t("Years of")}</p>
                                    <p className="text-sm text-gray-500 font-medium">{t("Industry Excellence")}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Content & Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className={isRtl ? "text-right" : "text-left"}
                    >
                        <div className="mb-8">
                            <span className="text-tutia font-semibold tracking-wider uppercase text-sm mb-2 block">
                                {t("Discover Tutia")}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {t("Empowering growth through")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tutia to-blue-600">
                                    {t("technology")}
                                </span>.
                            </h2>
                        </div>

                        {/* Modern Tab Navigation */}
                        <div className={cn(
                            "flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl mb-8 backdrop-blur-md",
                            isRtl ? "space-x-reverse space-x-1" : "space-x-1"
                        )}>
                            {(Object.keys(aboutContent) as TabKey[]).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "relative flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 outline-none",
                                        activeTab === tab
                                            ? "text-white shadow-sm"
                                            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                                    )}
                                >
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTabBadge"
                                            className="absolute inset-0 bg-tutia rounded-lg"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {aboutContent[tab].icon}
                                        {aboutContent[tab].title}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="relative min-h-[180px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300">
                                        {aboutContent[activeTab].text.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
