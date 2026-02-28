import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const servicesData = [
  {
    title: 'E-commerce',
    href: '/ecommerce',
    img: 'images/services/e-commerce-gee.png',
    desc: 'Matger-TUTIA electronically selling of products on online services or over the Internet with several types of payment ....',
  },
  {
    title: 'Bulk SMS',
    href: '/sms',
    img: 'images/services/sms-bluk-service.jpg',
    desc: 'Now in this competitive business TUTIA SMS marketing services has expanded it wings and started delivering efﬁcient ....',
  },
  {
    title: 'Web Development',
    href: '/web',
    img: 'images/services/web-design.jpg',
    desc: 'We design static and dynamic websites for all fields according to high quality principles and standards ...',
  },
  {
    title: 'ICT Consultancy',
    href: '/ict',
    img: 'images/services/business-gbf.jpg',
    desc: 'Our information and communications technology(ICT) consultancey enusures technology not only meets the requirements of ...',
  },
  {
    title: 'Connectivity Solution',
    href: '/connectivity',
    img: 'images/services/network-g.jpg',
    desc: 'We use the latest and most advanced mobile coverage solutions approved by service provider with all network ....',
  },
  {
    title: 'Ticketing System',
    href: '/ticketing',
    img: 'images/services/tickting.png',
    desc: 'TUTIA ticketing system is software that automates your sales, marketing, operations, and ﬁnances. Our software ......',
  },
  {
    title: 'Payment Gateway',
    href: '/payment',
    img: 'images/services/payment.jpg',
    desc: 'With TUTIA Payment gateway work with all major credit card networks, digital wallets, and ecommerce platforms ...',
  },
  {
    title: 'VPN',
    href: '/vpn',
    img: 'images/services/vpn_safety.jpg',
    desc: 'Using TUTIA VPNs is extremely important for any modern business which has a ﬂexible and mobile workforce. As .......',
  },
  {
    title: 'ERP Systems',
    href: '/erp',
    img: 'images/services/erp.jpg',
    desc: 'Increase control over your business with software designed to grow with you. Streamline key ...',
  },
  {
    title: 'Call Center',
    href: '/call_center',
    img: 'images/services/call-centre.jpg',
    desc: 'When a call center modernizes beyond phone calls to support digital channels, it’s even more critical to integrate .....',
  },
  {
    title: 'Satellite Agriculture',
    href: '/satellite-agriculture',
    img: 'images/services/satellite-agriculture.jpg',
    desc: "Satellite-based monitoring for high-frequency crop health tracking, soil moisture measurement, and sustainable farming.",
  }
];

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

export default function PublicServiceCards() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Our <span className="text-blue-600">Services</span>
            </h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Tailored technology solutions designed to elevate your business and drive digital transformation.
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
              <div className="p-8 md:p-10 flex flex-col flex-grow items-start">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    Innovation
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  {service.desc}
                </p>

                <Link
                  href={service.href}
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-tutia hover:bg-blue-700 text-black-800 text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group/btn border border-blue-500/50"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
