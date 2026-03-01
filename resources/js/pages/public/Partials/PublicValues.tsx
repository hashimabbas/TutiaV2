import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function PublicValues() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const valuesData = useMemo(() => [
        {
            title: t('Trust'),
            icon: '/images/values/trust.png',
            desc: t('Trust Text'),
        },
        {
            title: t('Commitment'),
            icon: '/images/values/commitment.png',
            desc: t('Commitment Text'),
        },
        {
            title: t('Integrity'),
            icon: '/images/values/integration.png',
            desc: t('Integrity Text'),
        },
        {
            title: t('Result Orientation'),
            icon: '/images/values/stadistics.png',
            desc: t('Result Orientation Text'),
        },
    ], [t]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: isRtl ? 20 : -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="py-24 bg-white dark:bg-gray-950" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-[#2980b9] mb-4 font-oswald">
                            {t('Our Values')}
                        </h2>
                        <p className="text-lg md:text-xl text-[#34495e] font-bold max-w-3xl mx-auto leading-tight">
                            {t('Values Subtitle')}
                        </p>
                    </motion.div>
                </div>

                {/* Values Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 px-4"
                >
                    {valuesData.map((value, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`flex items-start gap-4 ${index === 3 ? 'lg:col-start-1 lg:mt-8' : ''}`}
                        >
                            {/* Icon Container */}
                            <div className="shrink-0">
                                <img
                                    src={value.icon}
                                    alt={value.title}
                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                />
                            </div>

                            {/* Vertical Accent Line */}
                            <div className="w-1.5 self-stretch bg-amber-400 rounded-full mt-2 mb-2 shrink-0" />

                            {/* Text Content */}
                            <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
                                <h3 className="text-2xl font-bold text-[#2980b9] mb-3 font-oswald">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px] font-medium">
                                    {value.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
