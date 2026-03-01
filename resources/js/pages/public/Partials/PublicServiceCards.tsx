import React, { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function PublicServiceCards() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const servicesData = useMemo(() => [
    {
      title: t('Satellite Agriculture'),
      href: '/satellite-agriculture',
      img: 'images/services/satellite-agriculture.jpg',
      desc: t("Satellite Agriculture Desc"),
    },
    {
      title: t('E-commerce'),
      href: '/ecommerce',
      img: 'images/services/e-commerce-gee.png',
      desc: t('E-commerce Desc'),
    },
    {
      title: t('Bulk SMS'),
      href: '/sms',
      img: 'images/services/sms-bluk-service.jpg',
      desc: t('Bulk SMS Desc'),
    },
    {
      title: t('Web Development'),
      href: '/web',
      img: 'images/services/web-design.jpg',
      desc: t('Web Development Desc'),
    },
    {
      title: t('ICT Consultancy'),
      href: '/ict',
      img: 'images/services/business-gbf.jpg',
      desc: t('ICT Consultancy Desc'),
    },
    {
      title: t('Connectivity Solution'),
      href: '/connectivity',
      img: 'images/services/network-g.jpg',
      desc: t('Connectivity Solution Desc'),
    },
    {
      title: t('Ticketing System'),
      href: '/ticketing',
      img: 'images/services/tickting.png',
      desc: t('Ticketing System Desc'),
    },
    {
      title: t('Payment Gateway'),
      href: '/payment',
      img: 'images/services/payment.jpg',
      desc: t('Payment Gateway Desc'),
    },
    {
      title: t('VPN'),
      href: '/vpn',
      img: 'images/services/vpn_safety.jpg',
      desc: t('VPN Desc'),
    },
    {
      title: t('ERP Systems'),
      href: '/erp',
      img: 'images/services/erp.jpg',
      desc: t('ERP Systems Desc'),
    },
    {
      title: t('Call Center'),
      href: '/call_center',
      img: 'images/services/call-centre.jpg',
      desc: t('Call Center Desc'),
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

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 font-oswald">
              {t('Our Services').split(' ').map((word, i) => (
                <span key={i} className={word === 'Services' || word === 'خدماتنا' ? 'text-blue-600' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('Services Subtitle')}
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
        >
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Image Header */}
              <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
              </div>

              {/* Content Area (Below Image) */}
              <div className={cn(
                "p-8 md:p-10 flex flex-col flex-grow items-start",
                isRtl ? "text-right" : "text-left"
              )}>
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {t('Innovation')}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300 font-oswald">
                  {service.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  {service.desc}
                </p>

                <Link
                  href={service.href}
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-tutia hover:bg-blue-700 text-black-800 text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group/btn border border-blue-500/50"
                >
                  {t('View Details')}
                  <ArrowRight className={cn(
                    "w-4 h-4 transition-transform",
                    isRtl ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"
                  )} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
